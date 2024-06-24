import React,{useState,useContext,useEffect} from 'react'
import {UsernameContext} from '../components/UsernameContext'
import { ThemeContext } from '../components/ThemeProvider';
import { CiMenuBurger } from "react-icons/ci";
import { useAuth } from '../utils/AuthContext';
import {Link} from 'react-router-dom'
import { bucket,BUCKET_ID, databases,DATABASE_ID ,COLLECTION_PROFILE_ID} from '../appwrite/appwriteconfig';
import { account } from '../appwrite/appwriteconfig'
import { IoHome } from "react-icons/io5";



function Sidebarbig() {
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
    <div className="h-[35rem] w-[10rem] bg-gray-800 text-white sticky  left-0 flex flex-col">
          <div className='mt-5 ml-3 bg-white w-5 h-5 rounded-full text-center flex justify-center items-center bg-opacity-50 cursor-pointer'>
            <img className='rounded-full w-5 h-5' src={avatar} alt="" />
            

            </div>
      <h2 className="text-2xl font-bold p-4"></h2>
      
      <ul className="flex flex-col space-y-4 p-4">
        <li className="hover:bg-gray-700 p-2 rounded">
        <Link to='/Home'>
                <button 
                className='bg-gray-700  py-2 px-4 rounded-full shadow-xl'
                 >
                  Home
               
                </button>
                </Link>
        </li>
        <li className="hover:bg-gray-700 p-2 rounded">
        <Link to='/Profile'>
                <button 
                className='bg-gray-700 py-2 px-4 rounded-full shadow-xl'
                 >
                   My Page
                </button>
                </Link>
        </li>
        <li className="hover:bg-gray-700 p-2 rounded">
        <Link to='/addPost'>
                <button
                   className='bg-gray-700 py-2 px-4 rounded-full shadow-xl'
                >

                Add Post
                </button>
                </Link>
        </li>
        <li className="hover:bg-gray-700 p-2 rounded">
        <Link to='/'>
                <button
                className='bg-gray-700 py-2 px-4 rounded-full shadow-xl'
                onClick={handleSubmit}
                >
               Logout
                </button>
                </Link>
        </li>
        <li className="hover:bg-gray-700 p-2 rounded">Community</li>
      </ul>
      <div className='flex flex-row justify-end gap-4 pt-4 pr-4'>
        <div onClick={colorChange1} className='w-5 h-5 bg-[#FFF3C7] rounded-full hover:cursor-pointer'>

        </div>

        <div onClick={colorChange2} className='w-5 h-5 bg-[#068DA9] rounded-full   hover:cursor-pointer'>

</div>
<div onClick={colorChange3} className='w-5 h-5 rounded-full bg-[#ECF8F9]  hover:cursor-pointer'>

</div>
        
<div onClick={colorChange4} className='w-5 h-5  bg-black rounded-full  hover:cursor-pointer'>

</div>
    </div>
    </div>
  );
}

export default Sidebarbig;
