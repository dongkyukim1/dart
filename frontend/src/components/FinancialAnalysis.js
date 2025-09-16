import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faBuilding, 
  faIndustry, 
  faCar, 
  faBolt, 
  faUniversity,
  faChartLine,
  faMicrochip
} from '@fortawesome/free-solid-svg-icons';
import { 
  faApple,
  faGoogle, 
  faMicrosoft,
  faAmazon
} from '@fortawesome/free-brands-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Font Awesome 라이브러리 등록
library.add(
  faBuilding, 
  faIndustry, 
  faCar, 
  faBolt, 
  faUniversity,
  faChartLine,
  faMicrochip,
  faApple,
  faGoogle, 
  faMicrosoft,
  faAmazon
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const AnalysisContainer = styled.div`
  width: 100%;
  padding: 0;
  margin: 0;
`;

const CompanyHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
`;

const CompanyTitle = styled.h1`
  font-size: var(--font-2xl);
  font-weight: 700;
  margin: 0;
  margin-bottom: 0.5rem;
  color: white;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: var(--font-xl);
  }
`;

const CompanyInfo = styled.div`
  opacity: 0.9;
  font-size: var(--font-sm);
  font-weight: 400;
  color: white;
`;

const ControlPanel = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  border: 1px solid rgba(102, 126, 234, 0.1);
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto auto;
  gap: 1rem;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-size: var(--font-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: white;
  transition: all 0.3s ease;
  font-size: var(--font-base);
  font-weight: 500;
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: 'Pretendard-Regular', sans-serif;
  background-color: white;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LoadButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: var(--font-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ClearButton = styled.button`
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  white-space: nowrap;

  &:hover {
    background: #e5e7eb;
    transform: translateY(-1px);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
`;

const ChartSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  border: 1px solid rgba(102, 126, 234, 0.1);
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  font-size: var(--font-lg);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartContainer = styled.div`
  height: 400px;
  position: relative;
`;

const MainContent = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PanelCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const PanelTitle = styled.h3`
  font-family: 'Pretendard-SemiBold', sans-serif;
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const DataTable = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const TableHeader = styled.th`
  background: #f7fafc;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
  font-family: 'Pretendard-Medium', sans-serif;
  color: #4a5568;
  font-weight: 500;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #2d3748;
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  text-align: center;
  color: #718096;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const ErrorCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  text-align: center;
  color: #e53e3e;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #718096;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
`;

const StatValue = styled.div`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 1.2rem;
  color: #2d3748;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 0.8rem;
  color: #718096;
`;

const FinancialAnalysis = () => {
  const { corpCode } = useParams();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    bsns_year: '2023', // 2025년 데이터는 아직 없으므로 2023년으로 설정
    reprt_code: '11011' // 사업보고서
  });
  const [shouldLoadData, setShouldLoadData] = useState(false);
  const [selectedCorpCode, setSelectedCorpCode] = useState(corpCode || searchParams.get('corp_code') || '');
  const [selectedCorpName, setSelectedCorpName] = useState(searchParams.get('corp_name') || '');
  const [accountFilter, setAccountFilter] = useState('');

  useEffect(() => {
    // URL에서 corp_code와 corp_name이 전달된 경우 자동으로 데이터 로드
    const urlCorpCode = corpCode || searchParams.get('corp_code');
    const urlCorpName = searchParams.get('corp_name');
    
    if (urlCorpCode) {
      setSelectedCorpCode(urlCorpCode);
      setSelectedCorpName(urlCorpName || '');
      setShouldLoadData(true);
    }
  }, [corpCode, searchParams]);

  const { data: financialData, isLoading, error } = useQuery(
    ['financialData', selectedCorpCode, filters],
    async () => {
      const requestData = {
        corp_code: selectedCorpCode,
        ...filters
      };
      console.log('재무데이터 요청:', requestData);
      console.log('corpCode:', corpCode);
      console.log('filters:', filters);
      
      const response = await axios.post('/api/financial/data', requestData);
      console.log('재무데이터 응답:', response.data);
      if (response.data.list && response.data.list.length > 0) {
        console.log('첫 번째 데이터 샘플:', response.data.list[0]);
      }
      return response.data;
    },
    {
      enabled: shouldLoadData && !!selectedCorpCode,
      retry: 1,
      onError: (error) => {
        console.error('재무데이터 오류:', error);
        console.error('오류 응답:', error.response?.data);
      }
    }
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoadData = () => {
    setShouldLoadData(true);
  };

  const handleClearFilter = () => {
    setAccountFilter('');
    setFilters({
      bsns_year: '2023',
      reprt_code: '11011'
    });
  };

  // 기업 로고/아이콘 매핑 (Font Awesome)
  const getCompanyIcon = (corpName, corpCode) => {
    const companyIcons = {
      '삼성전자': ['fas', 'microchip'],
      'SK하이닉스': ['fas', 'microchip'], 
      'LG에너지솔루션': ['fas', 'bolt'],
      'NAVER': ['fab', 'google'],  // 검색엔진 계열
      '카카오': ['fas', 'chart-line'],
      '현대자동차': ['fas', 'car'],
      '포스코': ['fas', 'industry'],
      '한국전력': ['fas', 'bolt'],
      '신한지주': ['fas', 'university'],
      'KB금융': ['fas', 'university'],
      '애플': ['fab', 'apple'],
      '마이크로소프트': ['fab', 'microsoft'],
      '구글': ['fab', 'google'],
      '아마존': ['fab', 'amazon']
    };
    
    return companyIcons[corpName] || ['fas', 'building'];
  };

  // 기업별 브랜드 컬러
  const getCompanyColor = (corpName) => {
    const companyColors = {
      '삼성전자': 'linear-gradient(135deg, #1f4e79 0%, #2d5aa0 100%)',
      'SK하이닉스': 'linear-gradient(135deg, #ea4335 0%, #fbbc05 100%)',
      'LG에너지솔루션': 'linear-gradient(135deg, #a50e0e 0%, #d32f2f 100%)',
      'NAVER': 'linear-gradient(135deg, #03c75a 0%, #1ec800 100%)',
      '카카오': 'linear-gradient(135deg, #ffcd00 0%, #fee500 100%)',
      '현대자동차': 'linear-gradient(135deg, #002c5f 0%, #0052a3 100%)'
    };
    
    return companyColors[corpName] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  // 성장률 계산 함수
  const calculateGrowthRate = (current, previous) => {
    const currentNum = parseFloat((current || '0').replace(/,/g, '')) || 0;
    const previousNum = parseFloat((previous || '0').replace(/,/g, '')) || 0;
    
    if (previousNum === 0) return currentNum > 0 ? '+∞%' : '0%';
    
    const growth = ((currentNum - previousNum) / Math.abs(previousNum)) * 100;
    return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };

  const formatNumber = (num) => {
    // 빈 값, null, undefined, 빈 문자열 처리
    if (!num || num === '' || num === null || num === undefined) return '-';
    
    // 숫자로 변환 시도
    const numValue = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : parseFloat(num);
    
    // NaN이거나 유효하지 않은 숫자인 경우
    if (isNaN(numValue) || !isFinite(numValue)) return '-';
    
    // 0인 경우
    if (numValue === 0) return '0';
    
    // 정상적인 숫자인 경우 포맷팅
    return new Intl.NumberFormat('ko-KR').format(numValue);
  };

  const currentYear = 2024; // 현재 가능한 최신 연도
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // 재무데이터에서 사용 가능한 계정명들 추출
  const availableAccounts = useMemo(() => {
    if (!financialData?.list) return [];
    
    const accounts = financialData.list.map(item => item.account_nm).filter(Boolean);
    return [...new Set(accounts)].sort(); // 중복 제거 및 정렬
  }, [financialData]);

  // 필터링된 재무데이터
  const filteredFinancialData = useMemo(() => {
    if (!financialData?.list) return [];
    
    if (!accountFilter) return financialData.list;
    
    return financialData.list.filter(item => 
      item.account_nm && item.account_nm === accountFilter
    );
  }, [financialData, accountFilter]);

  return (
    <AnalysisContainer>
      <CompanyHeader style={{ background: getCompanyColor(selectedCorpName) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)'
          }}>
            <FontAwesomeIcon 
              icon={getCompanyIcon(selectedCorpName, selectedCorpCode)}
              style={{ fontSize: '1.8rem' }}
            />
          </div>
          <div>
            <CompanyTitle>
              {selectedCorpName || '기업 재무분석'}
            </CompanyTitle>
            {selectedCorpCode && (
              <CompanyInfo>
                기업 고유번호: {selectedCorpCode} · 기업 재무제표 분석
              </CompanyInfo>
            )}
          </div>
        </div>
      </CompanyHeader>

      <ControlPanel>
        <FilterRow>
          <FilterGroup>
            <FilterLabel>사업연도</FilterLabel>
            <FilterSelect
              name="bsns_year"
              value={filters.bsns_year}
              onChange={handleFilterChange}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>보고서 구분</FilterLabel>
            <FilterSelect
              name="reprt_code"
              value={filters.reprt_code}
              onChange={handleFilterChange}
            >
              <option value="11011">사업보고서</option>
              <option value="11012">반기보고서</option>
              <option value="11013">1분기보고서</option>
              <option value="11014">3분기보고서</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>계정명 필터</FilterLabel>
            <FilterSelect
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
            >
              <option value="">전체 계정 보기</option>
              {availableAccounts && availableAccounts.map(account => (
                <option key={account} value={account}>{account}</option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <ButtonGroup>
            <LoadButton onClick={handleLoadData} disabled={isLoading}>
              {isLoading ? '🔄 로딩중...' : '📊 데이터 조회'}
            </LoadButton>
            <ClearButton onClick={handleClearFilter}>
              🗑️ 필터 초기화
            </ClearButton>
          </ButtonGroup>
        </FilterRow>
      </ControlPanel>

      <ContentGrid>
        <MainContent>
          {!shouldLoadData && (
            <EmptyState>
              필터를 설정하고 '데이터 조회' 버튼을 클릭해주세요.
            </EmptyState>
          )}
          
          {isLoading && <LoadingCard>재무 데이터를 불러오는 중...</LoadingCard>}
          
          {error && (
            <ErrorCard>
              데이터를 불러오는 중 오류가 발생했습니다.
              <br />API 키 설정을 확인해주세요.
            </ErrorCard>
          )}
          
          {/* 선택된 계정의 연도별 비교 그래프 */}
          {accountFilter && filteredFinancialData && filteredFinancialData.length > 0 && (
            <ChartSection>
              <ChartTitle>
                📈 {accountFilter} - 연도별 추이 분석
                {filteredFinancialData[0] && (
                  <span style={{
                    marginLeft: '10px',
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    fontWeight: 'normal'
                  }}>
                    · 전기 대비: {calculateGrowthRate(filteredFinancialData[0].thstrm_amount, filteredFinancialData[0].frmtrm_amount)}
                  </span>
                )}
              </ChartTitle>
              <ChartContainer>
                <Bar
                  data={{
                    labels: ['전전기', '전기', '당기'],
                    datasets: [
                      {
                        label: accountFilter,
                        data: [
                          parseFloat((filteredFinancialData[0]?.bfefrmtrm_amount || '0').replace(/,/g, '')) || 0,
                          parseFloat((filteredFinancialData[0]?.frmtrm_amount || '0').replace(/,/g, '')) || 0,
                          parseFloat((filteredFinancialData[0]?.thstrm_amount || '0').replace(/,/g, '')) || 0
                        ],
                        backgroundColor: [
                          'rgba(156, 163, 175, 0.8)',
                          'rgba(59, 130, 246, 0.8)', 
                          'rgba(102, 126, 234, 0.8)'
                        ],
                        borderColor: [
                          'rgb(156, 163, 175)',
                          'rgb(59, 130, 246)',
                          'rgb(102, 126, 234)'
                        ],
                        borderWidth: 2,
                        borderRadius: 6,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.label}: ${new Intl.NumberFormat('ko-KR').format(context.parsed.y)}원`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            if (value >= 1000000000000) {
                              return (value / 1000000000000).toFixed(1) + '조';
                            } else if (value >= 100000000) {
                              return (value / 100000000).toFixed(1) + '억';
                            } else if (value >= 10000) {
                              return (value / 10000).toFixed(1) + '만';
                            }
                            return new Intl.NumberFormat('ko-KR').format(value);
                          }
                        }
                      }
                    }
                  }}
                />
              </ChartContainer>
            </ChartSection>
          )}

          {filteredFinancialData && filteredFinancialData.length > 0 && (
            <div>
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem 1.5rem', 
                borderRadius: '8px 8px 0 0',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ 
                  margin: 0, 
                  fontFamily: 'Pretendard-SemiBold',
                  color: '#374151',
                  fontSize: '1.1rem'
                }}>
                  📊 재무제표 데이터
                  {accountFilter && (
                    <span style={{ 
                      marginLeft: '10px',
                      fontSize: '0.9rem',
                      color: '#667eea',
                      fontFamily: 'Pretendard-Medium'
                    }}>
                      · {accountFilter}
                    </span>
                  )}
                </h3>
                <span style={{
                  fontSize: '0.85rem',
                  color: '#6b7280',
                  fontFamily: 'Pretendard-Regular'
                }}>
                  총 {filteredFinancialData.length}개 항목
                </span>
              </div>
              <DataTable>
                <Table>
                  <thead>
                    <tr>
                      <TableHeader>계정명</TableHeader>
                      <TableHeader>당기</TableHeader>
                      <TableHeader>전기</TableHeader>
                      <TableHeader>전전기</TableHeader>
                      <TableHeader>전기 대비 성장률</TableHeader>
                    </tr>
                  </thead>
                <tbody>
                  {filteredFinancialData.slice(0, 20).map((item, index) => {
                    const growthRate = calculateGrowthRate(item.thstrm_amount, item.frmtrm_amount);
                    const isPositive = growthRate.startsWith('+') && !growthRate.includes('∞');
                    const isNegative = growthRate.startsWith('-');
                    
                    return (
                      <tr key={index}>
                        <TableCell>{item.account_nm}</TableCell>
                        <TableCell className="number">{formatNumber(item.thstrm_amount)}</TableCell>
                        <TableCell className="number">{formatNumber(item.frmtrm_amount)}</TableCell>
                        <TableCell className="number">{formatNumber(item.bfefrmtrm_amount)}</TableCell>
                        <TableCell className={`number ${isPositive ? 'growth-positive' : isNegative ? 'growth-negative' : ''}`}>
                          {growthRate}
                        </TableCell>
                      </tr>
                    );
                  })}
                </tbody>
                </Table>
              </DataTable>
            </div>
          )}
          
          {financialData?.list && filteredFinancialData.length === 0 && accountFilter && (
            <EmptyState>
              선택한 계정명 '{accountFilter}'에 해당하는 데이터가 없습니다.
              <br />
              <button 
                onClick={() => setAccountFilter('')}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Pretendard-Medium'
                }}
              >
                전체 계정 보기
              </button>
            </EmptyState>
          )}
          
          {financialData?.list && financialData.list.length === 0 && (
            <EmptyState>해당 조건의 재무 데이터가 없습니다.</EmptyState>
          )}
        </MainContent>

        <SidePanel>
          <PanelCard>
            <PanelTitle>빠른 통계</PanelTitle>
            <QuickStats>
              <StatItem>
                <StatValue>
                  {financialData?.list ? financialData.list.length : '-'}
                </StatValue>
                <StatLabel>총 계정 수</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{filters.bsns_year}</StatValue>
                <StatLabel>조회 연도</StatLabel>
              </StatItem>
            </QuickStats>
          </PanelCard>

          <PanelCard>
            <PanelTitle>분석 도구</PanelTitle>
            <div style={{ 
              color: '#718096', 
              fontFamily: 'Pretendard-Regular',
              lineHeight: '1.6'
            }}>
              • 재무비율 계산<br />
              • 동종업계 비교<br />
              • 트렌드 분석<br />
              • 주석 정보 조회
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#a0aec0' }}>
              * 추후 구현 예정
            </div>
          </PanelCard>

          <PanelCard>
            <PanelTitle>데이터 정보</PanelTitle>
            <div style={{ 
              fontSize: '0.9rem',
              color: '#718096',
              fontFamily: 'Pretendard-Regular',
              lineHeight: '1.6'
            }}>
              데이터 출처: 금융감독원 전자공시시스템(DART)<br />
              업데이트: 실시간<br />
              화폐단위: 원(KRW)
            </div>
          </PanelCard>
        </SidePanel>
      </ContentGrid>
    </AnalysisContainer>
  );
};

export default FinancialAnalysis;
