from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
import httpx
import os
from datetime import datetime, timedelta
from typing import Optional, List
from dotenv import load_dotenv
import asyncio

from database import init_db, get_db, cleanup_expired_cache
from services import dart_service
from xbrl_parser import xbrl_parser, generate_sample_hierarchical_data

load_dotenv()

# DART API 기본 설정
DART_API_KEY = os.getenv("DART_API_KEY", "")  # 환경변수에서 API 키 로드
DART_BASE_URL = "https://opendart.fss.or.kr/api"

print(f"🔑 API 키 로드 상태: {'있음' if DART_API_KEY else '없음'} (길이: {len(DART_API_KEY) if DART_API_KEY else 0})")

app = FastAPI(title="DART 재무제표 분석 시스템", version="2.0.0")

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인으로 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """앱 시작시 실행"""
    await init_db()
    print("데이터베이스 초기화 완료")
    
    # 샘플 데이터 로드 (백그라운드)
    asyncio.create_task(load_sample_data_background())
    
    # 만료된 캐시 정리 (백그라운드)
    asyncio.create_task(periodic_cache_cleanup())

async def load_sample_data_background():
    """백그라운드에서 샘플 데이터 로드"""
    try:
        from data_loader import initialize_sample_data
        await asyncio.sleep(2)  # 서버 시작 후 2초 대기
        await initialize_sample_data()
    except Exception as e:
        print(f"샘플 데이터 로드 오류: {e}")

async def periodic_cache_cleanup():
    """주기적 캐시 정리"""
    while True:
        try:
            await cleanup_expired_cache()
            print("만료된 캐시 정리 완료")
        except Exception as e:
            print(f"캐시 정리 오류: {e}")
        
        # 6시간마다 실행
        await asyncio.sleep(6 * 3600)

class CompanySearchRequest(BaseModel):
    corp_code: Optional[str] = None
    bgn_de: Optional[str] = None
    end_de: Optional[str] = None
    last_reprt_at: Optional[str] = "N"
    pblntf_ty: Optional[str] = None
    corp_cls: Optional[str] = None
    page_no: Optional[int] = 1
    page_count: Optional[int] = 10

class FinancialDataRequest(BaseModel):
    corp_code: str
    bsns_year: str
    reprt_code: str = "11011"  # 기본값: 사업보고서

@app.get("/")
async def read_root():
    return {
        "message": "DART 재무제표 분석 시스템 API", 
        "version": "1.0.0",
        "status": "running",
        "dart_api_configured": bool(DART_API_KEY)
    }

@app.post("/api/company/search")
async def search_companies(request: CompanySearchRequest, db: AsyncSession = Depends(get_db)):
    """기업 공시 검색 (최적화된)"""
    if not DART_API_KEY:
        raise HTTPException(status_code=500, detail="DART API 키가 설정되지 않았습니다.")
    
    try:
        data = await dart_service.search_companies_optimized(
            session=db,
            corp_code=request.corp_code,
            bgn_de=request.bgn_de,
            end_de=request.end_de,
            pblntf_ty=request.pblntf_ty,
            corp_cls=request.corp_cls,
            page_no=request.page_no,
            page_count=request.page_count
        )
        
        if data.get("status") != "000":
            raise HTTPException(status_code=400, detail=f"DART API 오류: {data.get('message', '알 수 없는 오류')}")
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"검색 오류: {str(e)}")

@app.get("/api/company/list")
async def get_company_list(db: AsyncSession = Depends(get_db)):
    """전체 기업 목록 조회 (최적화된)"""
    try:
        # API 키가 없는 경우 로컬 DB에서 조회
        if not DART_API_KEY:
            # 로컬 DB에서 최근 기업 목록 반환
            from sqlalchemy import select, func
            stmt = select(Company).order_by(Company.updated_at.desc()).limit(20)
            result = await db.execute(stmt)
            companies = result.scalars().all()
            
            company_list = []
            for company in companies:
                company_list.append({
                    'corp_code': company.corp_code,
                    'corp_name': company.corp_name,
                    'corp_cls': company.corp_cls,
                    'report_nm': '사업보고서',
                    'rcept_dt': datetime.now().strftime("%Y%m%d"),
                    'flr_nm': company.corp_name,
                    'rm': ''
                })
            
            return {
                "status": "000",
                "message": "정상 (로컬 DB)",
                "page_no": 1,
                "page_count": 20,
                "total_count": len(company_list),
                "total_page": 1,
                "list": company_list
            }
        
        # 최근 1개월 데이터 조회 (API 직접 호출 강제)
        today = datetime.now().strftime("%Y%m%d")
        last_month = (datetime.now() - timedelta(days=30)).strftime("%Y%m%d")
        
        # 로컬 DB 건너뛰고 API 직접 호출
        params = {
            'bgn_de': last_month,
            'end_de': today,
            'pblntf_ty': 'A',
            'page_no': 1,
            'page_count': 20
        }
        
        data = await dart_service._make_api_request("list.json", params)
        
        # 성공한 경우 DB에 저장
        if data.get('status') == '000' and data.get('list'):
            await dart_service._save_disclosure_documents(db, data['list'])
        
        if data.get("status") != "000":
            raise HTTPException(status_code=400, detail=f"DART API 오류: {data.get('message', '알 수 없는 오류')}")
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API 요청 오류: {str(e)}")

@app.post("/api/financial/data")
async def get_financial_data(request: FinancialDataRequest, db: AsyncSession = Depends(get_db)):
    """재무제표 데이터 조회 (최적화된)"""
    try:
        # API 키가 없어도 샘플 데이터로 응답
        if not DART_API_KEY:
            print("API 키가 없어 샘플 재무데이터를 반환합니다.")
            return {
                "status": "000",
                "message": "샘플 데이터 (API 키 없음)",
                "list": [
                    {
                        "corp_code": request.corp_code,
                        "bsns_year": request.bsns_year,
                        "reprt_code": request.reprt_code,
                        "sj_div": "BS",
                        "sj_nm": "재무상태표",
                        "account_nm": "자산총계",
                        "thstrm_amount": "500000000000",
                        "frmtrm_amount": "450000000000",
                        "bfefrmtrm_amount": "400000000000"
                    },
                    {
                        "corp_code": request.corp_code,
                        "bsns_year": request.bsns_year,
                        "reprt_code": request.reprt_code,
                        "sj_div": "BS",
                        "sj_nm": "재무상태표",
                        "account_nm": "부채총계",
                        "thstrm_amount": "200000000000",
                        "frmtrm_amount": "180000000000",
                        "bfefrmtrm_amount": "160000000000"
                    },
                    {
                        "corp_code": request.corp_code,
                        "bsns_year": request.bsns_year,
                        "reprt_code": request.reprt_code,
                        "sj_div": "IS",
                        "sj_nm": "손익계산서",
                        "account_nm": "매출액",
                        "thstrm_amount": "800000000000",
                        "frmtrm_amount": "750000000000",
                        "bfefrmtrm_amount": "700000000000"
                    }
                ]
            }
        
        data = await dart_service.get_financial_data_optimized(
            session=db,
            corp_code=request.corp_code,
            bsns_year=request.bsns_year,
            reprt_code=request.reprt_code
        )
        
        if data.get("status") != "000":
            raise HTTPException(status_code=400, detail=f"DART API 오류: {data.get('message', '알 수 없는 오류')}")
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"재무데이터 조회 오류: {str(e)}")

# 새로운 최적화된 엔드포인트들
@app.get("/api/accounts/popular")
async def get_popular_accounts(limit: int = 50, db: AsyncSession = Depends(get_db)):
    """인기 계정명 조회"""
    try:
        accounts = await dart_service.get_popular_accounts(db, limit)
        return {
            "status": "000",
            "message": "정상",
            "accounts": accounts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"계정명 조회 오류: {str(e)}")

@app.get("/api/accounts/search")
async def search_accounts(query: str, limit: int = 20, db: AsyncSession = Depends(get_db)):
    """계정명 검색"""
    try:
        accounts = await dart_service.search_accounts(db, query, limit)
        return {
            "status": "000",
            "message": "정상",
            "accounts": accounts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"계정명 검색 오류: {str(e)}")

@app.post("/api/company/search/name")
async def search_companies_by_name(
    corp_name: str, 
    corp_cls: Optional[str] = None,
    page_no: int = 1,
    page_count: int = 20,
    db: AsyncSession = Depends(get_db)
):
    """기업명으로 검색 (빠른 검색용)"""
    try:
        data = await dart_service.search_companies_optimized(
            session=db,
            corp_name=corp_name,
            corp_cls=corp_cls,
            page_no=page_no,
            page_count=page_count
        )
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"기업명 검색 오류: {str(e)}")

@app.post("/api/data/load-major-companies")
async def load_major_companies_data(db: AsyncSession = Depends(get_db)):
    """주요 기업 데이터 수동 로드"""
    try:
        from data_loader import data_loader
        
        # 백그라운드에서 실행
        asyncio.create_task(data_loader.load_major_companies_data())
        
        return {
            "status": "000",
            "message": "주요 기업 데이터 로딩이 백그라운드에서 시작되었습니다."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"데이터 로드 오류: {str(e)}")

@app.get("/api/data/status")
async def get_data_status(db: AsyncSession = Depends(get_db)):
    """데이터베이스 현황 조회"""
    try:
        from sqlalchemy import text
        
        # 테이블별 데이터 개수 조회
        result = await db.execute(text("""
            SELECT 
                'companies' as table_name, 
                (SELECT COUNT(*) FROM companies) as count
            UNION ALL
            SELECT 
                'disclosure_documents' as table_name, 
                (SELECT COUNT(*) FROM disclosure_documents) as count
            UNION ALL
            SELECT 
                'financial_statements' as table_name, 
                (SELECT COUNT(*) FROM financial_statements) as count
            UNION ALL
            SELECT 
                'account_cache' as table_name, 
                (SELECT COUNT(*) FROM account_cache) as count
            UNION ALL
            SELECT 
                'api_cache' as table_name, 
                (SELECT COUNT(*) FROM api_cache) as count
        """))
        
        data_status = {}
        for row in result:
            data_status[row[0]] = row[1]
        
        return {
            "status": "000",
            "message": "정상",
            "data": data_status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"데이터 현황 조회 오류: {str(e)}")

@app.get("/api/financial/hierarchical/{corp_code}")
async def get_hierarchical_financial_data(
    corp_code: str,
    years: int = 5,
    db: AsyncSession = Depends(get_db)
):
    """계층형 재무제표 데이터 조회 (네이버 증권 스타일)"""
    try:
        # 현재는 샘플 데이터 반환 (실제로는 XBRL 데이터를 파싱해야 함)
        hierarchical_data = generate_sample_hierarchical_data()
        
        return {
            "status": "000",
            "message": "정상",
            "corp_code": corp_code,
            "data_type": "hierarchical",
            "years_requested": years,
            "data": hierarchical_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"계층형 재무데이터 조회 오류: {str(e)}")

@app.get("/api/financial/xbrl/{corp_code}")
async def get_xbrl_financial_data(
    corp_code: str,
    bsns_year: str,
    reprt_code: str = "11011",
    db: AsyncSession = Depends(get_db)
):
    """XBRL 재무제표 데이터 조회 및 파싱"""
    if not DART_API_KEY:
        raise HTTPException(status_code=500, detail="DART API 키가 설정되지 않았습니다.")
    
    try:
        # DART API에서 XBRL 데이터 조회
        params = {
            "crtfc_key": DART_API_KEY,
            "corp_code": corp_code,
            "bsns_year": bsns_year,
            "reprt_code": reprt_code
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            # XBRL 원문 조회 API 호출 (올바른 엔드포인트 사용)
            response = await client.get(
                f"{DART_BASE_URL}/fnlttXbrl.xml", 
                params=params
            )
            response.raise_for_status()
            xbrl_data = response.json()
            
            if xbrl_data.get("status") != "000":
                # XBRL 데이터가 없으면 샘플 데이터 반환
                print(f"XBRL 데이터 없음, 샘플 데이터 반환: {xbrl_data.get('message')}")
                hierarchical_data = generate_sample_hierarchical_data()
                return {
                    "status": "000",
                    "message": "샘플 데이터 (XBRL 데이터 없음)",
                    "corp_code": corp_code,
                    "bsns_year": bsns_year,
                    "data_type": "sample",
                    "data": hierarchical_data
                }
            
            # XBRL 내용 파싱
            if xbrl_data.get("list") and len(xbrl_data["list"]) > 0:
                xbrl_content = xbrl_data["list"][0].get("xbrl_cont", "")
                if xbrl_content:
                    parsed_data = xbrl_parser.parse_xbrl_content(xbrl_content)
                    
                    return {
                        "status": "000",
                        "message": "정상",
                        "corp_code": corp_code,
                        "bsns_year": bsns_year,
                        "data_type": "xbrl_parsed",
                        "data": parsed_data
                    }
            
            # 파싱할 수 없으면 샘플 데이터
            hierarchical_data = generate_sample_hierarchical_data()
            return {
                "status": "000",
                "message": "샘플 데이터 (XBRL 파싱 실패)",
                "corp_code": corp_code,
                "bsns_year": bsns_year,
                "data_type": "sample",
                "data": hierarchical_data
            }
            
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"XBRL API 요청 오류: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"XBRL 처리 오류: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
