import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faDatabase, 
  faChartLine, 
  faShieldAlt,
  faFileText,
  faSearch,
  faUsers,
  faClipboardCheck
} from '@fortawesome/free-solid-svg-icons';

// Material Dashboard Components
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardIcon from '../../components/Card/CardIcon';
import CardBody from '../../components/Card/CardBody';
import CardFooter from '../../components/Card/CardFooter';

const DashboardContainer = styled.div`
  background: #fafbfc;
  min-height: 100vh;
`;

const PageTitle = styled.h1`
  color: #1a365d;
  margin-top: -10px;
  margin-bottom: 3rem;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  padding-bottom: 0;
  font-family: 'Pretendard-SemiBold', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const StatsText = styled.div`
  color: #718096;
  display: inline-flex;
  font-size: 0.875rem;
  line-height: 1.5;
  align-items: center;
  font-weight: 500;
  font-family: 'Pretendard-Medium', sans-serif;
  
  & svg {
    width: 16px;
    height: 16px;
    margin-right: 6px;
    color: #4a5568;
  }
`;

const CardCategory = styled.p`
  color:rgb(0, 255, 76) !important;
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0;
  padding-top: 0.75rem;
  margin-bottom: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Pretendard-SemiBold', sans-serif;
`;

const CardTitle = styled.h3`
  color:rgb(250, 250, 250) !important;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  font-family: 'Pretendard-Bold', sans-serif;
  
  & small {
    color: #4a5568 !important;
    font-weight: 600;
    font-size: 1.125rem;
    margin-left: 0.25rem;
  }
`;

const ServiceButton = styled.button`
  background: #2d3748;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-family: 'Pretendard-Medium', sans-serif;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  min-width: 120px;
  
  &:hover {
    background: #1a202c;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(45, 55, 72, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CompanyCard = styled.div`
  padding: 16px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #cbd5e0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
`;

const CompanyName = styled.div`
  font-family: 'Pretendard-SemiBold', sans-serif;
  font-size: 0.95rem;
  color: #2d3748;
  margin-bottom: 4px;
`;

const CompanySector = styled.div`
  font-size: 0.8rem;
  color: #718096;
  font-family: 'Pretendard-Regular', sans-serif;
`;

const RecentDisclosure = styled.div`
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
  background: #ffffff;
  
  &:hover {
    border-color: #2d3748;
    box-shadow: 0 2px 8px rgba(45, 55, 72, 0.1);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;



const Dashboard = () => {
  const navigate = useNavigate();
  
  const { data: recentCompanies, isLoading, error } = useQuery(
    'recentCompanies',
    async () => {
      const response = await axios.get('/api/company/list');
      return response.data;
    },
    {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분간 캐시
    }
  );

  // 인기 기업들
  const popularCompanies = [
    { name: '삼성전자', code: '00126380', sector: '반도체' },
    { name: 'SK하이닉스', code: '00164779', sector: '반도체' },
    { name: 'LG에너지솔루션', code: '00373617', sector: '배터리' },
    { name: 'NAVER', code: '00152141', sector: 'IT서비스' },
    { name: '카카오', code: '00237903', sector: 'IT서비스' },
    { name: '현대자동차', code: '00126180', sector: '자동차' }
  ];

  // DART API 서비스 목록
  const dartServices = [
    {
      id: 1,
      title: '대량보유 상황보고',
      description: '주식등의 대량보유상황보고서 내에 대량보유 상황보고 정보를 제공합니다.',
      icon: faUsers,
      color: 'primary',
      status: 'active'
    },
    {
      id: 2,
      title: '임원ㆍ주요주주 소유보고',
      description: '임원ㆍ주요주주특정증권등 소유상황보고서 내에 임원ㆍ주요주주 소유보고 정보를 제공합니다.',
      icon: faClipboardCheck,
      color: 'info',
      status: 'active'
    },
    {
      id: 4,
      title: '단일회사 전체 재무제표',
      description: '상장법인(유가증권, 코스닥) 및 주요 비상장법인이 제출한 정기보고서 내에 XBRL재무제표의 모든계정과목을 제공합니다.',
      icon: faFileText,
      color: 'success',
      status: 'active'
    },
    {
      id: 5,
      title: 'XBRL택사노미재무제표양식',
      description: '금융감독원 회계포탈에서 제공하는 IFRS 기반 XBRL 재무제표 공시용 표준계정과목체계를 제공합니다.',
      icon: faDatabase,
      color: 'warning',
      status: 'active'
    },
    {
      id: 6,
      title: '단일회사 주요 재무지표',
      description: '상장법인(유가증권, 코스닥) 및 주요 비상장법인이 제출한 정기보고서 내에 XBRL재무제표의 주요 재무지표를 제공합니다.',
      icon: faChartLine,
      color: 'rose',
      status: 'active'
    },
    {
      id: 7,
      title: '다중회사 주요 재무지표',
      description: '상장법인(유가증권, 코스닥) 및 주요 비상장법인이 제출한 정기보고서 내에 XBRL재무제표의 주요 재무지표를 제공합니다.(대상법인 복수조회 가능)',
      icon: faSearch,
      color: 'primary',
      status: 'active'
    }
  ];

  const handleServiceClick = (serviceId) => {
    // 각 서비스별로 다른 페이지로 이동하거나 기능 실행
    switch(serviceId) {
      case 4:
      case 6:
        navigate('/search'); // 재무제표 관련 서비스는 검색 페이지로
        break;
      default:
        alert(`${dartServices.find(s => s.id === serviceId)?.title} 서비스는 준비 중입니다.`);
    }
  };

  return (
    <DashboardContainer>
      <PageTitle>DART 재무제표 분석 시스템 - 이동건 요청 </PageTitle>
      
      {/* 통계 카드들 */}
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="primary" stats icon>
              <CardIcon color="primary">
                <FontAwesomeIcon icon={faBuilding} style={{fontSize: '24px'}} />
              </CardIcon>
              <CardCategory>등록된 기업</CardCategory>
              <CardTitle>
                {recentCompanies?.total_count || '2,000+'} <small>개</small>
              </CardTitle>
            </CardHeader>
            <CardFooter stats>
              <StatsText>
                <FontAwesomeIcon icon={faBuilding} />
                DART 등록 기업
              </StatsText>
            </CardFooter>
          </Card>
        </GridItem>
        
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <FontAwesomeIcon icon={faDatabase} style={{fontSize: '24px'}} />
              </CardIcon>
              <CardCategory>제공 서비스</CardCategory>
              <CardTitle>7</CardTitle>
            </CardHeader>
            <CardFooter stats>
              <StatsText>
                <FontAwesomeIcon icon={faDatabase} />
                DART API 서비스
              </StatsText>
            </CardFooter>
          </Card>
        </GridItem>
        
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <FontAwesomeIcon icon={faChartLine} style={{fontSize: '24px'}} />
              </CardIcon>
              <CardCategory>데이터 업데이트</CardCategory>
              <CardTitle>실시간</CardTitle>
            </CardHeader>
            <CardFooter stats>
              <StatsText>
                <FontAwesomeIcon icon={faChartLine} />
                실시간 동기화
              </StatsText>
            </CardFooter>
          </Card>
        </GridItem>
        
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <FontAwesomeIcon icon={faShieldAlt} style={{fontSize: '24px'}} />
              </CardIcon>
              <CardCategory>서비스 운영</CardCategory>
              <CardTitle>24/7</CardTitle>
            </CardHeader>
            <CardFooter stats>
              <StatsText>
                <FontAwesomeIcon icon={faShieldAlt} />
                연중무휴 서비스
              </StatsText>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      {/* DART API 서비스 카드들 */}
      <GridContainer>
        {dartServices.map((service) => (
          <GridItem xs={12} sm={6} md={4} key={service.id}>
            <Card>
              <CardHeader color={service.color}>
                <h4 style={{
                  color: '#ffffff',
                  marginTop: '0px',
                  minHeight: 'auto',
                  fontWeight: '600',
                  fontFamily: "'Pretendard-SemiBold', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                  marginBottom: '8px',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  lineHeight: '1.3em',
                  letterSpacing: '-0.025em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FontAwesomeIcon icon={service.icon} style={{fontSize: '1rem'}} />
                  {service.title}
                </h4>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  margin: '0',
                  fontSize: '0.875rem',
                  marginTop: '0',
                  marginBottom: '0',
                  fontFamily: "'Pretendard-Medium', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                  fontWeight: '500'
                }}>
                  DART API 서비스
                </p>
              </CardHeader>
              <CardBody>
                <p style={{
                  color: '#4a5568',
                  margin: '0',
                  fontSize: '0.875rem',
                  marginTop: '0',
                  paddingTop: '16px',
                  marginBottom: '24px',
                  lineHeight: '1.6',
                  fontFamily: "'Pretendard-Regular', 'Roboto', 'Helvetica', 'Arial', sans-serif"
                }}>
                  {service.description}
                </p>
                <ServiceButton onClick={() => handleServiceClick(service.id)}>
                  서비스 이용하기
                </ServiceButton>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </GridContainer>

      {/* 인기 기업 및 최근 공시 */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="primary">
              <h4 style={{
                color: '#ffffff',
                marginTop: '0px',
                minHeight: 'auto',
                fontWeight: '600',
                fontFamily: "'Pretendard-SemiBold', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                marginBottom: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                lineHeight: '1.3em',
                letterSpacing: '-0.025em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FontAwesomeIcon icon={faBuilding} style={{fontSize: '1rem'}} />
                인기 기업 분석
              </h4>
              <p style={{
                color: 'rgba(255, 255, 255, 0.85)',
                margin: '0',
                fontSize: '0.875rem',
                marginTop: '0',
                marginBottom: '0',
                fontFamily: "'Pretendard-Medium', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                fontWeight: '500'
              }}>
                주요 상장기업 재무분석
              </p>
            </CardHeader>
            <CardBody>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px'
              }}>
                {popularCompanies.map((company) => (
                  <CompanyCard 
                    key={company.code}
                    onClick={() => navigate(`/financial-analysis?corp_code=${company.code}&corp_name=${encodeURIComponent(company.name)}`)}
                  >
                    <CompanyName>{company.name}</CompanyName>
                    <CompanySector>{company.sector}</CompanySector>
                  </CompanyCard>
                ))}
              </div>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="info">
              <h4 style={{
                color: '#ffffff',
                marginTop: '0px',
                minHeight: 'auto',
                fontWeight: '600',
                fontFamily: "'Pretendard-SemiBold', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                marginBottom: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                lineHeight: '1.3em',
                letterSpacing: '-0.025em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FontAwesomeIcon icon={faFileText} style={{fontSize: '1rem'}} />
                최근 공시 정보
              </h4>
              <p style={{
                color: 'rgba(255, 255, 255, 0.85)',
                margin: '0',
                fontSize: '0.875rem',
                marginTop: '0',
                marginBottom: '0',
                fontFamily: "'Pretendard-Medium', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                fontWeight: '500'
              }}>
                실시간 업데이트
              </p>
            </CardHeader>
            <CardBody>
              {isLoading && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#718096' }}>
                    <FontAwesomeIcon icon={faChartLine} />
                  </div>
                  <div style={{ fontFamily: "'Pretendard-Regular', 'Roboto'", color: '#718096', fontSize: '0.875rem' }}>
                    최근 공시 정보를 불러오는 중...
                  </div>
                </div>
              )}
              {error && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#e53e3e' }}>
                    <FontAwesomeIcon icon={faShieldAlt} />
                  </div>
                  <div style={{ fontFamily: "'Pretendard-Regular', 'Roboto'", color: '#e53e3e', fontSize: '0.875rem' }}>
                    데이터를 불러오는 중 오류가 발생했습니다.
                  </div>
                </div>
              )}
              {recentCompanies && recentCompanies.list && (
                <div>
                  {recentCompanies.list.slice(0, 4).map((company, index) => (
                    <RecentDisclosure 
                      key={index}
                      onClick={() => navigate(`/financial-analysis?corp_code=${company.corp_code}&corp_name=${encodeURIComponent(company.corp_name)}`)}
                    >
                      <div style={{
                        fontFamily: "'Pretendard-SemiBold', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                        fontSize: '0.9rem',
                        color: '#2d3748',
                        marginBottom: '6px'
                      }}>
                        {company.corp_name}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#718096',
                        fontFamily: "'Pretendard-Regular', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <FontAwesomeIcon icon={faFileText} style={{fontSize: '0.75rem'}} />
                        {company.report_nm} · {company.rcept_dt}
                      </div>
                    </RecentDisclosure>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
