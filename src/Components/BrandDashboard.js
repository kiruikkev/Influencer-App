import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Services/AuthService'; // Adjust the import path

const BrandDashboard = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated when the component mounts
    const checkAuthentication = async () => {
      const user = AuthService.getCurrentUser();
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        // Redirect to the sign-in page or another appropriate route
        navigate('/sign-in');
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleSignOut = () => {
    AuthService.signOut()
      .then(() => {
        // User is signed out, you can also update the state here
        setAuthenticated(false);
        navigate('/sign-in'); // Redirect to the sign-in page
      })
      .catch((error) => {
        // Handle sign-out error
      });
  };

  return (
    <div className="brand-dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to the Brand Dashboard</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-main">
          {/* Conditionally render components based on authentication */}
          {authenticated && (
            <>
              <div className="dashboard-section" onClick={() => handleNavigate('/campaign-management')}>
                Campaign Management
              </div>
              {/* Add other authenticated sections here */}
            </>
          )}
        </div>
        <div className="dashboard-sidebar">
          {/* Conditionally render authenticated sections here */}
          {authenticated && (
            <>
              <div className="dashboard-section profile-settings-section" onClick={() => handleNavigate('/profile-settings')}>
                Profile Settings
              </div>
              {/* Add other authenticated sections here */}
            </>
          )}
        </div>
      </div>
      <div className="dashboard-footer" onClick={() => handleNavigate('/help-support')}>
        Help & Support
      </div>
      {authenticated && (
        <div className="sign-out-button">
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
};

export default BrandDashboard;
