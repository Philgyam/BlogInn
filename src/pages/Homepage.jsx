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
  const [active, setActive] = useState('Recent');
  const [layout, setLayout] = useState('grid');
  const [showAllPosts2, setShowAllPosts2] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const clicked = (label) => {
    setActive(label);
  };

  const toggleLayout = () => {
    setShowAllPosts2((prev) => !prev);
  };

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <div className={`flex flex-col h-screen ${theme.backgroundColor}`}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-inherit shadow-md">
        <h1 className='text-2xl text-orange-500 mb-2 ml-1 font-mono text-center mt-1 lg:hidden'>BlogInn</h1>
        <div className='flex gap-8 items-center justify-between p-4'>
          <div className='flex gap-8 items-center w-full lg:gap-[10rem]'>
            <div className='lg:hidden'>
              <Sidebar />
            </div>
            <div>
              <h1 className='hidden lg:block text-2xl text-orange-500 mb-2 ml-1 font-mono text-center mt-1'>BlogInn</h1>
            </div>
            <form className='  flex items-center lg:left-[10rem] left-[4rem] w-[80%] lg:w-[80%]  max-w-xs absolute'>
              <input 
                type="text"
                className='h-10 w-full pl-4 pr-10 font-mono bg-black bg-opacity-50 rounded-full shadow-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500'
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
              onClick={toggleModal}
              className={`h-8 w-8 cursor-pointer ${theme.backgroundColor === 'bg-black' ? 'text-white' : 'text-black'}`}
              style={{ marginLeft: '2rem' }}
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
        <div className="flex-grow overflow-y-auto p-4">
          {active === 'Recent' && (showAllPosts2 ? <AllPosts layout={layout} /> : <AllPosts2 layout={layout} />)}
          {active === 'For You' && <Foryou />}
          {active === 'Trending' && <Trending />}
        </div>

        {/* Window Button */}
        <div className='absolute bottom-4 right-4'>
          <MdOutlineWindow
            onClick={toggleLayout}
            className="h-8 w-8 cursor-pointer text-black"
          />
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-bold mb-4">Modal Title</h2>
              <p>This is your modal content.</p>
              <button 
                onClick={toggleModal} 
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;