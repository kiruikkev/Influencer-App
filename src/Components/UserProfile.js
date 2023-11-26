import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const UserProfile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userRef = doc(firestore, 'users', userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Add logic to display user's KPIs and other information
  return (
    <div>
      <h1>User Profile</h1>
      {userProfile && (
        <div>
          <p>Name: {userProfile.name}</p>
          {/* Display other user information and KPIs here */}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
