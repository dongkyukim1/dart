import React from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Logo = styled.h1`
  font-family: 'Pretendard-Bold', sans-serif;
  font-size: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.5rem;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-family: 'Pretendard-Medium', sans-serif;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.active && `
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  `}

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
  }
`;

const QuickButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-family: 'Pretendard-Regular', sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.3rem 0.6rem;
  }
`;

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 인기 기업들의 corp_code (예시)
  const popularCompanies = [
    { name: '삼성전자', code: '00126380' },
    { name: 'SK하이닉스', code: '00164779' },
    { name: 'LG에너지솔루션', code: '00373617' },
    { name: 'NAVER', code: '00152141' }
  ];

  const handleQuickAnalysis = (corpCode) => {
    navigate(`/analysis/${corpCode}`);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>DART 재무제표 분석</Logo>
        <Navigation>
          <NavLink to="/" active={location.pathname === '/' ? 1 : 0}>
            🏠 대시보드
          </NavLink>
          <NavLink to="/search" active={location.pathname === '/search' ? 1 : 0}>
            🔍 기업 검색
          </NavLink>
          <QuickActions>
            {popularCompanies.slice(0, 2).map(company => (
              <QuickButton
                key={company.code}
                onClick={() => handleQuickAnalysis(company.code)}
                title={`${company.name} 재무분석 바로가기`}
              >
                {company.name}
              </QuickButton>
            ))}
          </QuickActions>
        </Navigation>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
