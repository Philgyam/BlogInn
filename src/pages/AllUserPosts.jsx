import React ,{useState,useEffect}from 'react'
import { bucket,BUCKET_ID ,account,DATABASE_ID,COLLECTION_ID,COLLECTION_PROFILE_ID,databases} from '../appwrite/appwriteconfig';
import {ID,Permission,Role} from 'appwrite'
import { ThemeContext } from '../components/ThemeProvider'
import {Link} from 'react-router-dom'
import { FaRegComment } from "react-icons/fa";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";





function AllUserPosts() {

    const [posts, setPosts] = useState([])
    const [avatar, setAvatar] = useState('')
    const [user,setUser] =  useState('')
    const {theme,updateTheme} = React.useContext(ThemeContext)

    const postFetch = async ( ) => {
      try {
        const post = await databases.listDocuments(DATABASE_ID,COLLECTION_ID)
        setPosts(post.documents)
        

        
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
        postFetch()
    }, [])





    useEffect(() => {
      const fetchAvatar = async () => {
        const userDetailes = await account.get();
        const userProfile = await databases.getDocument(DATABASE_ID, COLLECTION_PROFILE_ID, userDetailes.$id);

        const image = userProfile.UserAvatar
        const user = userProfile.username
        
        setAvatar(image)
        setUser(user)
        
     
      };
      fetchAvatar();
    }, []);




    
  return (

  
    <div className='h-full w-[100%]'>
     
         <div className={ ` h-full w-[100%] flex flex-col gap-10 px-5 ` } > 
      {posts.map((post) => (

            <Link to={`/${user}/${post.Category}/${post.$id}`}>
        <div key={post.$id} className={`mt-2 shadow-xl h-[12rem] w-[100%] py-2  flex flex-col justify-between bg-white rounded-xl px-5`}>
          <div className='flex justify-between text-orange-500'>
           
            <div>
            <p>{post.dateCreated}</p>
            </div>
            <div>
              {''}
            </div>
             <div>
              {''}
            </div>
          <p>You</p>
          <img className='h-8 w-8 rounded-full object-fit' src={avatar} alt="" />
          
          </div>
          
          <h1 className='text-[1.5rem]'>{post.Title}</h1>
          <p>{post.Content}</p>
          
          <div className='flex justify-between ' >
          
          <div className='flex gap-5 items-center'>
            <p className='flex items-center gap-2 bg-gray-200 px-2 rounded-xl py-1'>
            <FaRegComment />
            <span>10</span>
              </p>
              <div className='flex  items-center  gap-2 bg-gray-200 px-2 rounded-xl py-1'>
              <div>
              <SlLike />
              </div>
              <div>
              <p>10</p>
              </div>
              |
          <SlDislike />
              </div>
          
          </div>
          <button className=' bg-slate-100 text-gray-500 py-1 px-2 rounded-2xl '> {post.Category}</button>

          </div>

        </div>
        </Link>
      ))}
    </div>
    </div>
  )
}

export default AllUserPosts