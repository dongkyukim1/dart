-- DART 재무제표 DB 유용한 쿼리문들
-- DBeaver에서 복사해서 실행하세요

-- =====================================
-- 📊 데이터 현황 확인
-- =====================================

-- 1. 테이블별 데이터 개수 확인
SELECT 
    'companies' as table_name, 
    COUNT(*) as count 
FROM companies
UNION ALL
SELECT 
    'disclosure_documents' as table_name, 
    COUNT(*) as count 
FROM disclosure_documents
UNION ALL
SELECT 
    'financial_statements' as table_name, 
    COUNT(*) as count 
FROM financial_statements
UNION ALL
SELECT 
    'account_cache' as table_name, 
    COUNT(*) as count 
FROM account_cache
UNION ALL
SELECT 
    'api_cache' as table_name, 
    COUNT(*) as count 
FROM api_cache;

-- =====================================
-- 🏢 기업 정보 조회
-- =====================================

-- 2. 기업 목록 조회 (법인구분별)
SELECT 
    corp_cls,
    COUNT(*) as company_count,
    CASE corp_cls 
        WHEN 'Y' THEN '유가증권시장'
        WHEN 'K' THEN '코스닥'
        WHEN 'N' THEN '코넥스'
        WHEN 'E' THEN '기타'
        ELSE '미분류'
    END as market_name
FROM disclosure_documents 
WHERE corp_cls IS NOT NULL
GROUP BY corp_cls
ORDER BY company_count DESC;

-- 3. 특정 기업 검색 (기업명 부분 일치)
SELECT DISTINCT
    corp_code,
    corp_name,
    corp_cls,
    COUNT(*) as disclosure_count
FROM disclosure_documents 
WHERE corp_name LIKE '%삼성%'  -- 여기서 '삼성'을 원하는 기업명으로 변경
GROUP BY corp_code, corp_name, corp_cls
ORDER BY disclosure_count DESC;

-- =====================================
-- 📈 재무제표 데이터 조회
-- =====================================

-- 4. 특정 기업의 재무제표 조회
SELECT 
    fs.account_nm as 계정명,
    fs.thstrm_amount as 당기금액,
    fs.frmtrm_amount as 전기금액,
    fs.bfefrmtrm_amount as 전전기금액,
    fs.bsns_year as 사업연도
FROM financial_statements fs
JOIN disclosure_documents dd ON fs.corp_code = dd.corp_code
WHERE dd.corp_name LIKE '%삼성전자%'  -- 기업명 변경 가능
  AND fs.bsns_year = '2023'
  AND fs.reprt_code = '11011'
ORDER BY fs.ord;

-- 5. 인기 계정명 TOP 20
SELECT 
    account_nm as 계정명,
    usage_count as 조회횟수,
    last_used as 마지막조회
FROM account_cache 
ORDER BY usage_count DESC, last_used DESC
LIMIT 20;

-- =====================================
-- 📊 캐시 및 성능 모니터링
-- =====================================

-- 6. API 캐시 현황
SELECT 
    COUNT(*) as total_cache,
    COUNT(CASE WHEN expires_at > datetime('now') THEN 1 END) as valid_cache,
    COUNT(CASE WHEN expires_at <= datetime('now') THEN 1 END) as expired_cache
FROM api_cache;

-- 7. 만료된 캐시 정리 (수동 실행시)
DELETE FROM api_cache 
WHERE expires_at <= datetime('now');

-- =====================================
-- 🔍 고급 분석 쿼리
-- =====================================

-- 8. 월별 공시 현황
SELECT 
    substr(rcept_dt, 1, 6) as year_month,
    COUNT(*) as disclosure_count,
    COUNT(DISTINCT corp_code) as unique_companies
FROM disclosure_documents 
WHERE rcept_dt >= '20240101'  -- 조회 시작일 변경 가능
GROUP BY substr(rcept_dt, 1, 6)
ORDER BY year_month DESC;

-- 9. 기업별 재무제표 보유 현황
SELECT 
    dd.corp_name as 기업명,
    dd.corp_cls as 시장구분,
    COUNT(DISTINCT fs.bsns_year) as 보유연도수,
    MAX(fs.bsns_year) as 최신연도,
    COUNT(*) as 총계정수
FROM financial_statements fs
JOIN disclosure_documents dd ON fs.corp_code = dd.corp_code
GROUP BY dd.corp_code, dd.corp_name, dd.corp_cls
HAVING COUNT(DISTINCT fs.bsns_year) >= 2  -- 2년 이상 데이터 보유 기업만
ORDER BY 보유연도수 DESC, 총계정수 DESC
LIMIT 50;

-- 10. 계정명별 사용 기업 수
SELECT 
    account_nm as 계정명,
    COUNT(DISTINCT corp_code) as 사용기업수,
    COUNT(*) as 총사용횟수
FROM financial_statements 
WHERE account_nm IS NOT NULL
GROUP BY account_nm
HAVING COUNT(DISTINCT corp_code) >= 10  -- 10개 이상 기업에서 사용하는 계정만
ORDER BY 사용기업수 DESC, 총사용횟수 DESC
LIMIT 30;
