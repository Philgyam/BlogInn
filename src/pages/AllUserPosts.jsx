import React ,{useState,useEffect}from 'react'
import { bucket,BUCKET_ID ,account,DATABASE_ID,COLLECTION_ID,databases} from '../appwrite/appwriteconfig';
import {ID,Permission,Role} from 'appwrite'



function AllUserPosts() {

    const [posts, setPosts] = useState([])

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
    <div>
         <div className=' text-white flex flex-col items-center mt-5  ' > 
      {posts.map((post) => (
        <div key={post.$id}>
          <h2>{post.Title}</h2>
          <p>{post.Content}</p>
          
          
          <p>Category: {post.Category}</p>
        </div>
      ))}
    </div>
    </div>
  )
}

export default AllUserPosts