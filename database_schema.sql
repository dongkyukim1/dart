-- DART 재무제표 분석 시스템 데이터베이스 스키마
-- 이 파일은 DBeaver에서 참조용으로 사용하세요

-- 1. 기업 정보 테이블
CREATE TABLE companies (
    corp_code VARCHAR(8) PRIMARY KEY,           -- 기업 고유번호
    corp_name VARCHAR(200) NOT NULL,            -- 기업명
    stock_code VARCHAR(20),                     -- 주식 코드
    modify_date VARCHAR(8),                     -- 수정일자
    corp_cls VARCHAR(1),                        -- 법인구분 (Y:유가, K:코스닥, N:코넥스, E:기타)
    sector VARCHAR(100),                        -- 업종
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 공시 문서 테이블
CREATE TABLE disclosure_documents (
    rcept_no VARCHAR(14) PRIMARY KEY,           -- 접수번호
    corp_code VARCHAR(8) NOT NULL,              -- 기업 고유번호
    corp_name VARCHAR(200) NOT NULL,            -- 기업명
    corp_cls VARCHAR(1),                        -- 법인구분
    report_nm VARCHAR(300) NOT NULL,            -- 보고서명
    rcept_dt VARCHAR(8) NOT NULL,               -- 접수일자
    flr_nm VARCHAR(200) NOT NULL,               -- 공시 제출인명
    pblntf_ty VARCHAR(1),                       -- 공시유형
    pblntf_detail_ty VARCHAR(4),                -- 공시상세유형
    rm VARCHAR(500),                            -- 비고
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. 재무제표 데이터 테이블
CREATE TABLE financial_statements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    corp_code VARCHAR(8) NOT NULL,              -- 기업 고유번호
    bsns_year VARCHAR(4) NOT NULL,              -- 사업연도
    reprt_code VARCHAR(5) NOT NULL,             -- 보고서 코드
    sj_div VARCHAR(5),                          -- 재무제표구분
    sj_nm VARCHAR(200),                         -- 재무제표명
    account_id VARCHAR(50),                     -- 계정ID
    account_nm VARCHAR(300) NOT NULL,           -- 계정명
    account_detail VARCHAR(500),                -- 계정상세
    thstrm_nm VARCHAR(50),                      -- 당기명
    thstrm_amount VARCHAR(50),                  -- 당기금액
    thstrm_add_amount VARCHAR(50),              -- 당기누적금액
    frmtrm_nm VARCHAR(50),                      -- 전기명
    frmtrm_amount VARCHAR(50),                  -- 전기금액
    frmtrm_add_amount VARCHAR(50),              -- 전기누적금액
    bfefrmtrm_nm VARCHAR(50),                   -- 전전기명
    bfefrmtrm_amount VARCHAR(50),               -- 전전기금액
    ord VARCHAR(10),                            -- 계정과목 정렬순서
    currency VARCHAR(10),                       -- 통화단위
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. 계정명 캐시 테이블
CREATE TABLE account_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_nm VARCHAR(300) NOT NULL UNIQUE,    -- 계정명
    usage_count INTEGER DEFAULT 1,              -- 사용 빈도
    last_used DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. API 응답 캐시 테이블
CREATE TABLE api_cache (
    cache_key VARCHAR(500) PRIMARY KEY,         -- 캐시 키
    response_data TEXT NOT NULL,                -- JSON 응답 데이터
    expires_at DATETIME NOT NULL,               -- 만료 시간
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_corp_name ON companies(corp_name);
CREATE INDEX idx_corp_cls ON companies(corp_cls);
CREATE INDEX idx_stock_code ON companies(stock_code);

CREATE INDEX idx_corp_code_disclosure ON disclosure_documents(corp_code);
CREATE INDEX idx_rcept_dt ON disclosure_documents(rcept_dt);
CREATE INDEX idx_corp_name_disclosure ON disclosure_documents(corp_name);
CREATE INDEX idx_pblntf_ty ON disclosure_documents(pblntf_ty);
CREATE INDEX idx_corp_cls_disclosure ON disclosure_documents(corp_cls);

CREATE INDEX idx_corp_bsns_reprt ON financial_statements(corp_code, bsns_year, reprt_code);
CREATE INDEX idx_account_nm_fs ON financial_statements(account_nm);
CREATE INDEX idx_corp_code_fs ON financial_statements(corp_code);
CREATE INDEX idx_bsns_year ON financial_statements(bsns_year);

CREATE INDEX idx_account_nm_cache ON account_cache(account_nm);
CREATE INDEX idx_usage_count ON account_cache(usage_count);

CREATE INDEX idx_expires_at ON api_cache(expires_at);
