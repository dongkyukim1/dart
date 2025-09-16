import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  display: block;
  z-index: 1;
  color: #ffffff;
  font-weight: 200;
  background-size: cover;
  background-position: center center;
  height: 100vh;
  background: linear-gradient(180deg, #7b1fa2, #e1bee7);
  box-shadow: 0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  transition: all 150ms ease;
  
  &:after {
    position: absolute;
    z-index: 3;
    width: 100%;
    height: 100%;
    content: "";
    display: block;
    background: #000000;
    opacity: 0.8;
    top: 0;
  }

  @media (max-width: 991px) {
    transform: translateX(-260px);
    &.open {
      transform: translateX(0px);
    }
  }
`;

const SidebarBackground = styled.div`
  position: absolute;
  z-index: 1;
  height: 100%;
  width: 100%;
  display: block;
  top: 0;
  left: 0;
  background-size: cover;
  background-position: center center;
`;

const Logo = styled.div`
  position: relative;
  padding: 0.5rem 0.7rem;
  z-index: 4;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    height: 1px;
    right: 15px;
    left: 15px;
    background-color: rgba(180, 180, 180, 0.3);
  }
`;

const LogoLink = styled.div`
  text-transform: uppercase;
  padding: 0.625rem 0;
  display: block;
  font-size: var(--font-lg);
  text-align: left;
  font-weight: 700;
  line-height: 1.5;
  text-decoration: none;
  background-color: transparent;
  color: #ffffff;
  cursor: pointer;
  letter-spacing: 0.025em;
`;

const SidebarList = styled.div`
  margin-top: 20px;
  padding-left: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 0;
  list-style: none;
  position: unset;
`;

const NavItem = styled.div`
  position: relative;
  display: block;
  text-decoration: none;
  margin: 0;
  border-radius: 3px;
  
  &:hover:not(.active) {
    background: rgba(200, 200, 200, 0.2);
  }
  
  ${props => props.active && `
    background: rgba(255, 255, 255, 0.13);
    box-shadow: 0 12px 20px -10px rgba(156, 39, 176, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(156, 39, 176, 0.2);
  `}
`;

const NavLink = styled.div`
  width: auto;
  border-radius: 3px;
  margin: 0 15px;
  padding: 10px 15px;
  display: block;
  text-decoration: none;
  background-color: transparent;
  color: #ffffff;
  cursor: pointer;
  position: relative;
  z-index: 4;
  font-size: 14px;
  
  display: flex;
  align-items: center;
  
  & .material-icons {
    width: 30px;
    height: 30px;
    font-size: 24px;
    line-height: 30px;
    float: left;
    margin-right: 15px;
    text-align: center;
    vertical-align: middle;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const NavText = styled.span`
  margin: 0;
  line-height: 30px;
  font-size: 14px;
  color: #ffffff;
`;

const UserInfo = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  padding: 0 15px;
  z-index: 4;
`;

const UserCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 6px;
  text-align: center;
`;

const UserName = styled.div`
  color: #ffffff;
  font-size: 16px;
  font-weight: 300;
  margin-bottom: 5px;
`;

const UserRole = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
`;

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    {
      path: "/",
      name: "Dashboard",
      icon: "🏠",
    },
    {
      path: "/search", 
      name: "기업 검색",
      icon: "🔍",
    },
    {
      path: "/bulk-ownership",
      name: "대량보유 상황보고", 
      icon: "📊",
    },
    {
      path: "/executive-ownership",
      name: "임원·주주 소유보고",
      icon: "👥",
    },
    {
      path: "/financial-statements",
      name: "전체 재무제표",
      icon: "📋",
    },
    {
      path: "/xbrl-taxonomy",
      name: "XBRL 택사노미",
      icon: "📄",
    },
    {
      path: "/financial-indicators",
      name: "주요 재무지표",
      icon: "📈",
    },
    {
      path: "/multi-company",
      name: "다중회사 비교",
      icon: "📊",
    },
    {
      path: "/notifications",
      name: "알림 설정",
      icon: "🔔",
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <SidebarWrapper className={open ? 'open' : ''}>
      <SidebarBackground />
      
      <Logo>
        <LogoLink onClick={() => handleNavigation('/')}>
          🎯 DART 재무분석
        </LogoLink>
      </Logo>
      
      <SidebarList>
        {routes.map((route, key) => (
          <NavItem 
            key={key}
            active={location.pathname === route.path}
            onClick={() => handleNavigation(route.path)}
          >
            <NavLink>
              <span className="material-icons" style={{fontSize: '20px'}}>
                {route.icon}
              </span>
              <NavText>{route.name}</NavText>
            </NavLink>
          </NavItem>
        ))}
      </SidebarList>

      <UserInfo>
        <UserCard>
          <UserName>DART 시스템</UserName>
          <UserRole>재무제표 전문가</UserRole>
        </UserCard>
      </UserInfo>
    </SidebarWrapper>
  );
};

export default Sidebar;
