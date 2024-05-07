import React, { useEffect,useState,useContext } from 'react'
import { useParams } from 'react-router-dom'
import CommentSection from '../components/CommentSection';
import { bucket,BUCKET_ID ,account,DATABASE_ID,COLLECTION_ID,COLLECTION_PROFILE_ID,databases} from '../appwrite/appwriteconfig';
import { ThemeContext } from '../components/ThemeProvider'
import { BsBookmarkStar } from "react-icons/bs";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";






function FullPost() {

    const{id} = useParams()

    const [post,setPost] = useState({})
    const {theme,updateTheme} = useContext(ThemeContext)

    const fontColor = theme.backgroundColor === 'bg-black' ? 'text-white':''
    const [showComments, setShowComments] = useState(false);



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

   let lastScrollY = 0;


   useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShowComments(false);
      } else {
        // Scrolling up
        setShowComments(true);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);




  return (
   <>
   <div className={`flex m-h-screen flex-col px-5   w-full ${theme.backgroundColor} `}>
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
        <div className='w-full  mt-5 mb-10 '>
            <img className='' src={post.postImage} alt="" />
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

        

   {
    showComments &&(
    
  <div className={`w-[90%] h-[4rem] fixed bottom-0  mx-5 flex items-center justify-center bg-gray-400 py-5 items transition shadow-xl duration-1000ms ease-out sticky-bottom rounded-t-2xl `}>
  
  <div>
   

  <div className='flex flex-row gap-[5rem] items-center'>
    
          <button
          onClick={() => 
              setShowComments(!showComments)
            }
          className='flex items-center gap-2 bg-gray-200 px-2 rounded-xl py-1'>
          <FaRegComment />
          <span>10</span>
            </button>
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
        <div className='absolute bottom-[4rem] h-[20rem]  left-0 h-20 bg-red-500 w-full'>
        <p className='text-center'>Comments</p>
        <div className=' w-full absolute bottom-0'>
           <div className='w-[100%] flex'>
           <input type="text" />
            <button>post</button>
           </div>
        </div>
  </div>

  </div>
</div>
    )
   }




 





   </>
  )
}

export default FullPost