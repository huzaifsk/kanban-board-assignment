import React from 'react';
import './UserAvatar.css';

const UserAvatar = ({ username, size = 'medium' }) => {
  // Function to generate consistent color from username
  const getColorFromUsername = (name) => {
    if (!name) return { bg: '#667eea', text: '#ffffff' };
    
    const colors = [
      { bg: '#667eea', text: '#ffffff' }, // Purple
      { bg: '#f093fb', text: '#ffffff' }, // Pink
      { bg: '#4facfe', text: '#ffffff' }, // Blue
      { bg: '#43e97b', text: '#ffffff' }, // Green
      { bg: '#fa709a', text: '#ffffff' }, // Rose
      { bg: '#feca57', text: '#2c3e50' }, // Yellow
      { bg: '#ff6b6b', text: '#ffffff' }, // Red
      { bg: '#48dbfb', text: '#ffffff' }, // Cyan
      { bg: '#ee5a6f', text: '#ffffff' }, // Coral
      { bg: '#c44569', text: '#ffffff' }, // Maroon
      { bg: '#786fa6', text: '#ffffff' }, // Lavender
      { bg: '#f8b500', text: '#2c3e50' }, // Orange
      { bg: '#3c6382', text: '#ffffff' }, // Dark Blue
      { bg: '#0a3d62', text: '#ffffff' }, // Navy
      { bg: '#079992', text: '#ffffff' }, // Teal
    ];

    // Generate consistent hash from username
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Get first letter of username (uppercase)
  const getInitial = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const colors = getColorFromUsername(username);
  const initial = getInitial(username);

  const sizeClass = `user-avatar-${size}`;

  return (
    <div 
      className={`user-avatar-circle ${sizeClass}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text
      }}
      title={username}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
