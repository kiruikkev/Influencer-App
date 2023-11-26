import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Services/AuthService';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firestore = getFirestore();

const AuthenticationPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegistrationInputChange = (e) => {
    setRegistrationForm({ ...registrationForm, [e.target.name]: e.target.value });
  };

  const getUserRole = async (userId) => {
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    return userDoc.exists() ? userDoc.data().role : null;
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await AuthService.signInWithEmailAndPassword(
        loginForm.email,
        loginForm.password
      );
      const role = await getUserRole(userCredential.user.uid);
      if (role) {
        setUser({ ...userCredential.user, role });
        setAuthenticated(true);
        navigateBasedOnRole(role);
      } else {
        setError('User role not found.');
      }
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  const handleRegistration = async () => {
    try {
      if (!registrationForm.email || !registrationForm.password) {
        throw new Error('All registration fields (email and password) are required.');
      }

      // Set a default role for newly registered users (e.g., 'user')
      const defaultRole = 'user';

      const userCredential = await AuthService.registerWithEmailAndPassword(
        registrationForm.email,
        registrationForm.password,
        defaultRole // Set the default role here
      );

      if (!userCredential || !userCredential.user || !userCredential.user.uid) {
        throw new Error('User registration failed: Invalid user data.');
      }

      // Save additional user data to Firestore
      const userData = {
        name: registrationForm.name, // Add name field to the registration form
        email: registrationForm.email, // Use the provided email
      };

      // Save user data to Firestore
      const userDocRef = doc(firestore, 'users', userCredential.user.uid);
      await setDoc(userDocRef, userData);

      // No need to set the role again, as it's set during registration
      setUser(userCredential.user);
      setAuthenticated(true);
      navigateBasedOnRole(defaultRole); // Use the default role for navigation
    } catch (error) {
      setError(`Error registering the user: ${error.message}`);
    }
  };

  const handleSignOut = () => {
    AuthService.signOut();
    setUser(null);
    setAuthenticated(false);
  };

  const handleGoogleSignIn = () => {
    AuthService.signInWithGoogle()
      .then(async (userCredential) => {
        setUser(userCredential.user);
        setAuthenticated(true);
        navigate('/dashboard'); // Redirect to the dashboard
      })
      .catch((error) => {
        setError('Error signing in with Google');
      });
  };

  const navigateBasedOnRole = (role) => {
    switch (role) {
      case 'admin':
        navigate('/dashboard/admin');
        break;
      case 'user':
        navigate('/dashboard/user');
        break;
      case 'brand':
        navigate('/dashboard/brand');
        break;
      case 'manager':
        navigate('/dashboard/campaign');
        break;
      default:
        navigate('/'); // Redirect to home or a default route
    }
  };

  return (
    <div className="auth-container">
      {authenticated ? (
        <div>
          <h1>Welcome, {user ? user.displayName || user.email : ''}!</h1>
          <p>Role: {user ? user.role || 'N/A' : 'N/A'}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div className="auth-content">
          <div className="header">
            <h2>Brand Campaign</h2>
          </div>
          <h1>Campaign management and brand marketing through your community</h1>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={handleInputChange}
          />
          <button onClick={handleSignIn}>Sign in</button>
          <button onClick={handleGoogleSignIn}>Sign in with Google</button>
          <div className="divider">or</div>
          {!showRegistrationForm ? (
            <div>
              <button onClick={() => setShowRegistrationForm(true)}>New User?</button>
            </div>
          ) : (
            <div className="registration-form">
              <h2>Create an Account</h2>
              <input
                type="text"
                name="name"
                placeholder="Name" // Add a name field to the registration form
                value={registrationForm.name}
                onChange={handleRegistrationInputChange}
              />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={registrationForm.email}
                onChange={handleRegistrationInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registrationForm.password}
                onChange={handleRegistrationInputChange}
              />
              <button onClick={handleRegistration}>Register</button>
              <button onClick={() => setShowRegistrationForm(false)}>Cancel</button>
            </div>
          )}
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default AuthenticationPage;
