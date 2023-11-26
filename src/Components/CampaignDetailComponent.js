import React, { useState } from 'react';
import { updateDocument, deleteDocument } from '../Services/FirestoreService';

const CampaignDetailComponent = ({ campaign, onSave, onCancel, onDelete }) => {
  const [editCampaign, setEditCampaign] = useState(campaign);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditCampaign({ ...editCampaign, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await updateDocument('campaigns', editCampaign.id, editCampaign);
    if (success) {
      onSave();
      setIsEditing(false);
    } else {
      console.error('Failed to update campaign.');
    }
  };

  const handleDelete = async () => {
    const success = await deleteDocument('campaigns', editCampaign.id);
    if (success) {
      onDelete();
    } else {
      console.error('Failed to delete campaign.');
    }
  };

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" value={editCampaign.title} onChange={handleInputChange} />
          <textarea name="description" value={editCampaign.description} onChange={handleInputChange} />
          <button type="submit">Save</button>
          <button onClick={() => onCancel()}>Cancel</button>
          <button onClick={handleDelete}>Delete</button>
        </form>
      ) : (
        <div>
          <p>Title: {campaign.title}</p>
          <p>Description: {campaign.description}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default CampaignDetailComponent;
