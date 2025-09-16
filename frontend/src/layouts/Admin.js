import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import styled from "styled-components";

// Core components
import Navbar from "../components/Navbars/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

// Views
import Dashboard from "../views/Dashboard/Dashboard";
import CompanySearch from "../components/CompanySearch";
import FinancialAnalysis from "../components/FinancialAnalysis";

const Wrapper = styled.div`
  position: relative;
  top: 0;
  height: 100vh;
`;

const MainPanel = styled.div`
  position: relative;
  float: right;
  max-height: 100%;
  width: calc(100% - 260px);
  overflow: auto;
  background-color: #eeeeee;
  min-height: 100vh;
  transition: all 150ms ease;

  @media (max-width: 991px) {
    width: 100%;
  }
`;

const Content = styled.div`
  margin-top: 20px;
  padding: 10px 15px;
  min-height: calc(100vh - 60px);
`;

const getRoutes = () => [
  {
    path: "/",
    component: Dashboard,
    name: "Dashboard"
  },
  {
    path: "/search", 
    component: CompanySearch,
    name: "기업 검색"
  },
  {
    path: "/analysis/:corpCode",
    component: FinancialAnalysis, 
    name: "재무분석"
  },
  {
    path: "/financial-analysis",
    component: FinancialAnalysis, 
    name: "재무분석"
  },
  {
    path: "/bulk-ownership",
    name: "대량보유 상황보고"
  },
  {
    path: "/executive-ownership",
    name: "임원·주주 소유보고"
  },
  {
    path: "/financial-statements",
    name: "전체 재무제표"
  },
  {
    path: "/xbrl-taxonomy",
    name: "XBRL 택사노미"
  },
  {
    path: "/financial-indicators",
    name: "주요 재무지표"
  },
  {
    path: "/multi-company",
    name: "다중회사 비교"
  }
];

const getBrandText = (pathname) => {
  const routes = getRoutes();
  for (let route of routes) {
    if (pathname === route.path) {
      return route.name;
    }
    // Handle dynamic routes
    if (route.path.includes(':') && pathname.includes('/analysis/')) {
      return route.name;
    }
  }
  return "Dashboard";
};

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Wrapper>
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
      <MainPanel>
        <Navbar 
          onMenuClick={handleMenuClick}
          brandText={getBrandText(location.pathname)}
        />
        <Content>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<CompanySearch />} />
            <Route path="/analysis/:corpCode" element={<FinancialAnalysis />} />
            <Route path="/financial-analysis" element={<FinancialAnalysis />} />
            <Route path="/user" element={<div>User Profile Page</div>} />
            <Route path="/table" element={<div>Table List Page</div>} />
            <Route path="/typography" element={<div>Typography Page</div>} />
            <Route path="/icons" element={<div>Icons Page</div>} />
            <Route path="/maps" element={<div>Maps Page</div>} />
            <Route path="/notifications" element={<div>Notifications Page</div>} />
            <Route path="/rtl-page" element={<div>RTL Support Page</div>} />
          </Routes>
        </Content>
      </MainPanel>
    </Wrapper>
  );
};

export default Admin;
