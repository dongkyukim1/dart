from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import httpx
import os
from datetime import datetime, timedelta
from typing import Optional, List
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="DART 재무제표 분석 시스템", version="1.0.0")

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인으로 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DART API 기본 설정
DART_API_KEY = os.getenv("DART_API_KEY", "")  # 환경변수에서 API 키 로드
DART_BASE_URL = "https://opendart.fss.or.kr/api"

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
async def search_companies(request: CompanySearchRequest):
    """기업 공시 검색"""
    if not DART_API_KEY:
        raise HTTPException(status_code=500, detail="DART API 키가 설정되지 않았습니다.")
    
    params = {
        "crtfc_key": DART_API_KEY,
        "corp_code": request.corp_code,
        "bgn_de": request.bgn_de,
        "end_de": request.end_de,
        "last_reprt_at": request.last_reprt_at,
        "pblntf_ty": request.pblntf_ty,
        "corp_cls": request.corp_cls,
        "page_no": request.page_no,
        "page_count": request.page_count
    }
    
    # None 값 제거
    params = {k: v for k, v in params.items() if v is not None}
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{DART_BASE_URL}/list.json", params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get("status") != "000":
                raise HTTPException(status_code=400, detail=f"DART API 오류: {data.get('message', '알 수 없는 오류')}")
            
            return data
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"API 요청 오류: {str(e)}")

@app.get("/api/company/list")
async def get_company_list():
    """전체 기업 목록 조회 (샘플)"""
    if not DART_API_KEY:
        raise HTTPException(status_code=500, detail="DART API 키가 설정되지 않았습니다.")
    
    try:
        async with httpx.AsyncClient() as client:
            # 최근 1개월 사업보고서 검색
            today = datetime.now().strftime("%Y%m%d")
            last_month = (datetime.now() - timedelta(days=30)).strftime("%Y%m%d")
            
            params = {
                "crtfc_key": DART_API_KEY,
                "bgn_de": last_month,
                "end_de": today,
                "pblntf_ty": "A",  # 정기공시
                "page_count": 20
            }
            
            response = await client.get(f"{DART_BASE_URL}/list.json", params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get("status") != "000":
                raise HTTPException(status_code=400, detail=f"DART API 오류: {data.get('message', '알 수 없는 오류')}")
            
            return data
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"API 요청 오류: {str(e)}")

@app.post("/api/financial/data")
async def get_financial_data(request: FinancialDataRequest):
    """재무제표 데이터 조회"""
    if not DART_API_KEY:
        raise HTTPException(status_code=500, detail="DART API 키가 설정되지 않았습니다.")
    
    params = {
        "crtfc_key": DART_API_KEY,
        "corp_code": request.corp_code,
        "bsns_year": request.bsns_year,
        "reprt_code": request.reprt_code
    }
    
    try:
        async with httpx.AsyncClient() as client:
            # 재무제표 데이터는 실제 DART API 엔드포인트에 맞게 수정 필요
            # 여기서는 기본 구조만 제공
            response = await client.get(f"{DART_BASE_URL}/fnlttSinglAcnt.json", params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get("status") != "000":
                raise HTTPException(status_code=400, detail=f"DART API 오류: {data.get('message', '알 수 없는 오류')}")
            
            return data
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"API 요청 오류: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
