import { Outlet, Navigate, useNavigate } from 'react-router';
import UserAvatar from '../components/UserAvatar';
import { useHealthCheck } from '../hooks';
import './MainLayout.css';

const MainLayout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Health check - pings server every 5 seconds
  useHealthCheck(true);

  // If user is not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-logo">📋 Kanban Board</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <UserAvatar username={user.username} size="medium" />
              <div className="user-details">
                <span className="user-name">{user.username || 'User'}</span>
                {user.role && (
                  <span className={`user-role ${user.role}`}>
                    {user.role}
                  </span>
                )}
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
