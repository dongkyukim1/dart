import xml.etree.ElementTree as ET
import re
from typing import Dict, List, Optional, Tuple
import asyncio
import httpx
from datetime import datetime

class XBRLParser:
    """XBRL 데이터 파싱 클래스"""
    
    def __init__(self):
        # 계정명 매핑 테이블 (한국어 계정명 → 표준화된 이름)
        self.account_mapping = {
            # 유동자산 세부 항목
            "선급금": "PrepaidExpenses",
            "선급비용": "PrepaidExpenses", 
            "예치금": "DepositsMade",
            "당좌자산": "QuickAssets",
            "단기금융상품": "ShortTermInvestments",
            "매출채권": "AccountsReceivable",
            "재고자산": "Inventory",
            "기타유동자산": "OtherCurrentAssets",
            
            # 비유동자산 세부 항목
            "유형자산": "PropertyPlantAndEquipment",
            "토지": "Land",
            "건물": "Buildings",
            "기계장치": "MachineryAndEquipment",
            "무형자산": "IntangibleAssets",
            "영업권": "Goodwill",
            "특허권": "Patents",
            "상표권": "Trademarks",
            "장기투자자산": "LongTermInvestments",
            "기타비유동자산": "OtherNonCurrentAssets",
            
            # 유동부채 세부 항목
            "매입채무": "AccountsPayable",
            "단기차입금": "ShortTermDebt",
            "미지급금": "AccruedExpenses",
            "선수금": "AdvancePayments",
            "기타유동부채": "OtherCurrentLiabilities",
            
            # 비유동부채 세부 항목
            "장기차입금": "LongTermDebt",
            "사채": "Bonds",
            "퇴직급여부채": "RetirementBenefitLiabilities",
            "기타비유동부채": "OtherNonCurrentLiabilities",
            
            # 자본 세부 항목
            "자본금": "ShareCapital",
            "주식발행초과금": "SharePremium",
            "이익잉여금": "RetainedEarnings",
            "기타자본구성요소": "OtherEquityComponents",
        }
        
        # 계정 계층 구조 (상위 → 하위 항목)
        self.account_hierarchy = {
            "유동자산": {
                "현금및현금성자산": [],
                "단기금융상품": [],
                "매출채권": ["매출채권", "미수금", "대손충당금"],
                "재고자산": ["제품", "상품", "원재료", "재공품"],
                "선급금": ["선급비용", "선급금"],
                "기타유동자산": ["단기대여금", "미수수익", "부가세대급금"]
            },
            "비유동자산": {
                "유형자산": ["토지", "건물", "기계장치", "차량운반구", "감가상각누계액"],
                "무형자산": ["영업권", "특허권", "상표권", "소프트웨어"],
                "투자자산": ["장기금융상품", "관계기업투자", "기타투자자산"],
                "기타비유동자산": ["장기대여금", "보증금", "기타"]
            },
            "유동부채": {
                "매입채무": ["매입채무", "미지급금"],
                "단기차입금": ["단기차입금", "유동성장기부채"],
                "기타유동부채": ["선수금", "예수금", "미지급비용", "충당부채"]
            },
            "비유동부채": {
                "장기차입금": ["장기차입금", "사채"],
                "기타비유동부채": ["퇴직급여부채", "장기성충당부채", "기타장기부채"]
            },
            "자본": {
                "자본금": ["보통주자본금", "우선주자본금"],
                "자본잉여금": ["주식발행초과금", "기타자본잉여금"],
                "이익잉여금": ["이익준비금", "미처분이익잉여금"],
                "기타자본구성요소": ["자기주식", "기타포괄손익누계액"]
            }
        }
    
    def parse_xbrl_content(self, xbrl_content: str) -> Dict:
        """XBRL XML 내용을 파싱하여 계층 구조 생성"""
        try:
            # XML 네임스페이스 처리
            root = ET.fromstring(xbrl_content)
            
            # 네임스페이스 매핑
            namespaces = {
                'xbrli': 'http://www.xbrl.org/2003/instance',
                'us-gaap': 'http://fasb.org/us-gaap/2019-01-31',
                'ifrs': 'http://xbrl.ifrs.org/taxonomy/2019-03-27/ifrs',
                'dart': 'http://dart.fss.or.kr/xbrl/taxonomy/kr-gaap-2019-03-31'
            }
            
            financial_data = {}
            
            # 모든 재무 항목 추출
            for elem in root.iter():
                if self._is_financial_element(elem):
                    account_name = self._extract_account_name(elem)
                    amount = self._extract_amount(elem)
                    context = self._extract_context(elem)
                    
                    if account_name and amount is not None:
                        if account_name not in financial_data:
                            financial_data[account_name] = {}
                        
                        financial_data[account_name][context] = amount
            
            # 계층 구조로 정리
            hierarchical_data = self._build_hierarchy(financial_data)
            
            return hierarchical_data
            
        except ET.ParseError as e:
            print(f"XBRL 파싱 오류: {e}")
            return {}
    
    def _is_financial_element(self, elem) -> bool:
        """재무 요소인지 확인"""
        # 금액을 나타내는 요소들 확인
        financial_tags = [
            'Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses',
            'Cash', 'Receivables', 'Inventory', 'Debt', 'Capital'
        ]
        
        tag_name = elem.tag.split('}')[-1] if '}' in elem.tag else elem.tag
        
        return any(financial_tag in tag_name for financial_tag in financial_tags)
    
    def _extract_account_name(self, elem) -> str:
        """계정명 추출"""
        tag_name = elem.tag.split('}')[-1] if '}' in elem.tag else elem.tag
        
        # CamelCase를 한국어로 변환 (간단한 매핑)
        for korean, english in self.account_mapping.items():
            if english.lower() in tag_name.lower():
                return korean
        
        return tag_name
    
    def _extract_amount(self, elem) -> Optional[float]:
        """금액 추출"""
        try:
            text = elem.text.strip() if elem.text else ""
            if text:
                # 쉼표 제거 후 숫자 변환
                amount = float(text.replace(',', ''))
                return amount
        except (ValueError, AttributeError):
            pass
        return None
    
    def _extract_context(self, elem) -> str:
        """컨텍스트 추출 (연도 정보)"""
        context_ref = elem.get('contextRef', '')
        
        # 연도 정보 추출 (예: "2023_12_31" → "2023")
        year_match = re.search(r'(\d{4})', context_ref)
        if year_match:
            return year_match.group(1)
        
        return "unknown"
    
    def _build_hierarchy(self, financial_data: Dict) -> Dict:
        """계층 구조 생성"""
        result = {}
        
        for main_category, sub_categories in self.account_hierarchy.items():
            result[main_category] = {
                "amount": {},
                "details": {},
                "has_details": True
            }
            
            category_total = {}
            
            for sub_category, detail_items in sub_categories.items():
                result[main_category]["details"][sub_category] = {
                    "amount": {},
                    "details": {},
                    "has_details": len(detail_items) > 0
                }
                
                # 하위 항목이 있는 경우
                if detail_items:
                    sub_total = {}
                    for detail_item in detail_items:
                        if detail_item in financial_data:
                            result[main_category]["details"][sub_category]["details"][detail_item] = {
                                "amount": financial_data[detail_item],
                                "has_details": False
                            }
                            
                            # 합계 계산
                            for year, amount in financial_data[detail_item].items():
                                if year not in sub_total:
                                    sub_total[year] = 0
                                sub_total[year] += amount
                    
                    result[main_category]["details"][sub_category]["amount"] = sub_total
                else:
                    # 직접 데이터가 있는 경우
                    if sub_category in financial_data:
                        result[main_category]["details"][sub_category]["amount"] = financial_data[sub_category]
                
                # 상위 카테고리 합계 계산
                for year, amount in result[main_category]["details"][sub_category]["amount"].items():
                    if year not in category_total:
                        category_total[year] = 0
                    category_total[year] += amount
            
            result[main_category]["amount"] = category_total
        
        return result

# 샘플 데이터 생성 함수 (XBRL API가 없을 때 사용)
def generate_sample_hierarchical_data() -> Dict:
    """네이버 증권 스타일의 샘플 데이터 생성"""
    return {
        "유동자산": {
            "amount": {"2023": 150000000, "2022": 140000000, "2021": 130000000, "2020": 120000000, "2019": 110000000},
            "has_details": True,
            "details": {
                "현금및현금성자산": {
                    "amount": {"2023": 50000000, "2022": 45000000, "2021": 40000000, "2020": 38000000, "2019": 35000000},
                    "has_details": False
                },
                "매출채권": {
                    "amount": {"2023": 35000000, "2022": 32000000, "2021": 30000000, "2020": 28000000, "2019": 25000000},
                    "has_details": True,
                    "details": {
                        "매출채권": {
                            "amount": {"2023": 37000000, "2022": 34000000, "2021": 32000000, "2020": 30000000, "2019": 27000000},
                            "has_details": False
                        },
                        "미수금": {
                            "amount": {"2023": 1000000, "2022": 900000, "2021": 800000, "2020": 700000, "2019": 600000},
                            "has_details": False
                        },
                        "대손충당금": {
                            "amount": {"2023": -3000000, "2022": -2900000, "2021": -2800000, "2020": -2700000, "2019": -2600000},
                            "has_details": False
                        }
                    }
                },
                "재고자산": {
                    "amount": {"2023": 25000000, "2022": 23000000, "2021": 22000000, "2020": 20000000, "2019": 18000000},
                    "has_details": True,
                    "details": {
                        "제품": {
                            "amount": {"2023": 15000000, "2022": 14000000, "2021": 13000000, "2020": 12000000, "2019": 11000000},
                            "has_details": False
                        },
                        "원재료": {
                            "amount": {"2023": 8000000, "2022": 7500000, "2021": 7000000, "2020": 6500000, "2019": 6000000},
                            "has_details": False
                        },
                        "재공품": {
                            "amount": {"2023": 2000000, "2022": 1500000, "2021": 2000000, "2020": 1500000, "2019": 1000000},
                            "has_details": False
                        }
                    }
                },
                "기타유동자산": {
                    "amount": {"2023": 40000000, "2022": 40000000, "2021": 38000000, "2020": 34000000, "2019": 32000000},
                    "has_details": True,
                    "details": {
                        "선급금": {
                            "amount": {"2023": 15000000, "2022": 14000000, "2021": 13000000, "2020": 12000000, "2019": 11000000},
                            "has_details": False
                        },
                        "예치금": {
                            "amount": {"2023": 12000000, "2022": 12000000, "2021": 11000000, "2020": 10000000, "2019": 9000000},
                            "has_details": False
                        },
                        "단기대여금": {
                            "amount": {"2023": 8000000, "2022": 9000000, "2021": 9000000, "2020": 8000000, "2019": 8000000},
                            "has_details": False
                        },
                        "부가세대급금": {
                            "amount": {"2023": 5000000, "2022": 5000000, "2021": 5000000, "2020": 4000000, "2019": 4000000},
                            "has_details": False
                        }
                    }
                }
            }
        },
        "비유동자산": {
            "amount": {"2023": 300000000, "2022": 280000000, "2021": 260000000, "2020": 240000000, "2019": 220000000},
            "has_details": True,
            "details": {
                "유형자산": {
                    "amount": {"2023": 200000000, "2022": 190000000, "2021": 180000000, "2020": 170000000, "2019": 160000000},
                    "has_details": True,
                    "details": {
                        "토지": {
                            "amount": {"2023": 80000000, "2022": 80000000, "2021": 80000000, "2020": 80000000, "2019": 80000000},
                            "has_details": False
                        },
                        "건물": {
                            "amount": {"2023": 70000000, "2022": 65000000, "2021": 60000000, "2020": 55000000, "2019": 50000000},
                            "has_details": False
                        },
                        "기계장치": {
                            "amount": {"2023": 50000000, "2022": 45000000, "2021": 40000000, "2020": 35000000, "2019": 30000000},
                            "has_details": False
                        }
                    }
                },
                "무형자산": {
                    "amount": {"2023": 60000000, "2022": 55000000, "2021": 50000000, "2020": 45000000, "2019": 40000000},
                    "has_details": True,
                    "details": {
                        "영업권": {
                            "amount": {"2023": 30000000, "2022": 28000000, "2021": 26000000, "2020": 24000000, "2019": 22000000},
                            "has_details": False
                        },
                        "특허권": {
                            "amount": {"2023": 20000000, "2022": 18000000, "2021": 16000000, "2020": 14000000, "2019": 12000000},
                            "has_details": False
                        },
                        "소프트웨어": {
                            "amount": {"2023": 10000000, "2022": 9000000, "2021": 8000000, "2020": 7000000, "2019": 6000000},
                            "has_details": False
                        }
                    }
                },
                "기타비유동자산": {
                    "amount": {"2023": 40000000, "2022": 35000000, "2021": 30000000, "2020": 25000000, "2019": 20000000},
                    "has_details": False
                }
            }
        }
    }

# XBRL 파서 인스턴스
xbrl_parser = XBRLParser()
