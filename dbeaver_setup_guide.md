# DBeaver 설정 가이드

## 🔗 연결 설정

### 1. 기본 연결 정보
```
Connection Type: SQLite
Connection Name: DART 재무제표 DB
Database Path: C:\fastapi\dart_data.db
```

### 2. 고급 설정 (선택사항)
- **Connection Type**: SQLite
- **Driver**: SQLite JDBC Driver
- **Host**: localhost (기본값)
- **Port**: (비워둠)
- **Database**: C:\fastapi\dart_data.db
- **User**: (비워둠)
- **Password**: (비워둠)

## 📋 연결 후 체크리스트

### 1. 테이블 구조 확인
- [x] companies (기업 정보)
- [x] disclosure_documents (공시 문서)
- [x] financial_statements (재무제표)
- [x] account_cache (계정명 캐시)
- [x] api_cache (API 캐시)

### 2. 인덱스 확인
```sql
-- 인덱스 목록 조회
SELECT name, sql FROM sqlite_master 
WHERE type = 'index' AND name NOT LIKE 'sqlite_%'
ORDER BY name;
```

### 3. 데이터 현황 확인
```sql
-- 전체 테이블 데이터 개수
SELECT 
    (SELECT COUNT(*) FROM companies) as companies,
    (SELECT COUNT(*) FROM disclosure_documents) as disclosures,
    (SELECT COUNT(*) FROM financial_statements) as financials,
    (SELECT COUNT(*) FROM account_cache) as accounts,
    (SELECT COUNT(*) FROM api_cache) as cache;
```

## 🔧 DBeaver 추천 설정

### 1. SQL 편집기 설정
- **Window** → **Preferences** → **Database** → **SQL Editor**
- ✅ Auto-completion enabled
- ✅ Auto-format on save
- ✅ Show line numbers

### 2. 결과 표시 설정
- **Result Set** → **Data Formatting**
- Date format: `yyyy-MM-dd HH:mm:ss`
- Number format: `#,##0.##`

### 3. 유용한 단축키
- `Ctrl + Enter`: 현재 쿼리 실행
- `Ctrl + Shift + Enter`: 스크립트 실행
- `Ctrl + Space`: 자동완성
- `F4`: 테이블/컬럼 정보 보기

## 📊 모니터링 쿼리

### 1. 실시간 데이터 현황
```sql
-- 최근 추가된 데이터
SELECT 
    'disclosure' as type,
    MAX(created_at) as last_updated,
    COUNT(*) as total_count
FROM disclosure_documents
UNION ALL
SELECT 
    'financial' as type,
    MAX(created_at) as last_updated,
    COUNT(*) as total_count
FROM financial_statements;
```

### 2. 캐시 효율성
```sql
-- 캐시 히트율 확인
SELECT 
    COUNT(*) as total_cache_entries,
    SUM(CASE WHEN expires_at > datetime('now') THEN 1 ELSE 0 END) as valid_entries,
    ROUND(
        SUM(CASE WHEN expires_at > datetime('now') THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 
        2
    ) as cache_hit_rate_percent
FROM api_cache;
```

### 3. 데이터베이스 크기
```sql
-- SQLite 데이터베이스 정보
PRAGMA database_list;
PRAGMA table_info(companies);
PRAGMA index_list(financial_statements);
```

## 🚀 성능 최적화 팁

### 1. 인덱스 추가 (필요시)
```sql
-- 자주 검색하는 컬럼에 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_custom_search 
ON financial_statements(corp_code, account_nm, bsns_year);
```

### 2. 정기 유지보수
```sql
-- 데이터베이스 최적화 (월 1회)
VACUUM;
ANALYZE;
```

### 3. 만료된 캐시 정리
```sql
-- 만료된 캐시 삭제 (일 1회)
DELETE FROM api_cache WHERE expires_at < datetime('now');
```

## 🔍 문제 해결

### 1. 연결 안 될 때
- 파일 경로 확인: `C:\fastapi\dart_data.db`
- 파일 권한 확인
- SQLite JDBC Driver 업데이트

### 2. 성능 문제
- 인덱스 확인 및 추가
- VACUUM 실행
- 불필요한 캐시 정리

### 3. 데이터 불일치
- 캐시 테이블 초기화
- API 재호출로 데이터 갱신
```sql
-- 모든 캐시 삭제 (필요시)
DELETE FROM api_cache;
DELETE FROM account_cache;
```
