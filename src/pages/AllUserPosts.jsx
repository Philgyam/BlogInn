import React ,{useState,useEffect}from 'react'
import { bucket,BUCKET_ID ,account,DATABASE_ID,COLLECTION_ID,COLLECTION_PROFILE_ID,databases} from '../appwrite/appwriteconfig';
import {ID,Permission,Role} from 'appwrite'
import { ThemeContext } from '../components/ThemeProvider'
import {Link} from 'react-router-dom'



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

  
    <div className='h-full w-full'>
     
         <div className={ `  flex flex-col gap-10 items-center mt-2` } > 
      {posts.map((post) => (

            <Link to={`/${user}/${post.Category}/${post.$id}`}>
        <div key={post.$id} className={`mt-5shadow-xl h-[12rem] w-[90%] py-2  flex flex-col justify-between bg-white rounded-xl px-5`}>
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
          
          <div className='flex justify-end ' >
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