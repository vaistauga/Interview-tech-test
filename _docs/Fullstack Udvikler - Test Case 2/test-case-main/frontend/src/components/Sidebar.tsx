import { Dropdown } from 'primereact/dropdown';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAccountContext } from '../contexts/AccountContext';

const SidebarContainer = styled.aside`
  width: 250px;
  background: #2f1f2e;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid #4a3449;
`;

const Logo = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ecf0f1;
`;

const LogoSubtext = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  color: #95a5a6;
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 1rem 0;
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0;
`;

type NavLinkProps = {
  $active?: boolean;
  $disabled?: boolean;
};

const NavLink = styled(Link)<NavLinkProps>`
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  margin-right: 1rem;
  margin-left: 1rem;
  color: ${(props) =>
    props.$active ? '#fff' : props.$disabled ? '#8a7889' : '#fff'};
  text-decoration: none;
  transition: all 0.3s ease;
  background-color: transparent;
  border: ${(props) =>
    props.$active ? '1px solid #594c58' : '1px solid transparent'};
  border-radius: ${(props) => (props.$active ? '25px' : '0px')};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${(props) => (props.$disabled ? 'none' : 'auto')};

  &:hover {
    color: ${(props) => (props.$disabled ? '#8a7889' : '#fff')};
  }

  i {
    margin-right: 0.75rem;
    font-size: 1.1rem;
    width: 20px;
    text-align: center;
  }
`;

const NavText = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
`;

const SidebarFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #4a3449;
  margin-top: auto;
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #95a5a6;
  text-align: center;
`;

const AccountSelector = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #4a3449;
`;

const AccountLabel = styled.label`
  display: block;
  color: #95a5a6;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { accounts, selectedAccount, setSelectedAccount, loading } =
    useAccountContext();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'pi pi-home',
      path: '/dashboard',
      disabled: true,
    },
    {
      id: 'awareness',
      label: 'Awareness',
      icon: 'pi pi-file',
      path: '/awareness',
      disabled: true,
    },
    {
      id: 'phishing',
      label: 'Phishing',
      icon: 'pi pi-eye',
      path: '/phishing',
      disabled: true,
    },
    {
      id: 'security-culture',
      label: 'Security Culture',
      icon: 'pi pi-shield',
      path: '/security-culture',
      disabled: true,
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'pi pi-users',
      path: '/users',
      disabled: false,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'pi pi-cog',
      path: '/settings',
      disabled: true,
    },
  ];

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Logo>CyberPilot</Logo>
        <LogoSubtext>Technical Test</LogoSubtext>
      </SidebarHeader>

      <AccountSelector>
        <AccountLabel>Select Account</AccountLabel>
        <Dropdown
          value={selectedAccount}
          options={accounts}
          onChange={(e) => setSelectedAccount(e.target.value)}
          optionLabel="name"
          placeholder="Select an account"
          disabled={loading}
          className="w-full"
          style={{
            background: '#3a2a39',
            border: '1px solid #4a3449',
            color: 'white',
          }}
        />
      </AccountSelector>

      <Navigation>
        <NavList>
          {navigationItems.map((item) => (
            <NavItem key={item.id}>
              <NavLink
                to={item.disabled ? '#' : item.path}
                $active={location.pathname === item.path}
                $disabled={item.disabled}
              >
                <i className={item.icon}></i>
                <NavText>{item.label}</NavText>
              </NavLink>
            </NavItem>
          ))}
        </NavList>
      </Navigation>

      <SidebarFooter>
        <FooterText>© 2025 CyberPilot</FooterText>
      </SidebarFooter>
    </SidebarContainer>
  );
};
