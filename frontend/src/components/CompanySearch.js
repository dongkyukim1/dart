import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SearchContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const SearchHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const QuickFilters = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const QuickFiltersTitle = styled.h3`
  font-family: 'Pretendard-SemiBold', sans-serif;
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const QuickButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const QuickButton = styled.button`
  padding: 0.75rem 1rem;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f7fafc'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  border: 2px solid ${props => props.active ? 'transparent' : '#e2e8f0'};
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #5a6fd8 0%, #6b5b95 100%)' : '#edf2f7'};
    transform: translateY(-1px);
  }
`;

const SearchBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SearchInputContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
  font-size: 1.2rem;
  pointer-events: none;
`;

const FilterToggle = styled.button`
  background: ${props => props.expanded ? '#667eea' : '#f7fafc'};
  color: ${props => props.expanded ? 'white' : '#4a5568'};
  border: 2px solid ${props => props.expanded ? '#667eea' : '#e2e8f0'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.expanded ? '#5a6fd8' : '#edf2f7'};
  }
`;

const AdvancedFilters = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: ${props => props.show ? 'block' : 'none'};
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SuggestionItem = styled.li`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f7fafc;
  font-family: 'Pretendard-Regular', sans-serif;
  transition: background-color 0.2s ease;

  &:hover, &.active {
    background-color: #f7fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const SearchForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-family: 'Pretendard-Medium', sans-serif;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  justify-self: start;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultsContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ResultsHeader = styled.div`
  padding: 1.5rem 2rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const ResultsTitle = styled.h2`
  font-family: 'Pretendard-SemiBold', sans-serif;
  color: #2d3748;
  font-size: 1.2rem;
`;

const ResultItem = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f7fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CompanyName = styled.h3`
  font-family: 'Pretendard-SemiBold', sans-serif;
  color: #2d3748;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const ReportInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
`;

const InfoTag = styled.span`
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 0.8rem;
`;

const ViewButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 3rem;
  font-family: 'Pretendard-Regular', sans-serif;
  color: #718096;
`;

const ErrorText = styled.p`
  text-align: center;
  padding: 3rem;
  font-family: 'Pretendard-Regular', sans-serif;
  color: #e53e3e;
`;

const CompanySearch = () => {
  const [searchParams, setSearchParams] = useState({
    corp_code: '',
    bgn_de: '',
    end_de: '',
    pblntf_ty: '',
    corp_cls: '',
    page_count: 20
  });
  const [shouldSearch, setShouldSearch] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

  // 기업명 자동완성을 위한 샘플 데이터
  const companyNames = [
    '삼성전자', 'SK하이닉스', 'LG에너지솔루션', 'NAVER', '카카오',
    '현대자동차', 'LG화학', 'POSCO홀딩스', '한국전력공사', 'KT&G',
    '삼성SDI', 'LG전자', '현대모비스', 'KB금융', '신한지주',
    'SK텔레콤', 'LG디스플레이', '기아', '한화솔루션', 'CJ제일제당'
  ];

  // 빠른 필터 옵션들
  const quickFilters = [
    {
      id: 'recent_reports',
      label: '최근 사업보고서',
      params: {
        pblntf_ty: 'A',
        bgn_de: getDateString(-30),
        end_de: getDateString(0),
        corp_cls: '',
        page_count: 50
      }
    },
    {
      id: 'kospi_companies',
      label: '코스피 기업',
      params: {
        corp_cls: 'Y',
        pblntf_ty: 'A',
        bgn_de: getDateString(-90),
        end_de: getDateString(0),
        page_count: 50
      }
    },
    {
      id: 'kosdaq_companies',
      label: '코스닥 기업',
      params: {
        corp_cls: 'K',
        pblntf_ty: 'A',
        bgn_de: getDateString(-90),
        end_de: getDateString(0),
        page_count: 50
      }
    },
    {
      id: 'quarterly_reports',
      label: '분기보고서',
      params: {
        pblntf_ty: 'A',
        bgn_de: getDateString(-60),
        end_de: getDateString(0),
        page_count: 50
      }
    }
  ];

  function getDateString(daysOffset) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  }

  const { data: searchResults, isLoading, error } = useQuery(
    ['companySearch', searchParams],
    async () => {
      const response = await axios.post('/api/company/search', searchParams);
      return response.data;
    },
    {
      enabled: shouldSearch,
      retry: 1,
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
    setActiveQuickFilter(''); // 직접 입력 시 빠른 필터 해제
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShouldSearch(true);
  };

  const handleQuickFilter = (filterId) => {
    const filter = quickFilters.find(f => f.id === filterId);
    if (filter) {
      setSearchParams(prev => ({
        ...prev,
        ...filter.params
      }));
      setActiveQuickFilter(filterId);
      setShouldSearch(true);
    }
  };

  const clearFilters = () => {
    setSearchParams({
      corp_code: '',
      bgn_de: '',
      end_de: '',
      pblntf_ty: '',
      corp_cls: '',
      page_count: 20
    });
    setActiveQuickFilter('');
    setSearchQuery('');
    setShouldSearch(false);
    setShowSuggestions(false);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setActiveQuickFilter(''); // 직접 검색 시 빠른 필터 해제

    if (value.length > 0) {
      const filtered = companyNames.filter(name => 
        name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedSuggestion(-1);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    // 기업명으로 검색 실행
    executeSearch(suggestion);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestion >= 0) {
        handleSuggestionClick(suggestions[selectedSuggestion]);
      } else if (searchQuery) {
        executeSearch(searchQuery);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const executeSearch = (query = searchQuery) => {
    // 기업명으로 검색하는 경우 (실제로는 DART API에서 기업명 검색을 지원해야 함)
    if (query) {
      // 여기서는 기존 검색 로직을 실행
      setShouldSearch(true);
      setShowSuggestions(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString.length !== 8) return dateString;
    return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
  };

  return (
    <SearchContainer>
      <SearchHeader>
        <PageTitle>기업 공시 검색</PageTitle>
      </SearchHeader>

      <QuickFilters>
        <QuickFiltersTitle>빠른 검색</QuickFiltersTitle>
        <QuickButtonGrid>
          {quickFilters.map(filter => (
            <QuickButton
              key={filter.id}
              active={activeQuickFilter === filter.id}
              onClick={() => handleQuickFilter(filter.id)}
            >
              {filter.label}
            </QuickButton>
          ))}
          <QuickButton onClick={clearFilters} style={{ 
            background: '#fed7d7', 
            color: '#c53030',
            border: '2px solid #feb2b2'
          }}>
            필터 초기화
          </QuickButton>
        </QuickButtonGrid>
      </QuickFilters>

      <SearchBox>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ 
            fontFamily: 'Pretendard-SemiBold', 
            color: '#2d3748', 
            marginBottom: '1rem',
            fontSize: '1.1rem'
          }}>
            기업명으로 검색
          </h3>
          <SearchInputContainer>
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="기업명을 입력하세요 (예: 삼성전자, LG화학)"
            />
            <SearchIcon>🔍</SearchIcon>
            {showSuggestions && suggestions.length > 0 && (
              <SuggestionsList>
                {suggestions.map((suggestion, index) => (
                  <SuggestionItem
                    key={suggestion}
                    className={index === selectedSuggestion ? 'active' : ''}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </SuggestionItem>
                ))}
              </SuggestionsList>
            )}
          </SearchInputContainer>
        </div>

        <FilterToggle
          type="button"
          expanded={showAdvancedFilters}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? '🔼' : '🔽'} 고급 필터
        </FilterToggle>

        <AdvancedFilters show={showAdvancedFilters}>
          <FilterRow>
            <FormGroup>
              <Label>검색 기간 (시작일)</Label>
              <Input
                type="date"
                name="bgn_de"
                value={searchParams.bgn_de}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>검색 기간 (종료일)</Label>
              <Input
                type="date"
                name="end_de"
                value={searchParams.end_de}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>시장 구분</Label>
              <Select
                name="corp_cls"
                value={searchParams.corp_cls}
                onChange={handleInputChange}
              >
                <option value="">전체</option>
                <option value="Y">유가증권시장 (코스피)</option>
                <option value="K">코스닥</option>
                <option value="N">코넥스</option>
                <option value="E">기타</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>공시 유형</Label>
              <Select
                name="pblntf_ty"
                value={searchParams.pblntf_ty}
                onChange={handleInputChange}
              >
                <option value="">전체</option>
                <option value="A">정기공시</option>
                <option value="B">주요사항보고</option>
                <option value="C">발행공시</option>
                <option value="D">지분공시</option>
                <option value="E">기타공시</option>
              </Select>
            </FormGroup>
          </FilterRow>
          <FilterRow>
            <FormGroup>
              <Label>결과 수</Label>
              <Select
                name="page_count"
                value={searchParams.page_count}
                onChange={handleInputChange}
              >
                <option value="10">10건</option>
                <option value="20">20건</option>
                <option value="50">50건</option>
                <option value="100">100건</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>기업 고유번호</Label>
              <Input
                type="text"
                name="corp_code"
                value={searchParams.corp_code}
                onChange={handleInputChange}
                placeholder="8자리 고유번호"
                maxLength="8"
              />
            </FormGroup>
          </FilterRow>
        </AdvancedFilters>
      </SearchBox>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <SearchButton 
          type="button" 
          onClick={() => setShouldSearch(true)}
          disabled={isLoading}
          style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
        >
          {isLoading ? '🔍 검색 중...' : '🔍 검색 실행'}
        </SearchButton>
      </div>

      {shouldSearch && (
        <ResultsContainer>
          <ResultsHeader>
            <ResultsTitle>
              검색 결과 
              {searchResults?.total_count && ` (총 ${searchResults.total_count}건)`}
            </ResultsTitle>
          </ResultsHeader>

          {isLoading && <LoadingText>검색 중...</LoadingText>}
          {error && <ErrorText>검색 중 오류가 발생했습니다.</ErrorText>}
          
          {searchResults?.list && searchResults.list.length > 0 ? (
            searchResults.list.map((company, index) => (
              <ResultItem key={index}>
                <CompanyName>{company.corp_name}</CompanyName>
                <ReportInfo>
                  <InfoTag>보고서: {company.report_nm}</InfoTag>
                  <InfoTag>접수일: {formatDate(company.rcept_dt)}</InfoTag>
                  <InfoTag>제출인: {company.flr_nm}</InfoTag>
                  {company.rm && <InfoTag>{company.rm}</InfoTag>}
                </ReportInfo>
                <ViewButton to={`/analysis/${company.corp_code}`}>
                  상세 분석
                </ViewButton>
              </ResultItem>
            ))
          ) : searchResults?.list && (
            <LoadingText>검색 결과가 없습니다.</LoadingText>
          )}
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};

export default CompanySearch;
