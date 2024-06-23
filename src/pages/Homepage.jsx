import React, { useContext, useState } from 'react';
import { ThemeContext } from '../components/ThemeProvider';
import { HiSearch } from 'react-icons/hi';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import AllPosts from './AllPosts';
import Sidebarbig from '../components/Sidebarbig';

function Homepage() {
  const { theme } = useContext(ThemeContext);

  const buttonLabels = ['For You', 'Recent', 'Trending'];
  const [active, setActive] = useState('For You');

  const clicked = (label) => {
    setActive(label);
  };

  return (
    <div className={`flex flex-col h-screen ${theme.backgroundColor}`}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-inherit">
        <h1 className='text-2xl text-orange-500 mb-2 ml-1 font-mono text-center mt-1'>BlogInn</h1>
        <div className='flex gap-8'>
          <div className='flex gap-[2rem]'>
            <div className='z-[1000] lg:hidden'>
              <Sidebar />
            </div>
            <form action="" className='relative flex'>
              <input
                type="text"
                className='h-10 w-[15rem] pl-1 font-mono bg-black bg-opacity-50 rounded-full shadow-md text-white flex-1'
                required
                placeholder='search....'
              />
              <button className="absolute right-5 top-3">
                <HiSearch className="text-white" />
              </button>
            </form>
          </div>
        </div>
        <div className='pl-3 mt-10 mb-5'>
          <div className='flex gap-10 w-full justify-start'>
            <Link to='/addpost'>
              <button className='text-3xl bg-gray-400 w-10 h-10 rounded-full bg-opacity-30 flex justify-center items-center'>
                +
              </button>
            </Link>
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-[10rem]">
          <div className="flex-shrink-0 w-[10rem]">
            <Sidebarbig />
          </div>
        </div>

        {/* Posts Content */}
        <div className="flex-grow overflow-y-auto">
          <AllPosts />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
