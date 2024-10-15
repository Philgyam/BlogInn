import React, { createContext, useState, useEffect } from 'react';
import { account } from '../appwrite/appwriteconfig';

export const UsernameContext = createContext();

export const UsernameProvider = ({ children }) => {
  const [username, setUserName] = useState('');
  const [avatar, setAvatar] = useState('https://cloud.appwrite.io/v1/storage/buckets/66292c86c05c5fc84f6b/files/670e8e96002ba2467cee/view?project=66201769ed5710073074&project=66201769ed5710073074&mode=admin');

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await account.get();
        const name = user.name;
        setUserName(name);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
  }, []); // Empty dependency array means this effect runs only once after the initial mount

  const updateAvatar = (newAvatar) => {
    setAvatar(newAvatar);
  };

  return (
    <UsernameContext.Provider value={{ username, updateAvatar, avatar, setAvatar }}>
      {children}
    </UsernameContext.Provider>
  );
};

export default UsernameContext;
