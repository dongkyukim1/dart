import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

// Material Dashboard Components
import GridContainer from './Grid/GridContainer';
import GridItem from './Grid/GridItem';
import Card from './Card/Card';
import CardHeader from './Card/CardHeader';
import CardIcon from './Card/CardIcon';
import CardBody from './Card/CardBody';
import CardFooter from './Card/CardFooter';

const DashboardContainer = styled.div`
  padding: 30px;
  background-color: #eeeeee;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const PageTitle = styled.h3`
  color: #3c4858;
  margin-top: 0;
  min-height: auto;
  font-weight: 300;
  font-family: 'Pretendard-Regular', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  margin-bottom: 30px;
  text-decoration: none;
  text-align: center;
  font-size: 2rem;
`;

const StatsText = styled.div`
  color: #999999;
  display: inline-flex;
  font-size: 12px;
  line-height: 22px;
  align-items: center;
  
  & svg {
    top: 4px;
    width: 16px;
    height: 16px;
    position: relative;
    margin-right: 3px;
    margin-left: 3px;
  }
`;

const CardCategory = styled.p`
  color: #999999;
  margin: 0;
  font-size: 14px;
  margin-top: 0;
  padding-top: 10px;
  margin-bottom: 0;
`;

const CardTitle = styled.h3`
  color: #3c4858;
  margin-top: 0px;
  min-height: auto;
  font-weight: 300;
  font-family: 'Pretendard-Regular', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  margin-bottom: 3px;
  text-decoration: none;
  font-size: 1.8rem;
  line-height: 1.4em;
  
  & small {
    color: #999999;
    font-weight: 400;
    line-height: 1;
  }
`;



const Dashboard = () => {
  const navigate = useNavigate();
  
  const { data: recentCompanies, isLoading, error } = useQuery(
    'recentCompanies',
    async () => {
      const response = await axios.get('http://localhost:8000/api/company/list');
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
      icon: '📊',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      status: 'active'
    },
    {
      id: 2,
      title: '임원ㆍ주요주주 소유보고',
      description: '임원ㆍ주요주주특정증권등 소유상황보고서 내에 임원ㆍ주요주주 소유보고 정보를 제공합니다.',
      icon: '👥',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      status: 'active'
    },
    {
      id: 4,
      title: '단일회사 전체 재무제표',
      description: '상장법인(유가증권, 코스닥) 및 주요 비상장법인이 제출한 정기보고서 내에 XBRL재무제표의 모든계정과목을 제공합니다.',
      icon: '📋',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      status: 'active'
    },
    {
      id: 5,
      title: 'XBRL택사노미재무제표양식',
      description: '금융감독원 회계포탈에서 제공하는 IFRS 기반 XBRL 재무제표 공시용 표준계정과목체계를 제공합니다.',
      icon: '📄',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      status: 'active'
    },
    {
      id: 6,
      title: '단일회사 주요 재무지표',
      description: '상장법인(유가증권, 코스닥) 및 주요 비상장법인이 제출한 정기보고서 내에 XBRL재무제표의 주요 재무지표를 제공합니다.',
      icon: '📈',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      status: 'active'
    },
    {
      id: 7,
      title: '다중회사 주요 재무지표',
      description: '상장법인(유가증권, 코스닥) 및 주요 비상장법인이 제출한 정기보고서 내에 XBRL재무제표의 주요 재무지표를 제공합니다.(대상법인 복수조회 가능)',
      icon: '📊',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
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
      <PageTitle>DART 재무제표 분석 시스템</PageTitle>
      
      {/* 통계 카드들 */}
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <span style={{fontSize: '36px'}}>🏢</span>
              </CardIcon>
              <CardCategory>등록된 기업</CardCategory>
              <CardTitle>
                {recentCompanies?.total_count || '2,000+'} <small>개</small>
              </CardTitle>
            </CardHeader>
            <CardFooter stats>
              <StatsText>
                <span style={{fontSize: '16px', marginRight: '5px'}}>📊</span>
                DART 등록 기업
              </StatsText>
            </CardFooter>
          </Card>
        </GridItem>
        
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <span style={{fontSize: '36px'}}>🛠️</span>
              </CardIcon>
              <CardCategory>제공 서비스</CardCategory>
              <CardTitle>7</CardTitle>
            </CardHeader>
            <CardFooter stats>
              <StatsText>
                <span style={{fontSize: '16px', marginRight: '5px'}}>⚡</span>
                DART API 서비스
              </StatsText>
            </CardFooter>
          </Card>
        </GridItem>
        
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <span style={{fontSize: '36px'}}>🔄</span>
              </CardIcon>
              <CardCategory>데이터 업데이트</CardCategory>
              <CardTitle>실시간</CardTitle>
            </CardHeader>
            <CardFooter stats>
              <StatsText>
                <span style={{fontSize: '16px', marginRight: '5px'}}>⏰</span>
                실시간 동기화
              </StatsText>
            </CardFooter>
          </Card>
        </GridItem>
        
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <span style={{fontSize: '36px'}}>🌟</span>
              </CardIcon>
              <CardCategory>서비스 운영</CardCategory>
              <CardTitle>24/7</CardTitle>
            </CardHeader>
            <CardFooter stats>
              <StatsText>
                <span style={{fontSize: '16px', marginRight: '5px'}}>🔄</span>
                연중무휴 서비스
              </StatsText>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      {/* DART API 서비스 카드들 */}
      <GridContainer>
        {dartServices.map((service, index) => (
          <GridItem xs={12} sm={6} md={4} key={service.id}>
            <Card>
              <CardHeader color={['primary', 'info', 'success', 'warning', 'danger', 'rose'][index % 6]}>
                <h4 style={{
                  color: '#ffffff',
                  marginTop: '0px',
                  minHeight: 'auto',
                  fontWeight: '300',
                  fontFamily: "'Pretendard-Regular', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                  marginBottom: '3px',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  lineHeight: '1.4em'
                }}>
                  {service.icon} {service.title}
                </h4>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.62)',
                  margin: '0',
                  fontSize: '12px',
                  marginTop: '0',
                  marginBottom: '0'
                }}>
                  DART API 서비스
                </p>
              </CardHeader>
              <CardBody>
                <p style={{
                  color: '#999999',
                  margin: '0',
                  fontSize: '14px',
                  marginTop: '0',
                  paddingTop: '10px',
                  marginBottom: '15px',
                  lineHeight: '1.5'
                }}>
                  {service.description}
                </p>
                <button
                  onClick={() => handleServiceClick(service.id)}
                  style={{
                    background: 'linear-gradient(60deg, #26c6da, #00acc1)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '3px',
                    fontFamily: "'Pretendard-Medium', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    fontWeight: '500'
                  }}
                >
                  바로가기
                </button>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </GridContainer>

      {/* 인기 기업 및 최근 공시 */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 style={{
                color: '#ffffff',
                marginTop: '0px',
                minHeight: 'auto',
                fontWeight: '300',
                fontFamily: "'Pretendard-Regular', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                marginBottom: '3px',
                textDecoration: 'none',
                fontSize: '1.3rem',
                lineHeight: '1.4em'
              }}>
                🏢 인기 기업 바로가기
              </h4>
              <p style={{
                color: 'rgba(255, 255, 255, 0.62)',
                margin: '0',
                fontSize: '14px',
                marginTop: '0',
                marginBottom: '0'
              }}>
                주요 상장기업 재무분석
              </p>
            </CardHeader>
            <CardBody>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '10px'
              }}>
                {popularCompanies.map((company, index) => (
                  <div key={company.code} style={{
                    padding: '10px',
                    background: '#f8f9fa',
                    borderRadius: '6px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate(`/analysis/${company.code}`)}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e9ecef';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f8f9fa';
                    e.target.style.transform = 'translateY(0)';
                  }}>
                    <div style={{
                      fontFamily: "'Pretendard-Medium', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                      fontSize: '0.9rem',
                      color: '#3c4858',
                      marginBottom: '5px'
                    }}>
                      {company.name}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#999999'
                    }}>
                      {company.sector}
                    </div>
                  </div>
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
                fontWeight: '300',
                fontFamily: "'Pretendard-Regular', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                marginBottom: '3px',
                textDecoration: 'none',
                fontSize: '1.3rem',
                lineHeight: '1.4em'
              }}>
                📋 최근 공시 정보
              </h4>
              <p style={{
                color: 'rgba(255, 255, 255, 0.62)',
                margin: '0',
                fontSize: '14px',
                marginTop: '0',
                marginBottom: '0'
              }}>
                실시간 업데이트
              </p>
            </CardHeader>
            <CardBody>
              {isLoading && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                  <div style={{ fontFamily: "'Pretendard-Regular', 'Roboto'", color: '#999999' }}>
                    최근 공시 정보를 불러오는 중...
                  </div>
                </div>
              )}
              {error && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
                  <div style={{ fontFamily: "'Pretendard-Regular', 'Roboto'", color: '#e53e3e' }}>
                    데이터를 불러오는 중 오류가 발생했습니다.
                  </div>
                </div>
              )}
              {recentCompanies && recentCompanies.list && (
                <div>
                  {recentCompanies.list.slice(0, 4).map((company, index) => (
                    <div key={index} style={{ 
                      padding: '10px 0',
                      borderBottom: index < 3 ? '1px solid #eee' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/analysis/${company.corp_code}`)}>
                      <div style={{
                        fontFamily: "'Pretendard-Medium', 'Roboto', 'Helvetica', 'Arial', sans-serif",
                        fontSize: '0.9rem',
                        color: '#3c4858',
                        marginBottom: '5px'
                      }}>
                        {company.corp_name}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#999999'
                      }}>
                        {company.report_nm} | {company.rcept_dt}
                      </div>
                    </div>
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
