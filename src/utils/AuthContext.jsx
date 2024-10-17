import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../appwrite/appwriteconfig';
import { useNavigate } from 'react-router-dom';
import { ID, OAuthProvider } from 'appwrite';
import { UsernameContext } from '../components/UsernameContext';
import '../components/style.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { updateUsername } = useContext(UsernameContext);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    checkUserStatus();
  }, []);

  useEffect(() => {
    // Log when verificationSent changes
    console.log('Verification sent state changed:', verificationSent);
  }, [verificationSent]);

  const loginUser = async (userInfo) => {
    setLoading(true);
    try {
      await account.createEmailPasswordSession(userInfo.email, userInfo.password);
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    await account.deleteSession('current');
    setUser(null);
    setVerificationSent(false); // Reset verification status on logout
    navigate('/');
  };

  const signUp = async (userInfo) => {
    setLoading(true);
    try {
      await account.create(ID.unique(), userInfo.email, userInfo.password, userInfo.name);
      
      // Create session after signing up
      await account.createEmailPasswordSession(userInfo.email, userInfo.password);
      
      // Send verification email
      await account.createVerification('https://blog-inn.vercel.app/avatar');

      // Set verificationSent to true immediately after the email is sent
      setVerificationSent(true);
      console.log('Verification email sent');

      const accountDetails = await account.get();
      setUser(accountDetails);
      updateUsername(accountDetails.name);

      navigate('/avatar'); // Adjust the path as necessary
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleAuth = async () => {
    setLoading(true); // Set loading state while processing
    try {
      // Create OAuth2 session with the specified provider
      await account.createOAuth2Session(
        OAuthProvider.Google, // Or replace with 'google' if you encounter issues with the enum
        'https://blog-inn.vercel.app/home', // Redirect URL after successful login
        'https://blog-inn.vercel.app' // URL for handling errors or cancellations
      );
  
      // Fetch user details after successful login
      const accountDetails = await account.get();
      setUser(accountDetails);
      updateUsername(accountDetails.name);
      navigate('/avatar'); // Redirect to avatar page after login
    } catch (error) {
      console.error('OAuth error:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  const checkUserStatus = async () => {
    setLoading(true); // Set loading before checking user status
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.error('No account found');
      setUser(null); // Set user to null if no account found
    } finally {
      setLoading(false);
    }
  };

  const contextData = {
    user,
    loginUser,
    logoutUser,
    signUp,
    checkUserStatus,
    handleAuth,
    verificationSent, // Expose verificationSent
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? (
        <div className="flex h-screen justify-center items-center bg-black">
          <span className="loader"></span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;