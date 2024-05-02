import React, { useEffect,useState,useContext } from 'react'
import { useParams } from 'react-router-dom'
import { bucket,BUCKET_ID ,account,DATABASE_ID,COLLECTION_ID,COLLECTION_PROFILE_ID,databases} from '../appwrite/appwriteconfig';
import {ID,Permission,Role} from 'appwrite'
import { ThemeContext } from '../components/ThemeProvider'
import { BsBookmarkStar } from "react-icons/bs";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";






function FullPost() {

    const{id} = useParams()

    const [post,setPost] = useState({})
    const {theme,updateTheme} = useContext(ThemeContext)

    const fontColor = theme.backgroundColor === 'bg-black' ? 'text-white':''

   useEffect(()=>{

    const userPost = async () =>{

        try {
            
            const post = await databases.getDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id
            )

            setPost(post)
            console.log(post)

        } catch (error) {
            console.log(error,'its here')
        }
        
    }

userPost()


   },[id])



  return (
   <>
   <div className={`flex h-screen flex-col px-5   w-full ${theme.backgroundColor} `}>
   <h1 className='text-2xl text-orange-500 mb-2 ml-2 mt-3 font-mono  ' >BlogInn</h1>

    <div>
        <div className='w-10 h-10 flex mt-10 mb-5  '>
            <img className='w-[100%] h-[100%] object-cover rounded-full' src={post.Avatar} alt="" />
           
        </div>
        <div className='flex flex-col gap-1'>
            <p className='text-[1.2rem]'>
              Author:  {post.Author}
            </p>
            <p>{post.dateCreated}</p>
        </div>
        <div className='flex justify-end gap-5'>
        <p className='flex gap-1 items-center shadow-md bg-gray-200 bg-opacity-50 px-3 py-3 rounded-full'>
            
        <BsBookmarkStar 
        />
        </p>

        <p className='flex gap-1 items-center shadow-md bg-gray-200 bg-opacity-50  px-3 py-3 rounded-full'>
          
            <IoShareSocialOutline />
        </p>

        <p className='flex gap-1 items-center shadow-md bg-gray-200 bg-opacity-50  px-3 py-3 rounded-full'>
        <IoIosMore />
      </p>
        

        
        </div>
        <h1 className='text-center text-2xl mt-5 font-bold '>
            {post.Title}
        </h1>

        <p className='text-center mt-5'>
            {post.Content}
        </p>
    </div>

    <div className='mt-10'>
        <button className='shadow-md bg-gray-200 opacity-60 rounded-xl  px-2 py-2'>{post.Category}</button>
        <div>
    
        </div>
    </div>

    <div class="mt-20 border-b-2 border-b-gray-300 h-0 w-full"></div>



   </div>



   </>
  )
}

export default FullPost