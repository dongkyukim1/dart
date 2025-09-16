# DART 재무제표 분석 시스템

DART Open API를 활용한 한국 상장기업의 재무제표 및 공시정보 검색/분석 웹 애플리케이션입니다.

## 🚀 주요 기능

- **기업 공시 검색**: 상장기업의 다양한 공시 자료 검색 및 조회
- **재무제표 분석**: 손익계산서, 재무상태표, 현금흐름표 등 재무정보 분석
- **주석 정보 조회**: 재무제표 주석의 상세 회계 정책 및 중요 정보 확인
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 환경 지원
- **실시간 데이터**: DART API를 통한 최신 공시정보 제공

## 🛠 기술 스택

### 백엔드
- **FastAPI**: 고성능 Python 웹 프레임워크
- **httpx**: 비동기 HTTP 클라이언트
- **Pydantic**: 데이터 검증 및 설정 관리
- **python-dotenv**: 환경변수 관리

### 프론트엔드
- **React 18**: 사용자 인터페이스 라이브러리
- **Styled Components**: CSS-in-JS 스타일링
- **React Query**: 서버 상태 관리
- **React Router**: 클라이언트 사이드 라우팅
- **Axios**: HTTP 클라이언트
- **Pretendard 폰트**: 한국어 최적화 폰트

## 📋 사전 요구사항

1. **Python 3.8+**
2. **Node.js 16+**
3. **DART Open API 인증키**
   - [DART 오픈API](https://opendart.fss.or.kr/) 회원가입 후 인증키 발급

## 🔧 설치 및 실행

### 1. 프로젝트 클론 및 설정

```bash
git clone <repository-url>
cd fastapi
```

### 2. 백엔드 설정

```bash
# Python 가상환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate

# 의존성 설치
pip install -r requirements.txt

# 환경변수 설정
copy env_example.txt .env
# .env 파일을 열어 DART_API_KEY에 발급받은 인증키 입력
```

### 3. 프론트엔드 설정

```bash
cd frontend
npm install
```

### 4. 애플리케이션 실행

#### 백엔드 서버 실행 (터미널 1)
```bash
# 프로젝트 루트 디렉토리에서
python main.py
```
서버가 http://localhost:8000 에서 실행됩니다.

#### 프론트엔드 서버 실행 (터미널 2)
```bash
cd frontend
npm start
```
클라이언트가 http://localhost:3000 에서 실행됩니다.

## 🌐 API 엔드포인트

### 기업 검색
- `POST /api/company/search`: 기업 공시 검색
- `GET /api/company/list`: 최근 공시 목록 조회

### 재무데이터
- `POST /api/financial/data`: 재무제표 데이터 조회

## 📱 사용 방법

1. **메인 대시보드**: 최근 공시 정보 확인 및 주요 기능 접근
2. **기업 검색**: 다양한 필터를 통한 기업 공시 검색
3. **재무분석**: 선택한 기업의 상세 재무정보 및 주석 조회

## 🎨 디자인 특징

- **Pretendard 폰트 시스템**: 가독성 최적화된 한국어 폰트
- **그라데이션 디자인**: 현대적이고 세련된 UI
- **반응형 레이아웃**: 모든 디바이스에서 최적화된 경험
- **직관적 네비게이션**: 사용자 친화적인 인터페이스

## 🔒 보안 주의사항

- `.env` 파일을 git에 커밋하지 마세요
- DART API 키는 외부에 노출되지 않도록 주의하세요
- 프로덕션 환경에서는 CORS 설정을 제한하세요

## 📚 참고 자료

- [DART Open API 개발가이드](https://opendart.fss.or.kr/)
- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [React 공식 문서](https://react.dev/)

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여

버그 리포트나 기능 제안은 이슈로 등록해 주세요.

---

**개발 환경**: Windows 10+, PowerShell  
**서버 URL**: http://3.34.52.239:8080/ (배포 시)
