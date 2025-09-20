import React from 'react';
import styled from 'styled-components';
import { Sidebar } from './';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #e94f37 0%, #d63384 100%);
  padding: 1.5rem 2rem;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

const HeaderTitle = styled.h1`
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 300;
`;

const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <Header>
          <HeaderTitle>{title}</HeaderTitle>
          {subtitle && <HeaderSubtitle>{subtitle}</HeaderSubtitle>}
        </Header>
        <ContentArea>{children}</ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};
