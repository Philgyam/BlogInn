import React, { useContext, useState } from 'react';
import { ThemeContext } from '../components/ThemeProvider';
import { HiSearch } from 'react-icons/hi';
import Sidebar from '../components/Sidebar';
import Sidebarbig from '../components/Sidebarbig';
import AllPosts from './AllPosts';
import Foryou from '../components/Foryou';
import Trending from '../components/Trending';
import { MdOutlineExplore, MdOutlineWindow } from "react-icons/md";
import AllPosts2 from './Allposts2'


function Homepage() {
  const { theme } = useContext(ThemeContext);

  const buttonLabels = ['Recent', 'For You', 'Trending'];
  const [active, setActive] = useState('Recent'); // Set default active button to 'Recent'
  const [layout, setLayout] = useState('grid'); // Set default layout to 'grid'
  const [showAllPosts2, setShowAllPosts2] = useState(false); // State to toggle between AllPosts and AllPosts2
  const [showModal, setShowModal] = useState(false); // State to toggle modal visibility

  const clicked = (label) => {
    setActive(label);
  };

  const toggleLayout = () => {
    setShowAllPosts2((prev) => !prev); // Toggle between true and false
  };

  const toggleModal = () => {
    setShowModal((prev) => !prev); // Toggle modal visibility
  };

  return (
    <div className={`flex flex-col h-screen ${theme.backgroundColor}`}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-inherit shadow-md">
        <h1 className='text-2xl text-orange-500 mb-2 ml-1 font-mono text-center mt-1 lg:hidden'>BlogInn</h1>
        <div className='flex gap-8 items-center justify-center p-4'>
          <div className='flex gap-8 justify-start w-full lg:gap-[10rem]'>
            <div className='lg:hidden'>
              <Sidebar />
            </div>
            <div>
              <h1 className=' hidden lg:block  text-2xl text-orange-500 mb-2 ml-1 font-mono text-center mt-1'>BlogInn</h1>
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
              onClick={toggleModal}
              style={{
                height: '2rem',
                width: '2rem',
                color: theme.backgroundColor === 'bg-black' ? 'white' : 'black',
                marginLeft: '2rem',
                cursor: 'pointer'
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
          {active === 'Recent' && (showAllPosts2 ? <AllPosts layout={layout} /> : <AllPosts2 layout={layout} />)}
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
              color: 'black',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 shadow-lg rounded-lg">
              {/* Your modal content here */}
              This is your modal content.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;
