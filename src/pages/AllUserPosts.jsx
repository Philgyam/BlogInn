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
         <div className=' text-white'> 
      {posts.map((post) => (
        <div key={post.$id}>
          <h2>{post.Title}</h2>
          <p>{post.content}</p>
          {/* {JSON.parse(post.content).text} */}
          <p>Category: {post.Category}</p>
          <p>Created at: {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
    </div>
  )
}

export default AllUserPosts