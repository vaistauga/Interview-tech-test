import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '.';
import { Users } from '../pages/Users';

const App: React.FC = () => {
  return (
    <Layout
      title="User Management System"
      subtitle="Manage and organize user data efficiently"
    >
      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Navigate to="/users" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
