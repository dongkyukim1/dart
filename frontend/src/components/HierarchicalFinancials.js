import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import axios from 'axios';

const Container = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 0;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 12px 12px 0 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  font-family: 'Pretendard-SemiBold', sans-serif;
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const YearHeaders = styled.div`
  display: grid;
  grid-template-columns: 300px repeat(5, 1fr);
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  
  @media (max-width: 1024px) {
    grid-template-columns: 200px repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 150px repeat(2, 1fr);
  }
`;

const YearHeader = styled.div`
  padding: 1rem;
  font-weight: 600;
  font-family: 'Pretendard-SemiBold', sans-serif;
  color: #4a5568;
  text-align: center;
  border-right: 1px solid #e2e8f0;
  
  &:first-child {
    text-align: left;
    font-size: 1rem;
  }
  
  &:last-child {
    border-right: none;
  }
`;

const FinancialRow = styled.div`
  display: grid;
  grid-template-columns: 300px repeat(5, 1fr);
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
  }
  
  ${props => props.$level === 0 && `
    background-color: #f8fafc;
    font-weight: 600;
    border-bottom: 2px solid #e2e8f0;
  `}
  
  ${props => props.$level === 1 && `
    background-color: #ffffff;
  `}
  
  ${props => props.$level === 2 && `
    background-color: #fafbfc;
  `}
  
  @media (max-width: 1024px) {
    grid-template-columns: 200px repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 150px repeat(2, 1fr);
  }
`;

const AccountName = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-right: 1px solid #e2e8f0;
  
  ${props => props.$level > 0 && `
    padding-left: ${1 + props.$level * 1.5}rem;
    font-size: 0.9rem;
  `}
  
  ${props => props.$clickable && `
    cursor: pointer;
    &:hover {
      color: #667eea;
    }
  `}
`;

const ExpandIcon = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 12px;
  transition: transform 0.2s ease;
  
  ${props => props.$expanded && `
    transform: rotate(90deg);
  `}
`;

const AmountCell = styled.div`
  padding: 1rem;
  text-align: right;
  border-right: 1px solid #e2e8f0;
  font-family: 'Pretendard-Regular', sans-serif;
  
  &:last-child {
    border-right: none;
  }
  
  ${props => props.$negative && `
    color: #e53e3e;
  `}
  
  ${props => props.$level === 0 && `
    font-weight: 600;
    color: #2d3748;
  `}
`;

const LoadingContainer = styled.div`
  padding: 3rem;
  text-align: center;
  color: #718096;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const ErrorContainer = styled.div`
  padding: 3rem;
  text-align: center;
  color: #e53e3e;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const HierarchicalFinancials = ({ corpCode, corpName }) => {
  const [expandedItems, setExpandedItems] = useState(new Set(['유동자산', '비유동자산']));
  
  const { data: financialData, isLoading, error } = useQuery(
    ['hierarchicalFinancials', corpCode],
    async () => {
      const response = await axios.get(`http://localhost:8000/api/financial/hierarchical/${corpCode}`);
      return response.data;
    },
    {
      enabled: !!corpCode,
      staleTime: 10 * 60 * 1000, // 10분 캐시
      retry: 1
    }
  );

  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return '-';
    
    const numAmount = Math.abs(amount);
    let formatted;
    
    if (numAmount >= 1000000000000) {
      formatted = `${(numAmount / 1000000000000).toFixed(1)}조`;
    } else if (numAmount >= 100000000) {
      formatted = `${(numAmount / 100000000).toFixed(1)}억`;
    } else if (numAmount >= 10000) {
      formatted = `${(numAmount / 10000).toFixed(1)}만`;
    } else {
      formatted = new Intl.NumberFormat('ko-KR').format(numAmount);
    }
    
    return amount < 0 ? `(${formatted})` : formatted;
  };

  const toggleExpand = (itemKey) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemKey)) {
      newExpanded.delete(itemKey);
    } else {
      newExpanded.add(itemKey);
    }
    setExpandedItems(newExpanded);
  };

  const renderFinancialRow = (key, data, level = 0, parentKey = '') => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    const isExpanded = expandedItems.has(fullKey);
    const hasDetails = data.has_details;
    
    // 표시할 연도들 (최근 5년)
    const years = ['2023', '2022', '2021', '2020', '2019'];
    
    return (
      <React.Fragment key={fullKey}>
        <FinancialRow $level={level}>
          <AccountName 
            $level={level}
            $clickable={hasDetails}
            onClick={() => hasDetails && toggleExpand(fullKey)}
          >
            {hasDetails && (
              <ExpandIcon $expanded={isExpanded}>
                ▶
              </ExpandIcon>
            )}
            {key}
          </AccountName>
          {years.map(year => (
            <AmountCell 
              key={year}
              $level={level}
              $negative={data.amount[year] < 0}
            >
              {formatAmount(data.amount[year])}
            </AmountCell>
          ))}
        </FinancialRow>
        
        {hasDetails && isExpanded && data.details && (
          Object.entries(data.details).map(([subKey, subData]) =>
            renderFinancialRow(subKey, subData, level + 1, fullKey)
          )
        )}
      </React.Fragment>
    );
  };

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>계층형 재무제표</Title>
          <Subtitle>데이터를 불러오는 중...</Subtitle>
        </Header>
        <LoadingContainer>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          재무제표 데이터를 로딩 중입니다...
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>계층형 재무제표</Title>
          <Subtitle>오류가 발생했습니다</Subtitle>
        </Header>
        <ErrorContainer>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          재무제표 데이터를 불러올 수 없습니다.
        </ErrorContainer>
      </Container>
    );
  }

  const data = financialData?.data || {};
  const years = ['2023', '2022', '2021', '2020', '2019'];

  return (
    <Container>
      <Header>
        <Title>🏢 {corpName || '기업'} 계층형 재무제표</Title>
        <Subtitle>
          세부 항목을 클릭하면 하위 계정을 볼 수 있습니다 · 단위: 원
        </Subtitle>
      </Header>
      
      <YearHeaders>
        <YearHeader>계정과목</YearHeader>
        {years.map(year => (
          <YearHeader key={year}>{year}년</YearHeader>
        ))}
      </YearHeaders>
      
      <div>
        {Object.entries(data).map(([key, categoryData]) =>
          renderFinancialRow(key, categoryData, 0)
        )}
      </div>
      
      {Object.keys(data).length === 0 && (
        <div style={{ 
          padding: '3rem', 
          textAlign: 'center', 
          color: '#718096',
          fontFamily: 'Pretendard-Regular'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          재무제표 데이터가 없습니다.
        </div>
      )}
    </Container>
  );
};

export default HierarchicalFinancials;
