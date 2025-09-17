import asyncio
import json
import hashlib
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_, desc, asc, text
from sqlalchemy.orm import selectinload
import httpx
import os

from database import (
    Company, DisclosureDocument, FinancialStatement, 
    AccountCache, ApiCache, get_db
)

# 환경변수 로드
from dotenv import load_dotenv
load_dotenv()

DART_API_KEY = os.getenv("DART_API_KEY", "")
DART_BASE_URL = "https://opendart.fss.or.kr/api"

class DartApiService:
    """DART API 서비스 클래스"""
    
    def __init__(self):
        self.api_key = DART_API_KEY
        self.base_url = DART_BASE_URL
        print(f"DartApiService 초기화: API 키 있음={bool(self.api_key)}, 키 길이={len(self.api_key) if self.api_key else 0}")
        
    def _generate_cache_key(self, endpoint: str, params: Dict) -> str:
        """캐시 키 생성"""
        # API 키 제외하고 캐시 키 생성
        cache_params = {k: v for k, v in params.items() if k != 'crtfc_key'}
        param_str = json.dumps(cache_params, sort_keys=True)
        return hashlib.md5(f"{endpoint}:{param_str}".encode()).hexdigest()
    
    async def _get_cached_response(self, session: AsyncSession, cache_key: str) -> Optional[Dict]:
        """캐시된 응답 조회"""
        stmt = select(ApiCache).where(
            and_(
                ApiCache.cache_key == cache_key,
                ApiCache.expires_at > datetime.utcnow()
            )
        )
        result = await session.execute(stmt)
        cache_entry = result.scalar_one_or_none()
        
        if cache_entry:
            return json.loads(cache_entry.response_data)
        return None
    
    async def _cache_response(
        self, 
        session: AsyncSession, 
        cache_key: str, 
        data: Dict, 
        cache_hours: int = 6
    ):
        """응답 캐싱"""
        expires_at = datetime.utcnow() + timedelta(hours=cache_hours)
        
        # 기존 캐시 삭제 후 새로 생성
        stmt = select(ApiCache).where(ApiCache.cache_key == cache_key)
        result = await session.execute(stmt)
        existing = result.scalar_one_or_none()
        
        if existing:
            existing.response_data = json.dumps(data)
            existing.expires_at = expires_at
        else:
            cache_entry = ApiCache(
                cache_key=cache_key,
                response_data=json.dumps(data),
                expires_at=expires_at
            )
            session.add(cache_entry)
        
        await session.commit()
    
    async def _make_api_request(self, endpoint: str, params: Dict) -> Dict:
        """실제 API 요청"""
        if not self.api_key:
            # API 키가 없는 경우 에러 응답 반환
            return {
                "status": "013",
                "message": "인증키가 누락되었습니다.",
                "list": []
            }
        
        params['crtfc_key'] = self.api_key
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{self.base_url}/{endpoint}", params=params)
            response.raise_for_status()
            return response.json()
    
    async def search_companies_optimized(
        self, 
        session: AsyncSession,
        corp_code: Optional[str] = None,
        corp_name: Optional[str] = None,
        bgn_de: Optional[str] = None,
        end_de: Optional[str] = None,
        pblntf_ty: Optional[str] = None,
        corp_cls: Optional[str] = None,
        page_no: int = 1,
        page_count: int = 20
    ) -> Dict:
        """최적화된 기업 검색"""
        
        # API 키가 없는 경우 로컬 DB만 사용
        if not self.api_key:
            print("API 키가 없어 로컬 DB만 사용합니다.")
            
            if corp_name:
                return await self._search_companies_local(
                    session, corp_name, corp_cls, page_no, page_count
                )
            elif corp_code:
                return await self._search_by_corp_code_local(session, corp_code, page_no, page_count)
            else:
                # 일반적인 검색 - 로컬 DB에서 최근 데이터 반환
                return await self._get_recent_companies_local(session, corp_cls, page_no, page_count)
        
        # 먼저 로컬 DB에서 검색 시도 (기업명 검색인 경우)
        if corp_name:
            local_results = await self._search_companies_local(
                session, corp_name, corp_cls, page_no, page_count
            )
            if local_results['list']:
                print(f"로컬 DB에서 '{corp_name}' 검색 결과: {len(local_results['list'])}건")
                return local_results
            else:
                print(f"로컬 DB에 '{corp_name}' 데이터가 없어 API 호출을 시도합니다.")
        
        # 특정 기업 고유번호로 검색하는 경우 로컬 DB 먼저 확인
        if corp_code:
            local_corp_results = await self._search_by_corp_code_local(session, corp_code, page_no, page_count)
            if local_corp_results['list']:
                print(f"로컬 DB에서 기업코드 '{corp_code}' 검색 결과: {len(local_corp_results['list'])}건")
                return local_corp_results
            else:
                print(f"로컬 DB에 기업코드 '{corp_code}' 데이터가 없어 API 호출을 시도합니다.")
        
        # 로컬에서 찾지 못하면 API 호출
        params = {
            'corp_code': corp_code,
            'bgn_de': bgn_de,
            'end_de': end_de,
            'pblntf_ty': pblntf_ty,
            'corp_cls': corp_cls,
            'page_no': page_no,
            'page_count': page_count
        }
        
        # None 값 제거
        params = {k: v for k, v in params.items() if v is not None}
        
        print(f"API 호출 - 파라미터: {params}")
        
        cache_key = self._generate_cache_key("list.json", params)
        
        # 캐시 확인
        cached_data = await self._get_cached_response(session, cache_key)
        if cached_data:
            return cached_data
        
        # API 호출
        data = await self._make_api_request("list.json", params)
        
        # 성공한 경우 DB에 저장 및 캐싱
        if data.get('status') == '000' and data.get('list'):
            await self._save_disclosure_documents(session, data['list'])
            await self._cache_response(session, cache_key, data, cache_hours=2)
        
        return data
    
    async def _get_recent_companies_local(
        self, 
        session: AsyncSession, 
        corp_cls: Optional[str] = None,
        page_no: int = 1,
        page_count: int = 20
    ) -> Dict:
        """로컬 DB에서 최근 기업 데이터 조회"""
        
        stmt = select(DisclosureDocument).order_by(desc(DisclosureDocument.rcept_dt))
        
        if corp_cls:
            stmt = stmt.where(DisclosureDocument.corp_cls == corp_cls)
        
        # 페이징
        offset = (page_no - 1) * page_count
        stmt = stmt.offset(offset).limit(page_count)
        
        result = await session.execute(stmt)
        documents = result.scalars().all()
        
        # 전체 건수 조회
        count_stmt = select(func.count(DisclosureDocument.rcept_no))
        if corp_cls:
            count_stmt = count_stmt.where(DisclosureDocument.corp_cls == corp_cls)
            
        count_result = await session.execute(count_stmt)
        total_count = count_result.scalar()
        
        # 결과 형태 맞추기
        document_list = []
        for doc in documents:
            document_list.append({
                'rcept_no': doc.rcept_no,
                'corp_code': doc.corp_code,
                'corp_name': doc.corp_name,
                'corp_cls': doc.corp_cls,
                'report_nm': doc.report_nm,
                'rcept_dt': doc.rcept_dt,
                'flr_nm': doc.flr_nm,
                'rm': doc.rm or ''
            })
        
        return {
            'status': '000',
            'message': '정상 (로컬 DB)',
            'page_no': page_no,
            'page_count': page_count,
            'total_count': total_count,
            'total_page': (total_count + page_count - 1) // page_count,
            'list': document_list
        }
    
    async def _search_companies_local(
        self, 
        session: AsyncSession, 
        corp_name: str,
        corp_cls: Optional[str] = None,
        page_no: int = 1,
        page_count: int = 20
    ) -> Dict:
        """로컬 DB에서 기업 검색"""
        
        # 기본 쿼리
        stmt = select(DisclosureDocument).where(
            DisclosureDocument.corp_name.like(f"%{corp_name}%")
        )
        
        # 법인구분 필터
        if corp_cls:
            stmt = stmt.where(DisclosureDocument.corp_cls == corp_cls)
        
        # 최신 순 정렬
        stmt = stmt.order_by(desc(DisclosureDocument.rcept_dt))
        
        # 페이징
        offset = (page_no - 1) * page_count
        stmt = stmt.offset(offset).limit(page_count)
        
        result = await session.execute(stmt)
        documents = result.scalars().all()
        
        # 전체 건수 조회
        count_stmt = select(func.count(DisclosureDocument.rcept_no)).where(
            DisclosureDocument.corp_name.like(f"%{corp_name}%")
        )
        if corp_cls:
            count_stmt = count_stmt.where(DisclosureDocument.corp_cls == corp_cls)
        
        count_result = await session.execute(count_stmt)
        total_count = count_result.scalar()
        
        # 결과 형태 맞추기
        document_list = []
        for doc in documents:
            document_list.append({
                'rcept_no': doc.rcept_no,
                'corp_code': doc.corp_code,
                'corp_name': doc.corp_name,
                'corp_cls': doc.corp_cls,
                'report_nm': doc.report_nm,
                'rcept_dt': doc.rcept_dt,
                'flr_nm': doc.flr_nm,
                'rm': doc.rm or ''
            })
        
        return {
            'status': '000',
            'message': '정상',
            'page_no': page_no,
            'page_count': page_count,
            'total_count': total_count,
            'total_page': (total_count + page_count - 1) // page_count,
            'list': document_list
        }
    
    async def _search_by_corp_code_local(
        self, 
        session: AsyncSession, 
        corp_code: str,
        page_no: int = 1,
        page_count: int = 20
    ) -> Dict:
        """기업 고유번호로 로컬 DB 검색"""
        
        # 기본 쿼리
        stmt = select(DisclosureDocument).where(
            DisclosureDocument.corp_code == corp_code
        )
        
        # 최신 순 정렬
        stmt = stmt.order_by(desc(DisclosureDocument.rcept_dt))
        
        # 페이징
        offset = (page_no - 1) * page_count
        stmt = stmt.offset(offset).limit(page_count)
        
        result = await session.execute(stmt)
        documents = result.scalars().all()
        
        # 전체 건수 조회
        count_stmt = select(func.count(DisclosureDocument.rcept_no)).where(
            DisclosureDocument.corp_code == corp_code
        )
        
        count_result = await session.execute(count_stmt)
        total_count = count_result.scalar()
        
        # 결과 형태 맞추기
        document_list = []
        for doc in documents:
            document_list.append({
                'rcept_no': doc.rcept_no,
                'corp_code': doc.corp_code,
                'corp_name': doc.corp_name,
                'corp_cls': doc.corp_cls,
                'report_nm': doc.report_nm,
                'rcept_dt': doc.rcept_dt,
                'flr_nm': doc.flr_nm,
                'rm': doc.rm or ''
            })
        
        return {
            'status': '000',
            'message': '정상',
            'page_no': page_no,
            'page_count': page_count,
            'total_count': total_count,
            'total_page': (total_count + page_count - 1) // page_count,
            'list': document_list
        }
    
    async def _save_disclosure_documents(self, session: AsyncSession, documents: List[Dict]):
        """공시 문서를 DB에 저장 (기업 정보도 함께 저장)"""
        saved_count = 0
        
        for doc_data in documents:
            # 1. 기업 정보 저장/업데이트
            await self._save_company_info(session, doc_data)
            
            # 2. 공시 문서 중복 확인
            stmt = select(DisclosureDocument).where(
                DisclosureDocument.rcept_no == doc_data['rcept_no']
            )
            result = await session.execute(stmt)
            existing = result.scalar_one_or_none()
            
            if not existing:
                document = DisclosureDocument(
                    rcept_no=doc_data['rcept_no'],
                    corp_code=doc_data['corp_code'],
                    corp_name=doc_data['corp_name'],
                    corp_cls=doc_data.get('corp_cls'),
                    report_nm=doc_data['report_nm'],
                    rcept_dt=doc_data['rcept_dt'],
                    flr_nm=doc_data['flr_nm'],
                    pblntf_ty=doc_data.get('pblntf_ty'),
                    pblntf_detail_ty=doc_data.get('pblntf_detail_ty'),
                    rm=doc_data.get('rm', '')
                )
                session.add(document)
                saved_count += 1
        
        await session.commit()
        print(f"새로 저장된 공시 문서: {saved_count}건")
    
    async def _save_company_info(self, session: AsyncSession, doc_data: Dict):
        """기업 정보 저장/업데이트"""
        corp_code = doc_data['corp_code']
        corp_name = doc_data['corp_name']
        corp_cls = doc_data.get('corp_cls')
        
        # 기존 기업 정보 확인
        stmt = select(Company).where(Company.corp_code == corp_code)
        result = await session.execute(stmt)
        existing_company = result.scalar_one_or_none()
        
        if existing_company:
            # 기업 정보 업데이트
            existing_company.corp_name = corp_name
            existing_company.corp_cls = corp_cls
            existing_company.updated_at = datetime.utcnow()
        else:
            # 새 기업 정보 생성
            company = Company(
                corp_code=corp_code,
                corp_name=corp_name,
                corp_cls=corp_cls
            )
            session.add(company)
    
    async def get_financial_data_optimized(
        self,
        session: AsyncSession,
        corp_code: str,
        bsns_year: str,
        reprt_code: str = "11011"
    ) -> Dict:
        """최적화된 재무제표 데이터 조회"""
        
        # 먼저 로컬 DB에서 조회
        local_data = await self._get_financial_data_local(
            session, corp_code, bsns_year, reprt_code
        )
        
        if local_data['list']:
            return local_data
        
        # 로컬에 없으면 API 호출
        params = {
            'corp_code': corp_code,
            'bsns_year': bsns_year,
            'reprt_code': reprt_code
        }
        
        cache_key = self._generate_cache_key("fnlttSinglAcnt.json", params)
        
        # 캐시 확인
        cached_data = await self._get_cached_response(session, cache_key)
        if cached_data:
            return cached_data
        
        # API 호출
        data = await self._make_api_request("fnlttSinglAcnt.json", params)
        
        # 성공한 경우 DB에 저장 및 캐싱
        if data.get('status') == '000' and data.get('list'):
            await self._save_financial_statements(session, data['list'], corp_code, bsns_year, reprt_code)
            await self._update_account_cache(session, data['list'])
            await self._cache_response(session, cache_key, data, cache_hours=24)  # 재무데이터는 24시간 캐싱
        
        return data
    
    async def _get_financial_data_local(
        self,
        session: AsyncSession,
        corp_code: str,
        bsns_year: str,
        reprt_code: str
    ) -> Dict:
        """로컬 DB에서 재무제표 데이터 조회"""
        
        stmt = select(FinancialStatement).where(
            and_(
                FinancialStatement.corp_code == corp_code,
                FinancialStatement.bsns_year == bsns_year,
                FinancialStatement.reprt_code == reprt_code
            )
        ).order_by(asc(FinancialStatement.ord))
        
        result = await session.execute(stmt)
        statements = result.scalars().all()
        
        # 결과 형태 맞추기
        statement_list = []
        for stmt in statements:
            statement_list.append({
                'sj_div': stmt.sj_div,
                'sj_nm': stmt.sj_nm,
                'account_id': stmt.account_id,
                'account_nm': stmt.account_nm,
                'account_detail': stmt.account_detail,
                'thstrm_nm': stmt.thstrm_nm,
                'thstrm_amount': stmt.thstrm_amount,
                'frmtrm_nm': stmt.frmtrm_nm,
                'frmtrm_amount': stmt.frmtrm_amount,
                'bfefrmtrm_nm': stmt.bfefrmtrm_nm,
                'bfefrmtrm_amount': stmt.bfefrmtrm_amount,
                'ord': stmt.ord,
                'currency': stmt.currency
            })
        
        return {
            'status': '000' if statement_list else '013',
            'message': '정상' if statement_list else '조회된 데이타가 없습니다.',
            'list': statement_list
        }
    
    async def _save_financial_statements(
        self, 
        session: AsyncSession, 
        statements: List[Dict],
        corp_code: str,
        bsns_year: str,
        reprt_code: str
    ):
        """재무제표 데이터를 DB에 저장"""
        
        # 기존 데이터 삭제
        from sqlalchemy import delete
        delete_stmt = delete(FinancialStatement).where(
            and_(
                FinancialStatement.corp_code == corp_code,
                FinancialStatement.bsns_year == bsns_year,
                FinancialStatement.reprt_code == reprt_code
            )
        )
        await session.execute(delete_stmt)
        
        # 새 데이터 삽입
        for stmt_data in statements:
            statement = FinancialStatement(
                corp_code=corp_code,
                bsns_year=bsns_year,
                reprt_code=reprt_code,
                sj_div=stmt_data.get('sj_div'),
                sj_nm=stmt_data.get('sj_nm'),
                account_id=stmt_data.get('account_id'),
                account_nm=stmt_data.get('account_nm', ''),
                account_detail=stmt_data.get('account_detail'),
                thstrm_nm=stmt_data.get('thstrm_nm'),
                thstrm_amount=stmt_data.get('thstrm_amount'),
                frmtrm_nm=stmt_data.get('frmtrm_nm'),
                frmtrm_amount=stmt_data.get('frmtrm_amount'),
                bfefrmtrm_nm=stmt_data.get('bfefrmtrm_nm'),
                bfefrmtrm_amount=stmt_data.get('bfefrmtrm_amount'),
                ord=stmt_data.get('ord'),
                currency=stmt_data.get('currency')
            )
            session.add(statement)
        
        await session.commit()
    
    async def _update_account_cache(self, session: AsyncSession, statements: List[Dict]):
        """계정명 캐시 업데이트"""
        account_names = set()
        for stmt in statements:
            if stmt.get('account_nm'):
                account_names.add(stmt['account_nm'])
        
        for account_nm in account_names:
            stmt = select(AccountCache).where(AccountCache.account_nm == account_nm)
            result = await session.execute(stmt)
            existing = result.scalar_one_or_none()
            
            if existing:
                existing.usage_count += 1
                existing.last_used = datetime.utcnow()
            else:
                cache_entry = AccountCache(
                    account_nm=account_nm,
                    usage_count=1
                )
                session.add(cache_entry)
        
        await session.commit()
    
    async def get_popular_accounts(
        self, 
        session: AsyncSession, 
        limit: int = 50
    ) -> List[str]:
        """인기 계정명 조회"""
        stmt = select(AccountCache.account_nm).order_by(
            desc(AccountCache.usage_count),
            desc(AccountCache.last_used)
        ).limit(limit)
        
        result = await session.execute(stmt)
        return [row[0] for row in result.all()]
    
    async def search_accounts(
        self, 
        session: AsyncSession, 
        query: str, 
        limit: int = 20
    ) -> List[str]:
        """계정명 검색"""
        stmt = select(AccountCache.account_nm).where(
            AccountCache.account_nm.like(f"%{query}%")
        ).order_by(
            desc(AccountCache.usage_count)
        ).limit(limit)
        
        result = await session.execute(stmt)
        return [row[0] for row in result.all()]

# 서비스 인스턴스
dart_service = DartApiService()
