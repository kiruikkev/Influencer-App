// UserDashboard.js
import React from 'react';
import './UserDashboard.css';
import BrandDashboard from './BrandDashboard'; // Adjust the path as necessary
import InfluencerDashboard from './InfluencerDashboard'; // Adjust the path as necessary
import AdminDashboard from './AdminDashboard';

const UserDashboard = ({ user }) => {
  // Use the user prop to get the role
  const userRole = user?.role || 'User'; // Default to 'User' if role is not set

  // ... existing dashboard component definitions

  return (
    <div className="user-dashboard">
      {/* ... existing JSX */}

      {/* Render sections based on user role */}
      {userRole === 'Brand' && <BrandDashboard />}
      {userRole === 'Influencer' && <InfluencerDashboard />}
      {userRole === 'Admin' && <AdminDashboard />}

      {/* ... existing sections */}
    </div>
  );
};

export default UserDashboard;
