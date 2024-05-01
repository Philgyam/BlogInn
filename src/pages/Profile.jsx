import React,{useState,useContext,useEffect} from 'react'
import { AiOutlineMenu } from "react-icons/ai";
import { useAuth } from '../utils/AuthContext';
import {UsernameContext} from '../components/UsernameContext'
import { ThemeContext } from '../components/ThemeProvider';
import Sidebar from '../components/Sidebar';
import { HiSearch } from 'react-icons/hi';
import AllUserPosts from './AllUserPosts';
import { MdOutlineExplore } from "react-icons/md";



function Profile() {
  const {user,logout} = useAuth()
  const {username,updateAvatar,avatar,setAvatar,setUserName} = useContext(UsernameContext)
  const {theme,updateTheme} = useContext(ThemeContext)

  const buttonLabels = ['Your Posts','UserBio']

  const [active, setActive] =useState(null)

  const clicked = (label)=>{
 setActive(label)
  }






  
  return (
    <>
    <div className={`h-screen w-full ${theme.backgroundColor} pt-3 pb-10 `}>
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
         <img className='rounded-full w-10 h-10' src={avatar} alt=""  />
         
        </div>
       
      
      </div >

      <div className='flex py-2 px-10 mt-10'>
      <MdOutlineExplore 
      style={{
        height:'2rem',
        width:'2rem',
        color: theme.backgroundColor === 'bg-black' ? 'white':'black'
      }}
      className=''
       />

      <div className='flex gap-10 w-full justify-center mb-8 '>
      {buttonLabels.map((label,index)=>(
              <button  key={label}
              onClick={()=>clicked(label)}
              className={` ${active === label ? 'underline transition-all duration-200':''} ${theme.backgroundColor === 'bg-black' ? 'text-white' :'text-black'}`}>
                {label}
              </button>
              ))}
</div>
        
      </div>
      
      {active === 'Your Posts' && <AllUserPosts />}

     
   

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
          