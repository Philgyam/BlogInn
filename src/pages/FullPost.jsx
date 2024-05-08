import React, { useEffect,useState,useContext } from 'react'
import { useParams } from 'react-router-dom'
import { bucket,BUCKET_ID ,account,DATABASE_ID,COLLECTION_ID,COLLECTION_PROFILE_ID,databases,COLLECTION_COMMENT_ID} from '../appwrite/appwriteconfig';
import { ThemeContext } from '../components/ThemeProvider'
import { BsBookmarkStar } from "react-icons/bs";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";
import { v4 as uuidv4 } from 'uuid';
import { Permission,Query,Role } from 'appwrite';






function FullPost() {

    const{id} = useParams()

    const [post,setPost] = useState({})
    const {theme,updateTheme} = useContext(ThemeContext)

    const fontColor = theme.backgroundColor === 'bg-black' ? 'text-white':''
    const [showComments, setShowComments] = useState(false);
    const [commentBox, setCommentBox] = useState(false)
    const [commentContent,setCommentContent] = useState()
    const [userImage, setUserImage] = useState('')
    const [username,setUsername] = useState('')
    const [postId,setPostId] = useState('')
    const [userId, setUserId] = useState('')
    const [comments, setComments] = useState([]); 
    const  [ commentNum, setCommentNum ] = useState()


    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
        



// ///////// THE USE EFFECT FOR FETCHING THE POST /////////////////////////

   useEffect(()=>{

    const userPost = async () =>{

        try {
            
            const post = await databases.getDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id
            )

            setPost(post)
            setUserImage(post.Avatar)
            console.log(post.$id)
            setPostId(post.$id)
           


        } catch (error) {
            console.log(error,'its here')
        }
        
    }

userPost()


   },[id])


   ////////// THE SCROLL  UP AND DOWN EFFECT///////////////////////////

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


  //////////// THE FETCH FOR USER DETAILS /////////////////////

  useEffect(() => {
    const fetchAvatar = async () => {
      const userDetailes = await account.get();
      const userProfile = await databases.getDocument(DATABASE_ID, COLLECTION_PROFILE_ID, userDetailes.$id);

      const image = userProfile.UserAvatar
      setUserImage(image)
      const user = userProfile.username
      setUsername(user)
      setUserId(userDetailes.$id)
      console.log(userId)


 
      
   
    };
    fetchAvatar();
  }, []);

 


/////////// THE SUBMIT COMMENT FUNCTION ////////////////////

  const submitPost = async () =>{




    try {
      if(!commentContent) return

      
    const commentPost = await databases.createDocument(DATABASE_ID,COLLECTION_COMMENT_ID,uuidv4(),{

      
      author:username,
      date_commented:currentDate,
      post_id:postId,
      userAvatar:userImage,
      content:commentContent

    },
     [
      Permission.read(Role.any()),
      Permission.write(Role.user(userId)),
      Permission.delete(Role.user(userId)),
      Permission.update(Role.user(userId)),
    ]
  )

   
console.log('its done')


      
    } catch (error) {
      console.log(error,'its here')
    }

  }


  // //////////////// FETCHING THE COMMENTS PECULIAR TO POSTS/////////////////



  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_COMMENT_ID,
          [
            Query.equal('post_id',[`${postId}`])
          ]
         
        );
        setComments(comments);
        console.log(comments)
        setCommentNum(comments.documents.length)

        console.log(comments.documents.length)
      } catch (error) {
        console.log(error, 'its here');
      }
    };
    fetchComments();
  }, [postId, userId]);



  return (
   <>
   <div className={`flex m-h-screen flex-col px-5   w-full ${theme.backgroundColor} `}>
   <h1 className='text-2xl text-orange-500 mb-2 ml-2 mt-3 font-mono' >BlogInn</h1>

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

    <div className="mt-20 border-b-2 border-b-gray-300 h-0 w-full"></div>



   </div>

        

   {
    showComments &&(
      <div className=''>
    
  <div  className={`bg-[#31363F]  w-[90%] h-[4rem] fixed bottom-0 z-5 mx-5 flex items-center justify-center  py-5 items transition shadow-xl duration-1000ms ease-out sticky-bottom rounded-t-2xl `}>
  
  <div className='' >
   

  <div className='flex flex-row gap-[5rem] items-center '>
    
          <button
          onClick={() => 
              setCommentBox(!commentBox)
            }
          className='flex items-center gap-2 bg-gray-200 px-2 rounded-xl py-1'>
          <FaRegComment />
          <span>{commentNum}</span>
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
        {
          commentBox &&
             <div className={`absolute bottom-[3.5rem] h-[20rem]  left-0  rounded-t-2xl bg-white   w-full`}>
             <p className='text-center'>Comments</p>
             <div className=' w-full absolute bottom-0'>

             

                <div className='w-full px-1 h-10 flex mb-2'>
                <input
                name='comment'
                onChange={(e)=>{
                  setCommentContent(e.target.value)
                }}
                className='w-[80%] '
                style={{
                 borderColor: 'gray',
                 borderWidth: '2px',
                 borderStyle: 'solid'
               }}
                 type="text" />

                 <button
                onClick={()=>{
                  console.log('hjello')
                  submitPost()
                }}
                 
                 className='w-[20%] bg-black text-white'>post</button>
                </div>
             </div>
       </div>
        }
       

  </div>
</div>
</div>
    )
   }




 





   </>
  )
}

export default FullPost