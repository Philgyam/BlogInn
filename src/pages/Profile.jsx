import React,{useState,useContext,useEffect} from 'react'
import { AiOutlineMenu } from "react-icons/ai";
import { useAuth } from '../utils/AuthContext';
import {UsernameContext} from '../components/UsernameContext'
import { ThemeContext } from '../components/ThemeProvider';
import Sidebar from '../components/Sidebar';
import { HiSearch } from 'react-icons/hi';
import AllUserPosts from './AllUserPosts';



function Profile() {
  const {user,logout} = useAuth()
  const {username,updateAvatar,avatar,setAvatar,updateUsername} = useContext(UsernameContext)
  const {theme,updateTheme} = useContext(ThemeContext)



  
  return (
    <>
    <div className={`h-screen w-full ${theme.backgroundColor} pt-3 `}>
      <div className='flex gap-4 justify-around mt-3 '>
        <div>
        <Sidebar/>
        </div>
        <div >
        <span className={`${theme.backgroundColor === 'bg-black' ? 'text-white':'text-black'} text-2xl`}>
          hello
        </span>
            <span className='text-orange-500 font-bold text-3xl ml-3'>{username} </span>
        </div>
        <div>
         <img className='rounded-full w-16 h-16' src={avatar} alt=""  />
         
        </div>
       
      
      </div>

      <AllUserPosts/>
   

    </div>
    </>
  )
}

export default Profile

  {/* <img className='rounded-full w-16 h-16' src={avatar} alt=""  />

            <div className='text-2xl' >
              Hello
            <span className='text-orange-500 font-bold text-3xl ml-3'>{username} </span>

            </div> */}
          