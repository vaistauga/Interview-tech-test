import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components';
import { Users } from './pages/Users';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/users"
        element={
          <Layout title="Users" subtitle="Manage your users">
            <Users />
          </Layout>
        }
      />
      <Route
        path="/"
        element={
          <Layout title="Dashboard" subtitle="Welcome to CyberPilot">
            <div>Dashboard content goes here</div>
          </Layout>
        }
      />
    </Routes>
  );
};
