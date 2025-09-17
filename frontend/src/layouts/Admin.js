import React from 'react';
import styled from 'styled-components';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import CompanySearch from '../components/CompanySearch';
import FinancialAnalysis from '../components/FinancialAnalysis';
import Header from '../components/Header';

const AdminContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0;
  width: 100%;
`;

const Admin = () => {
  return (
    <AdminContainer>
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<CompanySearch />} />
          <Route path="/analysis/:corpCode" element={<FinancialAnalysis />} />
        </Routes>
      </MainContent>
    </AdminContainer>
  );
};

export default Admin;