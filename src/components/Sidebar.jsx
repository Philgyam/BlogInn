import React, { useState, useContext, useEffect } from 'react';
import { UsernameContext } from '../components/UsernameContext';
import { ThemeContext } from '../components/ThemeProvider';
import { CiMenuBurger } from "react-icons/ci";
import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { GiExitDoor } from "react-icons/gi";

function Sidebar() {
    const { username, updateAvatar, avatar, setAvatar } = useContext(UsernameContext);
    const { user, logoutUser } = useAuth();
    const { theme, updateTheme } = useContext(ThemeContext);
    
    const [isClicked, setIsClicked] = useState(false);
    
    useEffect(() => {
        const fetchAvatar = async () => {
            const userDetailes = await account.get();
            const userProfile = await databases.getDocument(DATABASE_ID, COLLECTION_PROFILE_ID, userDetailes.$id);
            updateAvatar(userProfile.UserAvatar);
        };
        fetchAvatar();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        logoutUser();
    };

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    return (
        <>
            <div className={`flex flex-col w-full ${theme.backgroundColor} z-[1000]`}>
                <button onClick={handleClick} className='ml-2 text-white'>
                    <CiMenuBurger 
                        style={{
                            height: '2rem',
                            width: '2rem',
                            color: theme.backgroundColor === 'bg-black' ? 'white' : 'black',
                        }}
                    />
                </button>

                <div className={`fixed top-0 left-0 h-full w-64 flex flex-col mt-3 rounded-lg bg-gray-900 text-white transition-all duration-300 ease-in-out ${isClicked ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className='flex flex-row justify-end gap-4 pt-4 pr-4'>
                        {/* Color options for theme */}
                        <div onClick={() => updateTheme({ backgroundColor: 'bg-[#FFF3C7]', textColor: 'text-black' })} className='w-7 h-7 bg-[#FFF3C7] rounded-full hover:cursor-pointer'></div>
                        <div onClick={() => updateTheme({ backgroundColor: 'bg-gradient-to-br from-black to-teal-500', textColor: 'text-white' })} className='w-7 h-7 bg-[#068DA9] rounded-full hover:cursor-pointer'></div>
                        <div onClick={() => updateTheme({ backgroundColor: 'bg-[#ECF8F9]', textColor: 'text-black' })} className='w-7 h-7 rounded-full bg-[#ECF8F9] hover:cursor-pointer'></div>
                        <div onClick={() => updateTheme({ backgroundColor: 'bg-black', textColor: 'text-white' })} className='w-7 h-7 bg-black rounded-full hover:cursor-pointer'></div>
                    </div>

                    <div className='mt-5 ml-3 bg-white w-16 h-16 rounded-full text-center flex justify-center items-center bg-opacity-50 cursor-pointer'>
                        <img className='rounded-full w-16 h-16' src={avatar} alt="User Avatar" />
                    </div>

                    <div className='text-center'>
                        <ul className={`pt-10 flex flex-col gap-8`}>
                            <li className={`transition-all duration-400 ease-in-out ${isClicked ? 'translate-x-0' : '-translate-x-full'}`}>
                                <Link to='/Home'>
                                    <button className='flex items-center bg-gray-700 py-2 px-4 rounded-full shadow-xl'>
                                        <IoHome className="mr-2" />
                                        Home
                                    </button>
                                </Link>
                            </li>
                            <li className={`transition-all duration-400 ease-in-out ${isClicked ? 'translate-x-0' : '-translate-x-full'}`}>
                                <Link to='/Profile'>
                                    <button className='flex items-center bg-gray-700 py-2 px-4 rounded-full shadow-xl'>
                                        <FaUserPlus className="mr-2" />
                                        My Page
                                    </button>
                                </Link>
                            </li>

                            <li className={`transition-all duration-500 ease-in-out ${isClicked ? 'translate-x-0' : '-translate-x-full'}`}>
                                <Link to='/addPost'>
                                    <button className='flex items-center bg-gray-700 py-2 px-4 rounded-full shadow-xl'>
                                        <FaUserPlus className="mr-2" />
                                        Add Post
                                    </button>
                                </Link>
                            </li>

                            <li className={`transition-all duration-700 ease-in-out ${isClicked ? 'translate-x-0' : '-translate-x-full'}`}>
                                <Link to='/'>
                                    <button className='flex items-center bg-gray-700 py-2 px-4 rounded-full shadow-xl' onClick={handleSubmit}>
                                        <GiExitDoor className="mr-2" />
                                        Logout
                                    </button>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className='mt-auto text-center'>
                        <p>Version 1.0</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;