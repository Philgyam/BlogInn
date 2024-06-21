import React, { useState, useContext, useEffect } from 'react';
import { UsernameContext } from '../components/UsernameContext';
import { bucket, BUCKET_ID, account, DATABASE_ID, COLLECTION_ID, COLLECTION_PROFILE_ID, databases, COLLECTION_COMMENT_ID } from '../appwrite/appwriteconfig';
import { ID, Permission, Role, Query } from 'appwrite';





function UserBio() {

    const { username, updateAvatar, avatar, setAvatar, setUserName } = useContext(UsernameContext);

    const user = async () => {
        try {
          const profile = await databases.listDocuments(DATABASE_ID,COLLECTION_PROFILE_ID,[
            Query.equal('profile_id',[])
          ])
        } catch (error) {
          console.log('Failed to get user details');
        }
      };



  return (
    <div className='text-white'>
        UserBio
    </div>
  )
}

export default UserBio