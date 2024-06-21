import React,{useState,useContext,useEffect} from 'react'
import {UsernameContext} from '../components/UsernameContext'
import { ThemeContext } from '../components/ThemeProvider';
import { CiMenuBurger } from "react-icons/ci";
import { useAuth } from '../utils/AuthContext';
import {Link} from 'react-router-dom'
import { bucket,BUCKET_ID, databases,DATABASE_ID ,COLLECTION_PROFILE_ID} from '../appwrite/appwriteconfig';
import { account } from '../appwrite/appwriteconfig'




function Sidebar() {

    const {username,updateAvatar,avatar,setAvatar,updateUsername} = useContext(UsernameContext)


    useEffect(() => {
      const fetchAvatar = async () => {
        const userDetailes = await account.get();
        const userProfile = await databases.getDocument(DATABASE_ID, COLLECTION_PROFILE_ID, userDetailes.$id);
        updateAvatar(userProfile.UserAvatar);
      };
      fetchAvatar();
    }, []);

    const {user,logoutUser} = useAuth()

    const handleSubmit = (e)=>{
        e.preventDefault()

        logoutUser()
    }
    

    const {theme,updateTheme} = useContext(ThemeContext)

    const colorChange1 =()=>{
        updateTheme({
          backgroundColor:'bg-[#FFF3C7]',
          textColor:'text-black'
        })
      }

      const colorChange2 =()=>{
        updateTheme({
          backgroundColor:'bg-gradient-to-br from-black to-teal-500',
          textColor:'text-white'
        })
      }
      
      const colorChange3 =()=>{
        updateTheme({
          backgroundColor:'bg-[#ECF8F9]',
          textColor:'text-black'
        })
      }
      
      
      const colorChange4 =()=>{
        updateTheme({
          backgroundColor:'bg-black',
          textColor:'text-white'
        })
      }
      
      useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(theme))
       }, [theme])

    const [isClicked, setIsClicked] = useState(false)
    const fontColor = theme.backgroundColor === 'bg-black' ? 'white':'black'

    
    const handleClick = () => {
        setIsClicked(!isClicked)
    }

  return (
   <>
    <div className={`flex flex-col   w-full ${theme.backgroundColor} z-[1000] `}>
   <button
   onClick={handleClick}
   className='ml-2   text-white'>

     <CiMenuBurger 
style={{
  height:'2rem',
  width:'2rem',
  fontStyle:'bold',
color: fontColor,



}}
/>
   </button>
   
  <div className={`fixed top-[5rem] left-0 h-full w-[20rem] flex flex-col mt-3 rounded-lg  bg-gray-900 text-white transition-all duration-300 ease-in-out ${isClicked?'translate-x-0':'-translate-x-full'}`}>
    <div className='flex flex-row justify-end gap-4 pt-4 pr-4'>
        <div onClick={colorChange1} className='w-7 h-7 bg-[#FFF3C7] rounded-full hover:cursor-pointer'>

        </div>

        <div onClick={colorChange2} className='w-7 h-7 bg-[#068DA9] rounded-full   hover:cursor-pointer'>

</div>
<div onClick={colorChange3} className='w-7 h-7 rounded-full bg-[#ECF8F9]  hover:cursor-pointer'>

</div>
        
<div onClick={colorChange4} className='w-7 h-7  bg-black rounded-full  hover:cursor-pointer'>

</div>
    </div>
  <div className='mt-5 ml-3 bg-white w-16 h-16 rounded-full text-center flex justify-center items-center bg-opacity-50 cursor-pointer'>
            <img className='rounded-full w-16 h-16' src={avatar} alt="" />
            

            </div>
    <div className='text-center'>
        
        <ul className={`pt-10 flex flex-col  gap-10`}>
            <li
            className={`transition-all duration-[400ms] ease-in-out ${isClicked ? 'translate-x-0': '-translate-x-full' } `}
            >
                <Link to='/Home'>
                <button 
                className='bg-gray-700 py-2 px-4 rounded-full shadow-xl'
                 >
                  Home
                </button>
                </Link>
            </li>
            <li
            className={`transition-all duration-[400ms] ease-in-out ${isClicked ? 'translate-x-0': '-translate-x-full' } `}
            >
                <Link to='/Profile'>
                <button 
                className='bg-gray-700 py-2 px-4 rounded-full shadow-xl'
                 >
                   My Page
                </button>
                </Link>
            </li>

            <li 
                className={`transition-all duration-[500ms] ease-in-out ${isClicked ? 'translate-x-0': '-translate-x-full' } `}

            >
                <Link to='/addPost'>
                <button
                   className='bg-gray-700 py-2 px-4 rounded-full shadow-xl'
                >

                Add Post
                </button>
                </Link>
            </li>

         
            <li
            
            className={`transition-all duration-[700ms] ease-in-out ${isClicked ? 'translate-x-0': '-translate-x-full' } `}

            >
                <Link to='/'>
                <button
                className='bg-gray-700 py-2 px-4 rounded-full shadow-xl'
                onClick={handleSubmit}
                >
               Logout
                </button>
                </Link>

                </li>

           
        </ul>
    </div>
        <div className='mt-[5rem] bottom-div text-center'>
      
            Version 1.0
        </div>

  </div>
  </div>
   </>
  )
}

export default Sidebar