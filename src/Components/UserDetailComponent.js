import React, { useState } from 'react';
import { updateDocument, deleteDocument } from '../Services/FirestoreService';

const UserDetailComponent = ({ user, onSave, onCancel, onDelete }) => {
  const [editUser, setEditUser] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await updateDocument('users', editUser.id, editUser);
    if (success) {
      onSave();
      setIsEditing(false);
    } else {
      console.error('Failed to update user.');
    }
  };

  const handleCancel = () => {
    onCancel();
    setEditUser(user); // Revert to original user data
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const success = await deleteDocument('users', editUser.id);
    if (success) {
      onDelete();
    } else {
      console.error('Failed to delete user.');
    }
  };

  const handleGeneratePassword = () => {
    // Generate a random password (this is a placeholder, replace with your method)
    const newPassword = Math.random().toString(36).slice(-8);
    setEditUser({ ...editUser, password: newPassword });
  };

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={editUser.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            value={editUser.email}
            onChange={handleInputChange}
          />
          <button type="button" onClick={handleGeneratePassword}>
            Generate Password
          </button>
          {showPassword ? (
            <div>
              <p>Password: {editUser.password}</p>
              <button onClick={() => setShowPassword(false)}>Hide Password</button>
            </div>
          ) : (
            <button onClick={() => setShowPassword(true)}>View Password</button>
          )}
          <button type="submit">Save</button>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleDelete}>Delete</button>
        </form>
      ) : (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default UserDetailComponent;
