import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const InfluencerSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchText.length > 2) {
        handleSearch(searchText);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const handleSearch = async (text) => {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('name', '>=', text), where('name', '<=', text + '\uf8ff'));

    try {
      const querySnapshot = await getDocs(q);
      const matchedUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSuggestions(matchedUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      setSuggestions([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchText);
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="influencer-search">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search Influencer"
          value={searchText}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((user) => (
            <li key={user.id} onClick={() => handleProfileClick(user.id)}>
              {user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InfluencerSearch;
