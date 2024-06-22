import React, { useState, useContext, useEffect } from 'react';
import { UsernameContext } from '../components/UsernameContext';
import { bucket, BUCKET_ID, DATABASE_ID, COLLECTION_ID, COLLECTION_PROFILE_ID, databases, COLLECTION_COMMENT_ID, account } from '../appwrite/appwriteconfig';
import { ID, Permission, Role, Query } from 'appwrite';
import { Spinner } from '@chakra-ui/react'





function UserBio() {

const [userAvatar, setUserAvatar] = useState('')
const [username, setUsername] = useState('')
const [loading,setLoading] = useState(false)
    const user = async () => {
        try {
          setLoading(true)
          const details = await account.get()
         
          const userId = details.$id
          const profile = await databases.listDocuments(DATABASE_ID,COLLECTION_PROFILE_ID,[
            Query.equal('profile_id',[userId])
          ])

          const profileDoc = profile.documents
          console.log(profileDoc)
          const avatar = profileDoc[0].UserAvatar
          setUserAvatar(avatar)
          setUsername(profileDoc[0].username)

          setLoading(false)
        } catch (error) {
          console.log(error);
        }
      };
      
      useEffect(()=>{
        user()
      },[])



  return (
    <div>
    <div className='text-white h-full w-full flex justify-center'>
        <div>
        { loading?(
          <div className='w-[10rem] mt-10 flex justify-center bg-slate-200 bg-transparent h-[10rem]'>
               <Spinner
                            thickness='3px'
                            speed='1s'
                             style={{
                            height:'3rem',
                            width:"3rem",
                            color:'#FC4100',
                            fontWeight:'bold',
                        }} />
          </div>
          
        ):(<div className='w-[10rem] h-[10rem] '>
          <img className='rounded-full h-[100%] w-[100%]' src={userAvatar} alt="" />
          </div>)

}
          
          
        </div>
        
    </div>

    <div className='text-white mt-5 text-center font-bold text-[1.5rem]'>
            <h1>{username}</h1>
        </div>
    </div>
  )
}

export default UserBio