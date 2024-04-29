import React ,{useState,useEffect}from 'react'
import { bucket,BUCKET_ID ,account,DATABASE_ID,COLLECTION_ID,databases} from '../appwrite/appwriteconfig';
import {ID,Permission,Role} from 'appwrite'
import { ThemeContext } from '../components/ThemeProvider'




function AllUserPosts() {

    const [posts, setPosts] = useState([])
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
    
  return (

  
    <div className='h-full w-full'>
     
         <div className={ `  flex flex-col gap-10 items-center mt-2` } > 
      {posts.map((post) => (
        <div key={post.$id} className={`mt-5shadow-xl h-[12rem] w-[80%] py-2  flex flex-col justify-between bg-white rounded-xl px-10`}>
          <div className='flex justify-end gap-3 text-orange-500'>
          <p>You</p>
          <img className='h-8 w-8 rounded-full object-fit' src={post.Avatar} alt="" />
          
          </div>
          
          <h1 className='text-[1.5rem]'>{post.Title}</h1>
          <p>{post.Content}</p>
          
          <div className='flex justify-end ' >
          <button className=' bg-slate-100 text-gray-500 py-1 px-2 rounded-2xl '> {post.Category}</button>

          </div>
         
 
        </div>
      ))}
    </div>
    </div>
  )
}

export default AllUserPosts