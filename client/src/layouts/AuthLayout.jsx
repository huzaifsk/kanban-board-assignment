import { Outlet, Navigate } from 'react-router';
import './AuthLayout.css';

const AuthLayout = () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-logo">📋 Kanban Board</h1>
          <p className="auth-subtitle">Organize your tasks efficiently</p>
        </div>
        <div className="auth-content">
          <Outlet />
        </div>
        <div className="auth-footer">
          <p>&copy; 2025 Kanban Board. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
