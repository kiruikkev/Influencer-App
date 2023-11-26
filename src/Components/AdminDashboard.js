import React, { useState, useEffect } from 'react';
import {
  addDocument,
  fetchAllUsers,
  fetchAllCampaigns,
  fetchAnalyticsData,
  generateRandomPassword,
  updateDocument,
  deleteDocument,
} from '../Services/FirestoreService';
import UserDetailComponent from './UserDetailComponent';
import CampaignDetailComponent from './CampaignDetailComponent';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showUserForm, setShowUserForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
  });

  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [newCampaignData, setNewCampaignData] = useState({
    title: '',
    description: '',
  });

  const [showUsersList, setShowUsersList] = useState(true);
  const [showCampaignsList, setShowCampaignsList] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    Promise.all([fetchAllUsers(), fetchAllCampaigns(), fetchAnalyticsData()])
      .then(([usersData, campaignsData, analyticsData]) => {
        setUsers(usersData);
        setCampaigns(campaignsData);
        setAnalytics(analyticsData);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    setNewUserData({ ...newUserData, password: newPassword });
  };

  const handleUserFormSubmit = async (event) => {
    event.preventDefault();
    const userId = await addDocument('users', newUserData);
    if (userId) {
      setUsers([...users, { ...newUserData, id: userId }]);
      setShowUserForm(false);
      setNewUserData({
        name: '',
        email: '',
        role: '',
        password: '',
      });
    }
  };

  const handleCampaignFormSubmit = async (event) => {
    event.preventDefault();
    const campaignId = await addDocument('campaigns', newCampaignData);
    if (campaignId) {
      setCampaigns([...campaigns, { ...newCampaignData, id: campaignId }]);
      setShowCampaignForm(false);
      setNewCampaignData({
        title: '',
        description: '',
      });
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedCampaign(null);
  };

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    setSelectedUser(null);
  };

  const handleUserUpdate = async (updatedUser) => {
    const success = await updateDocument('users', updatedUser.id, updatedUser);
    if (success) {
      const updatedUsers = users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsers(updatedUsers);
    }
  };

  const handleCampaignUpdate = async (updatedCampaign) => {
    const success = await updateDocument(
      'campaigns',
      updatedCampaign.id,
      updatedCampaign
    );
    if (success) {
      const updatedCampaigns = campaigns.map((campaign) =>
        campaign.id === updatedCampaign.id ? updatedCampaign : campaign
      );
      setCampaigns(updatedCampaigns);
    }
  };

  const handleUserDelete = async (userId) => {
    const success = await deleteDocument('users', userId);
    if (success) {
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
    }
  };

  const handleCampaignDelete = async (campaignId) => {
    const success = await deleteDocument('campaigns', campaignId);
    if (success) {
      const updatedCampaigns = campaigns.filter(
        (campaign) => campaign.id !== campaignId
      );
      setCampaigns(updatedCampaigns);
    }
  };

  const handleCancelUser = () => {
    setSelectedUser(null);
  };

  const handleCancelCampaign = () => {
    setSelectedCampaign(null);
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div>
        <button onClick={() => setShowUserForm(!showUserForm)}>
          {showUserForm ? 'Hide New User Form' : 'New User'}
        </button>
        <button onClick={() => setShowCampaignForm(!showCampaignForm)}>
          {showCampaignForm ? 'Hide New Campaign Form' : 'New Campaign'}
        </button>
        <button onClick={() => setShowUsersList(!showUsersList)}>
          {showUsersList ? 'Hide Users' : 'Show Users'}
        </button>
        <button onClick={() => setShowCampaignsList(!showCampaignsList)}>
          {showCampaignsList ? 'Hide Campaigns' : 'Show Campaigns'}
        </button>
      </div>

      {showUserForm && (
        <form onSubmit={handleUserFormSubmit}>
          <h3>Create New User</h3>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newUserData.name}
            onChange={(e) =>
              setNewUserData({ ...newUserData, name: e.target.value })
            }
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUserData.email}
            onChange={(e) =>
              setNewUserData({ ...newUserData, email: e.target.value })
            }
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={newUserData.role}
            onChange={(e) =>
              setNewUserData({ ...newUserData, role: e.target.value })
            }
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUserData.password}
            onChange={(e) =>
              setNewUserData({ ...newUserData, password: e.target.value })
            }
            required
          />
          <button type="button" onClick={handleGeneratePassword}>
            Generate Password
          </button>
          <button type="submit">Create User</button>
        </form>
      )}

      {showCampaignForm && (
        <form onSubmit={handleCampaignFormSubmit}>
          <h3>Create New Campaign</h3>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newCampaignData.title}
            onChange={(e) =>
              setNewCampaignData({ ...newCampaignData, title: e.target.value })
            }
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newCampaignData.description}
            onChange={(e) =>
              setNewCampaignData({
                ...newCampaignData,
                description: e.target.value,
              })
            }
            required
          />
          <button type="submit">Create Campaign</button>
        </form>
      )}

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {showUsersList && (
        <div>
          <h3>Users</h3>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <button onClick={() => handleUserSelect(user)}>
                  {user.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showCampaignsList && (
        <div>
          <h3>Campaigns</h3>
          <ul>
            {campaigns.map((campaign) => (
              <li key={campaign.id}>
                <button onClick={() => handleCampaignSelect(campaign)}>
                  {campaign.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedUser && (
        <UserDetailComponent
          user={selectedUser}
          onSave={handleUserUpdate}
          onDelete={() => handleUserDelete(selectedUser.id)}
          onCancel={handleCancelUser}
        />
      )}

      {selectedCampaign && (
        <CampaignDetailComponent
          campaign={selectedCampaign}
          onSave={handleCampaignUpdate}
          onDelete={() => handleCampaignDelete(selectedCampaign.id)}
          onCancel={handleCancelCampaign}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
