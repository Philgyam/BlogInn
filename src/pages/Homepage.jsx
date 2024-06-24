import React, { useContext, useState } from 'react';
import { ThemeContext } from '../components/ThemeProvider';
import { HiSearch } from 'react-icons/hi';
import Sidebar from '../components/Sidebar';
import Sidebarbig from '../components/Sidebarbig';
import AllPosts from './AllPosts';
import Foryou from '../components/Foryou';
import Trending from '../components/Trending';
import { MdOutlineExplore, MdOutlineWindow } from "react-icons/md";
import AllPosts2 from './Allposts2';

function Homepage() {
  const { theme } = useContext(ThemeContext);

  const buttonLabels = ['Recent', 'For You', 'Trending'];
  const [active, setActive] = useState('Recent'); // Set default active button to 'Recent'
  const [layout, setLayout] = useState('grid'); // Set default layout to 'grid'
  const [showAllPosts2, setShowAllPosts2] = useState(false); // State to toggle between AllPosts and AllPosts2

  const clicked = (label) => {
    setActive(label);
  };

  const toggleLayout = () => {
    setShowAllPosts2((prev) => !prev); // Toggle between true and false
  };

  return (
    <div className={`flex flex-col h-screen ${theme.backgroundColor}`}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-inherit shadow-md">
        <h1 className='text-xl md:text-2xl text-orange-500 mb-1 ml-1 font-mono text-center mt-1'>BlogInn</h1>
        <div className='flex items-center justify-between px-2 md:px-4 py-1 md:py-2'>
          <div className='flex gap-4 md:gap-8 items-center'>
            <div className='lg:hidden'>
              <Sidebar />
            </div>
          </div>
          <div className='flex-1 flex justify-center'>
            <form action="" className='relative flex items-center'>
              <input
                type="text"
                className='h-8 w-[12rem] md:h-10 md:w-[15rem] pl-4 pr-10 font-mono bg-black bg-opacity-50 rounded-full shadow-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
                required
                placeholder='Search...'
              />
              <button className="absolute right-3 top-2">
                <HiSearch className="text-white" />
              </button>
            </form>
          </div>
        </div>
        <div className='flex lg:ml-[9rem] pl-2 md:pl-3 pb-1'>
          <div className='flex gap-2 md:gap-4'>
            {buttonLabels.map((label) => (
              <button
                key={label}
                onClick={() => clicked(label)}
                className={`px-2 py-1 md:px-3 md:py-2 rounded transition-all duration-200 
                  ${active === label ? 'bg-orange-500 text-white' : theme.backgroundColor === 'bg-black' ? 'text-white' : 'text-black'}`}
              >
                {label}
              </button>
            ))}
            <MdOutlineExplore
              style={{
                height: '1.5rem',
                width: '1.5rem',
                md: { height: '2rem', width: '2rem' },
                color: theme.backgroundColor === 'bg-black' ? 'white' : 'black',
                marginLeft: '1rem md:ml-2rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-[10rem]">
          <div className="flex-shrink-0 w-[10rem]">
            <Sidebarbig />
          </div>
        </div>

        {/* Posts Content */}
        <div className="flex-grow overflow-y-auto">
          {active === 'Recent' && (showAllPosts2 ? <AllPosts2 layout={layout} /> : <AllPosts layout={layout} />)}
          {active === 'For You' && <Foryou />}
          {active === 'Trending' && <Trending />}
        </div>

        {/* Window Button */}
        <div className='absolute bottom-4 right-4'>
          <MdOutlineWindow
            onClick={toggleLayout}
            style={{
              height: '2rem',
              width: '2rem',
              color:  'black',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
