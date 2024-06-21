import React, { useState, useContext, useEffect } from 'react';
import { UsernameContext } from '../components/UsernameContext';
import { ThemeContext } from '../components/ThemeProvider';
import Sidebar from '../components/Sidebar';
import AllUserPosts from './AllUserPosts';
import { MdOutlineExplore } from "react-icons/md";
import UserBio from './UserBio';
import Archives from './Archives'
import { bucket, BUCKET_ID, account, DATABASE_ID, COLLECTION_ID, COLLECTION_PROFILE_ID, databases } from '../appwrite/appwriteconfig';

function Profile() {
  const { username, updateAvatar, avatar, setAvatar, setUserName } = useContext(UsernameContext);
  const { theme, updateTheme } = useContext(ThemeContext);

  const buttonLabels = ['Your Posts', 'User Bio', 'Archive'];

  const [active, setActive] = useState('');

  const clicked = (label) => {
    setActive(label);
  };

  useEffect(() => {
    setActive('Your Posts');
  }, []);

  const user = async () => {
    try {
      const userDetails = await account.get();
    } catch (error) {
      console.log('Failed to get user details');
    }
  };

  useEffect(() => {
    user();
  }, []);

  return (
    <div className={`h-full w-full ${theme.backgroundColor}`}>
      <div className='flex gap-4 justify-around pt-6'>
        <div className='z-1000'>
          <Sidebar />
        </div>
        <div>
          <span className={`${theme.backgroundColor === 'bg-black' ? 'text-white' : 'text-black'} text-2xl`}>
            Hello
          </span>
          <span className='text-orange-500 font-bold text-3xl ml-3'>{username} </span>
        </div>
        <div>
          <img className='rounded-full w-10 h-10' src={avatar} alt="" />
        </div>
      </div>

      <div className='flex mt-10'>
        <MdOutlineExplore
          style={{
            height: '2rem',
            width: '2rem',
            color: theme.backgroundColor === 'bg-black' ? 'white' : 'black',
            marginLeft: '2rem'
          }}
        />

        <div className='flex gap-8 w-full justify-center mb-8'>
          {buttonLabels.map((label) => (
            <button
              key={label}
              onClick={() => clicked(label)}
              className={`px-1 py-1 rounded transition-all duration-200 
                ${active === label ? 'bg-orange-500 text-white' : theme.backgroundColor === 'bg-black' ? 'text-white' : 'text-black'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className='h-screen'>
        {active === 'Your Posts' && <AllUserPosts />}
        {active === 'User Bio' && <UserBio/> }
        {active === 'Archive' && <Archives/> }
      </div>
    </div>
  );
}

export default Profile;
