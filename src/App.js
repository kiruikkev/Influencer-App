import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthenticationPage from './Components/AuthenticationPage';
import BrandDashboard from './Components/BrandDashboard';
import InfluencerDashboard from './Components/InfluencerDashboard';
import CampaignManagement from './Components/Campaignmanagement';
import AnalyticsDashboard from './Components/AnalyticsDashboard';
import UserDashboard from './Components/UserDashboard';
import UserProfile from './Components/UserProfile';
import ProfileSettings from './Components/ProfileSettings';
import PaymentInvoicing from './Components/PaymentInvoicing';
import ContentApproval from './Components/ContentApproval';
import HelpSupport from './Components/HelpSupport';
import 'firebase/compat/auth'; // compat version import
import { app, getAuth } from "./firebase";
import { Link } from 'react-router-dom';
import AdminDashboard from './Components/AdminDashboard';

const DevNav = () => (
  <div style={{ marginBottom: "20px" }}>
    <Link to="/signin" style={{ marginRight: "10px" }}>Sign In</Link>
    <Link to="/dashboard/brand" style={{ marginRight: "10px" }}>Brand Dashboard</Link>
    <Link to="/dashboard/influencer" style={{ marginRight: "10px" }}>Influencer Dashboard</Link>
    <Link to="/dashboard/analytics" style={{ marginRight: "10px" }}>Analytics Dashboard</Link>
    <Link to="/dashboard/admin" style={{ marginRight: "10px" }}>Admin Dashboard</Link>
    {/* ...add other routes as needed */}
  </div>
);

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authInstance = getAuth(app);
    const unsubscribe = authInstance.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <DevNav />
      <Routes>
        <Route path="/signin" element={<AuthenticationPage />} />
        <Route path="/dashboard/*" element={<DashboardRoutes user={user} />} />
        <Route path="*" element={<AuthenticationPage />} />
      </Routes>
    </Router>
  );
};

const DashboardRoutes = ({ user }) => (
  <Routes>
    <Route path="brand" element={user ? <BrandDashboard /> : <AuthenticationPage />} />
    <Route path="influencer" element={user ? <InfluencerDashboard /> : <AuthenticationPage />} />
    <Route path="campaign" element={user ? <CampaignManagement /> : <AuthenticationPage />} />
    <Route path="analytics" element={user ? <AnalyticsDashboard /> : <AuthenticationPage />} />
    <Route path="user" element={user ? <UserDashboard /> : <AuthenticationPage />} />
    <Route path="admin" element={user ? <AdminDashboard /> : <AuthenticationPage />} />
    <Route path="profile/:userId" element={user ? <UserProfile /> : <AuthenticationPage />} />
    <Route path="profile-settings" element={user ? <ProfileSettings /> : <AuthenticationPage />} />
    <Route path="payment-invoicing" element={user ? <PaymentInvoicing /> : <AuthenticationPage />} />
    <Route path="content-approval" element={user ? <ContentApproval /> : <AuthenticationPage />} />
    <Route path="help-support" element={user ? <HelpSupport /> : <AuthenticationPage />} />
  </Routes>
);

export default App;
