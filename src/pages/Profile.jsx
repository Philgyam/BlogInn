import React, { useContext, useState } from 'react';
import { ThemeContext } from '../components/ThemeProvider';
import { HiSearch } from 'react-icons/hi';
import Sidebar from '../components/Sidebar';
import Sidebarbig from '../components/Sidebarbig';
import AllUserPosts from './AllUserPosts';
import UserBio from './UserBio';
import Archives from './Archives';
import { MdOutlineExplore } from "react-icons/md";

function Profile() {
  const { theme } = useContext(ThemeContext);

  const buttonLabels = ['Your Posts', 'User Bio', 'Archive'];
  const [active, setActive] = useState('Your Posts'); // Set default active button to 'Your Posts'

  const clicked = (label) => {
    setActive(label);
  };

  return (
    <div className={`flex flex-col h-screen ${theme.backgroundColor}`}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-inherit shadow-md">
        <h1 className='text-2xl text-orange-500 mb-2 ml-1 font-mono text-center mt-1'>BlogInn</h1>
        <div className='flex gap-8 items-center justify-center p-4'>
          <div className='flex gap-8 items-center'>
            <div className='lg:hidden'>
              <Sidebar />
            </div>
            <form action="" className='relative flex items-center'>
              <input
                type="text"
                className='h-10 w-[15rem] pl-4 pr-10 font-mono bg-black bg-opacity-50 rounded-full shadow-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                required
                placeholder='Search...'
              />
              <button className="absolute right-3 top-2">
                <HiSearch className="text-white" />
              </button>
            </form>
          </div>
        </div>
        <div className='flex lg:ml-[9.2rem] pl-3 pb-2'>
          <div className='flex gap-4'>
            {buttonLabels.map((label) => (
              <button
                key={label}
                onClick={() => clicked(label)}
                className={`px-3 py-2 rounded transition-all duration-200 
                  ${active === label ? 'bg-orange-500 text-white' : theme.backgroundColor === 'bg-black' ? 'text-white' : 'text-black'}`}
              >
                {label}
              </button>
            ))}
            <MdOutlineExplore
              style={{
                height: '2rem',
                width: '2rem',
                color: theme.backgroundColor === 'bg-black' ? 'white' : 'black',
                marginLeft: '2rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden bg-black">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-[10rem]">
          <div className="flex-shrink-0 w-[10rem]">
            <Sidebarbig />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow overflow-y-auto  ">
          {active === 'Your Posts' && <AllUserPosts />}
          {active === 'User Bio' && <UserBio />}
          {active === 'Archive' && <Archives />}
        </div>
      </div>
    </div>
  );
}

export default Profile;
