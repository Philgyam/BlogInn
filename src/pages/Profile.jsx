import React,{useState,useContext,useEffect} from 'react'
import { AiOutlineMenu } from "react-icons/ai";
import { useAuth } from '../utils/AuthContext';
import {UsernameContext} from '../components/UsernameContext'
import { ThemeContext } from '../components/ThemeProvider';
import Sidebar from '../components/Sidebar';
import { HiSearch } from 'react-icons/hi';
import AllUserPosts from './AllUserPosts';
import { MdOutlineExplore } from "react-icons/md";
import { bucket,BUCKET_ID ,account,DATABASE_ID,COLLECTION_ID,COLLECTION_PROFILE_ID,databases} from '../appwrite/appwriteconfig';





function Profile() {
  const {username,updateAvatar,avatar,setAvatar,setUserName} = useContext(UsernameContext)
  const {theme,updateTheme} = useContext(ThemeContext)

  const buttonLabels = ['Your Posts','UserBio']

  const [active, setActive] =useState('')

  const clicked = (label)=>{
 setActive(label)
  }



  useEffect(()=>{
    setActive('Your Posts')
  },[])

  const user= async()=>{
  try {
    const userDetails = await account.get()
    
  } catch (error) {
    console.log('failed to get user details')
  }
  }


  useEffect(()=>{
    user()
    
  },[])
  



  
  return (
    
    <div className={`min-h-screen h-screen w-full ${theme.backgroundColor}`}>
      <div className='flex gap-4 justify-around pt-6'>
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
    
  )
}

export default Profile

 
          