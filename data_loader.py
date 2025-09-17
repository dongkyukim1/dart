import asyncio
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from database import async_session
from services import dart_service

# 주요 기업 목록 (미리 데이터를 로드할 기업들)
MAJOR_COMPANIES = [
    {'corp_code': '00126380', 'corp_name': '삼성전자', 'corp_cls': 'Y'},
    {'corp_code': '00164779', 'corp_name': 'SK하이닉스', 'corp_cls': 'Y'}, 
    {'corp_code': '00373617', 'corp_name': 'LG에너지솔루션', 'corp_cls': 'Y'},
    {'corp_code': '00152141', 'corp_name': 'NAVER', 'corp_cls': 'K'},
    {'corp_code': '00237903', 'corp_name': '카카오', 'corp_cls': 'K'},
    {'corp_code': '00126180', 'corp_name': '현대자동차', 'corp_cls': 'Y'},
    {'corp_code': '00165142', 'corp_name': 'LG화학', 'corp_cls': 'Y'},
    {'corp_code': '00118809', 'corp_name': 'POSCO홀딩스', 'corp_cls': 'Y'},
    {'corp_code': '00434003', 'corp_name': '한국전력공사', 'corp_cls': 'Y'},
    {'corp_code': '00204368', 'corp_name': 'KT&G', 'corp_cls': 'Y'},
]

class DataLoader:
    """데이터 로더 클래스"""
    
    def __init__(self):
        self.service = dart_service
    
    async def load_major_companies_data(self):
        """주요 기업들의 공시 및 재무 데이터를 미리 로드"""
        async with async_session() as session:
            print("📊 주요 기업 데이터 로딩 시작...")
            
            for company in MAJOR_COMPANIES:
                try:
                    corp_code = company['corp_code']
                    corp_name = company['corp_name']
                    
                    print(f"🏢 {corp_name} 데이터 로딩 중...")
                    
                    # 1. 최근 6개월 공시 데이터 로드
                    await self._load_company_disclosures(session, corp_code, corp_name)
                    
                    # 2. 최근 3년 재무데이터 로드
                    await self._load_company_financials(session, corp_code, corp_name)
                    
                    print(f"✅ {corp_name} 데이터 로딩 완료")
                    
                except Exception as e:
                    print(f"❌ {corp_name} 데이터 로딩 실패: {e}")
                    continue
            
            print("🎉 주요 기업 데이터 로딩 완료!")
    
    async def _load_company_disclosures(self, session: AsyncSession, corp_code: str, corp_name: str):
        """기업 공시 데이터 로드"""
        # 최근 6개월 데이터
        end_date = datetime.now().strftime("%Y%m%d")
        start_date = (datetime.now() - timedelta(days=180)).strftime("%Y%m%d")
        
        try:
            # 정기공시 (사업보고서, 분기보고서 등)
            disclosure_data = await self.service.search_companies_optimized(
                session=session,
                corp_code=corp_code,
                bgn_de=start_date,
                end_de=end_date,
                pblntf_ty="A",  # 정기공시
                page_count=50
            )
            
            if disclosure_data.get('status') == '000' and disclosure_data.get('list'):
                print(f"  📋 {corp_name} 공시 데이터: {len(disclosure_data['list'])}건")
            
        except Exception as e:
            print(f"  ⚠️ {corp_name} 공시 데이터 로드 실패: {e}")
    
    async def _load_company_financials(self, session: AsyncSession, corp_code: str, corp_name: str):
        """기업 재무 데이터 로드"""
        current_year = datetime.now().year
        years = [str(current_year - i) for i in range(3)]  # 최근 3년
        
        for year in years:
            try:
                # 사업보고서 재무데이터
                financial_data = await self.service.get_financial_data_optimized(
                    session=session,
                    corp_code=corp_code,
                    bsns_year=year,
                    reprt_code="11011"  # 사업보고서
                )
                
                if financial_data.get('status') == '000' and financial_data.get('list'):
                    print(f"  💰 {corp_name} {year}년 재무데이터: {len(financial_data['list'])}건")
                
                # API 부하를 줄이기 위해 잠시 대기
                await asyncio.sleep(1)
                
            except Exception as e:
                print(f"  ⚠️ {corp_name} {year}년 재무데이터 로드 실패: {e}")
                continue
    
    async def load_popular_accounts(self):
        """인기 계정명 미리 로드"""
        async with async_session() as session:
            print("📊 인기 계정명 데이터 로딩...")
            
            # 주요 계정명들을 미리 캐시에 추가
            major_accounts = [
                "매출액", "영업이익", "당기순이익", "총자산", "부채총계",
                "자본총계", "현금및현금성자산", "재고자산", "유형자산",
                "무형자산", "매출채권", "매입채무", "단기차입금", "장기차입금",
                "자본금", "이익잉여금", "영업활동현금흐름", "투자활동현금흐름",
                "재무활동현금흐름", "매출원가", "판매비와관리비", "연구개발비",
                "감가상각비", "금융비용", "법인세비용", "주당순이익"
            ]
            
            from database import AccountCache
            
            for account_name in major_accounts:
                try:
                    # 계정명 캐시에 추가
                    from sqlalchemy import select
                    stmt = select(AccountCache).where(AccountCache.account_nm == account_name)
                    result = await session.execute(stmt)
                    existing = result.scalar_one_or_none()
                    
                    if not existing:
                        cache_entry = AccountCache(
                            account_nm=account_name,
                            usage_count=1
                        )
                        session.add(cache_entry)
                
                except Exception as e:
                    print(f"계정명 '{account_name}' 캐시 추가 실패: {e}")
            
            await session.commit()
            print("✅ 인기 계정명 로딩 완료!")

# 데이터 로더 인스턴스
data_loader = DataLoader()

async def initialize_sample_data():
    """샘플 데이터 초기화"""
    print("🚀 샘플 데이터 초기화 시작...")
    
    try:
        # 1. 인기 계정명 로드
        await data_loader.load_popular_accounts()
        
        # 2. 주요 기업 데이터 로드 (선택적 - 시간이 오래 걸림)
        # await data_loader.load_major_companies_data()
        
        print("🎉 샘플 데이터 초기화 완료!")
        
    except Exception as e:
        print(f"❌ 샘플 데이터 초기화 실패: {e}")

if __name__ == "__main__":
    # 직접 실행시 샘플 데이터 로드
    asyncio.run(initialize_sample_data())
