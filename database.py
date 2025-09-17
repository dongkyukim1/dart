import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped
from sqlalchemy import String, DateTime, Text, Integer, Boolean, Index
from datetime import datetime
from typing import Optional
import os

# 데이터베이스 URL 설정
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./dart_data.db")

# 비동기 엔진 생성
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # SQL 로그 출력 (개발시에만 True)
    future=True
)

# 세션 팩토리 생성
async_session = async_sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

class Company(Base):
    """기업 정보 테이블"""
    __tablename__ = "companies"
    
    corp_code: Mapped[str] = mapped_column(String(8), primary_key=True)
    corp_name: Mapped[str] = mapped_column(String(200), nullable=False)
    stock_code: Mapped[Optional[str]] = mapped_column(String(20))
    modify_date: Mapped[Optional[str]] = mapped_column(String(8))
    corp_cls: Mapped[Optional[str]] = mapped_column(String(1))  # Y: 유가, K: 코스닥, N: 코넥스, E: 기타
    sector: Mapped[Optional[str]] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 인덱스 설정
    __table_args__ = (
        Index('idx_corp_name', 'corp_name'),
        Index('idx_corp_cls', 'corp_cls'),
        Index('idx_stock_code', 'stock_code'),
    )

class DisclosureDocument(Base):
    """공시 문서 테이블"""
    __tablename__ = "disclosure_documents"
    
    rcept_no: Mapped[str] = mapped_column(String(14), primary_key=True)
    corp_code: Mapped[str] = mapped_column(String(8), nullable=False)
    corp_name: Mapped[str] = mapped_column(String(200), nullable=False)
    corp_cls: Mapped[Optional[str]] = mapped_column(String(1))
    report_nm: Mapped[str] = mapped_column(String(300), nullable=False)
    rcept_dt: Mapped[str] = mapped_column(String(8), nullable=False)
    flr_nm: Mapped[str] = mapped_column(String(200), nullable=False)
    pblntf_ty: Mapped[Optional[str]] = mapped_column(String(1))  # 공시유형
    pblntf_detail_ty: Mapped[Optional[str]] = mapped_column(String(4))  # 공시상세유형
    rm: Mapped[Optional[str]] = mapped_column(String(500))  # 비고
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # 인덱스 설정
    __table_args__ = (
        Index('idx_corp_code', 'corp_code'),
        Index('idx_rcept_dt', 'rcept_dt'),
        Index('idx_corp_name', 'corp_name'),
        Index('idx_pblntf_ty', 'pblntf_ty'),
        Index('idx_corp_cls', 'corp_cls'),
    )

class FinancialStatement(Base):
    """재무제표 데이터 테이블"""
    __tablename__ = "financial_statements"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    corp_code: Mapped[str] = mapped_column(String(8), nullable=False)
    bsns_year: Mapped[str] = mapped_column(String(4), nullable=False)
    reprt_code: Mapped[str] = mapped_column(String(5), nullable=False)
    sj_div: Mapped[Optional[str]] = mapped_column(String(5))  # 재무제표구분
    sj_nm: Mapped[Optional[str]] = mapped_column(String(200))  # 재무제표명
    account_id: Mapped[Optional[str]] = mapped_column(String(50))  # 계정ID
    account_nm: Mapped[str] = mapped_column(String(300), nullable=False)  # 계정명
    account_detail: Mapped[Optional[str]] = mapped_column(String(500))  # 계정상세
    thstrm_nm: Mapped[Optional[str]] = mapped_column(String(50))  # 당기명
    thstrm_amount: Mapped[Optional[str]] = mapped_column(String(50))  # 당기금액
    thstrm_add_amount: Mapped[Optional[str]] = mapped_column(String(50))  # 당기누적금액
    frmtrm_nm: Mapped[Optional[str]] = mapped_column(String(50))  # 전기명
    frmtrm_amount: Mapped[Optional[str]] = mapped_column(String(50))  # 전기금액
    frmtrm_add_amount: Mapped[Optional[str]] = mapped_column(String(50))  # 전기누적금액
    bfefrmtrm_nm: Mapped[Optional[str]] = mapped_column(String(50))  # 전전기명
    bfefrmtrm_amount: Mapped[Optional[str]] = mapped_column(String(50))  # 전전기금액
    ord: Mapped[Optional[str]] = mapped_column(String(10))  # 계정과목 정렬순서
    currency: Mapped[Optional[str]] = mapped_column(String(10))  # 통화단위
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # 인덱스 설정
    __table_args__ = (
        Index('idx_corp_bsns_reprt', 'corp_code', 'bsns_year', 'reprt_code'),
        Index('idx_account_nm', 'account_nm'),
        Index('idx_corp_code_fs', 'corp_code'),
        Index('idx_bsns_year', 'bsns_year'),
    )

class AccountCache(Base):
    """계정명 캐시 테이블 (검색 최적화용)"""
    __tablename__ = "account_cache"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    account_nm: Mapped[str] = mapped_column(String(300), nullable=False, unique=True)
    usage_count: Mapped[int] = mapped_column(Integer, default=1)  # 사용 빈도
    last_used: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # 인덱스 설정
    __table_args__ = (
        Index('idx_account_nm_cache', 'account_nm'),
        Index('idx_usage_count', 'usage_count'),
    )

class ApiCache(Base):
    """API 응답 캐시 테이블"""
    __tablename__ = "api_cache"
    
    cache_key: Mapped[str] = mapped_column(String(500), primary_key=True)
    response_data: Mapped[str] = mapped_column(Text, nullable=False)  # JSON 데이터
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # 인덱스 설정
    __table_args__ = (
        Index('idx_expires_at', 'expires_at'),
    )

# 데이터베이스 초기화 함수
async def init_db():
    """데이터베이스 테이블 생성"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("데이터베이스 테이블이 생성되었습니다.")

# 세션 의존성
async def get_db():
    """데이터베이스 세션 의존성"""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

# 유틸리티 함수들
async def cleanup_expired_cache():
    """만료된 캐시 정리"""
    async with async_session() as session:
        from sqlalchemy import delete
        stmt = delete(ApiCache).where(ApiCache.expires_at < datetime.utcnow())
        await session.execute(stmt)
        await session.commit()

if __name__ == "__main__":
    # 테이블 생성 테스트
    asyncio.run(init_db())
