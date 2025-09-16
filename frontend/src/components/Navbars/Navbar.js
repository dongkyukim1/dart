import React from "react";
import styled from "styled-components";

const NavbarWrapper = styled.nav`
  background-color: transparent;
  color: #555555;
  border: 0;
  border-radius: 3px;
  position: relative;
  padding: 0.3rem 0;
  z-index: 3;
  min-height: 40px;
  margin-bottom: 10px;
`;

const Container = styled.div`
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  width: 100%;
`;

const NavbarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
`;

const NavbarBrand = styled.div`
  font-size: 18px;
  line-height: 30px;
  color: #3c4858;
  font-weight: 300;
  margin-left: 10px;
`;

const NavbarNav = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  padding-left: 0;
  margin-bottom: 0;
  list-style: none;
`;

const NavItem = styled.div`
  position: relative;
  margin-right: 20px;
  
  &:last-child {
    margin-right: 0;
  }
`;

const NavLink = styled.div`
  color: #555555;
  padding: 0.5rem;
  font-weight: 400;
  font-size: 12px;
  text-transform: uppercase;
  border-radius: 3px;
  line-height: 20px;
  text-decoration: none;
  margin: 0px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    color: #3c4858;
    background: rgba(200, 200, 200, 0.2);
  }
  
  & .material-icons {
    width: 20px;
    height: 20px;
    font-size: 20px;
    margin-right: 3px;
  }
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  color: #555555;
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 15px;
  
  &:hover {
    color: #3c4858;
  }
  
  @media (min-width: 992px) {
    display: none;
  }
`;

const SearchForm = styled.form`
  margin: 0 20px;
  position: relative;
  
  @media (max-width: 991px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  border: 0;
  border-radius: 30px;
  color: #555555;
  padding: 4px 15px;
  background-color: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  width: 200px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  }
  
  &::placeholder {
    color: #aaaaaa;
  }
`;

const Navbar = ({ onMenuClick, brandText = "Dashboard" }) => {
  return (
    <NavbarWrapper>
      <Container>
        <NavbarHeader>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MenuButton onClick={onMenuClick}>
              <span style={{ fontSize: '24px' }}>☰</span>
            </MenuButton>
            <NavbarBrand>{brandText}</NavbarBrand>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SearchForm>
              <SearchInput 
                type="text" 
                placeholder="Search..." 
              />
            </SearchForm>
            
            <NavbarNav>
              <NavItem>
                <NavLink>
                  <span className="material-icons">🔍</span>
                  Search
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <span className="material-icons">🔔</span>
                  Notifications
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  <span className="material-icons">👤</span>
                  Account
                </NavLink>
              </NavItem>
            </NavbarNav>
          </div>
        </NavbarHeader>
      </Container>
    </NavbarWrapper>
  );
};

export default Navbar;
