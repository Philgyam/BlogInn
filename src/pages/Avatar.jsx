import React, { useEffect, useState, useContext } from 'react';
import { AiOutlinePlus } from "react-icons/ai";
import { ThemeContext } from '../components/ThemeProvider';
import { UsernameContext } from '../components/UsernameContext';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { bucket, BUCKET_ID, databases, DATABASE_ID, COLLECTION_PROFILE_ID } from '../appwrite/appwriteconfig';
import { account } from '../appwrite/appwriteconfig';
import { ID } from 'appwrite';
import { Spinner } from '@chakra-ui/react'


function Avatar() {
    const { theme } = useContext(ThemeContext);
    const [userBio, setUserBio] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false)
     
    const [fileName, setFileName] = useState('Choose Image');


    const { updateAvatar, avatar, updateUsername, username } = useContext(UsernameContext);

    const avatars = [
        'https://cloud.appwrite.io/v1/storage/buckets/66305f98003d99e0d5b5/files/66306257003b3ba6261b/view?project=66201769ed5710073074&mode=admin',
        'https://cloud.appwrite.io/v1/storage/buckets/66305f98003d99e0d5b5/files/663061f5001d3867b651/view?project=66201769ed5710073074&mode=admin',
        'https://cloud.appwrite.io/v1/storage/buckets/66305f98003d99e0d5b5/files/66306257003b3ba6261b/view?project=66201769ed5710073074&mode=admin',
        'https://cloud.appwrite.io/v1/storage/buckets/66305f98003d99e0d5b5/files/66306257003b3ba6261b/view?project=66201769ed5710073074&mode=admin',
    ];

    const handleAvatar = async (avatarClicked) => {
        updateAvatar(avatarClicked);
    };

    useEffect(() => {
        const fetchAvatar = async () => {
            const userDetailes = await account.get();
            const userProfile = await databases.getDocument(DATABASE_ID, COLLECTION_PROFILE_ID, userDetailes.$id);
            updateAvatar(userProfile.UserAvatar);
            setUserId(userDetailes.$id);
            console.log(userId);
        };
        fetchAvatar();
    }, []);

    const onSubmit = async (data) => {
        try {
            const userProfile = await databases.createDocument(DATABASE_ID, COLLECTION_PROFILE_ID, userId, {
                username: username,
                UserDescription: userBio,
                UserAvatar: avatar,
                profile_id: userId
            });

            

            const image = userProfile.UserAvatar;
            updateAvatar(image);
        } catch (error) {
            console.log(error);
        }

        try {
            const userProfile = await databases.updateDocument(DATABASE_ID, COLLECTION_PROFILE_ID, userId, {
                username: username,
                UserDescription: userBio,
                UserAvatar: avatar,
                profile_id: userId
            });

            const image = userProfile.UserAvatar;
            updateAvatar(image);
        } catch (error) {
            console.log(error, 'its here');
        }
    };

    const [userImage, setUserImage] = useState(null);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setUserImage(uploadedFile);

        if (uploadedFile) {
            const fileExtension = uploadedFile.name.split('.').pop();
            const fileNameWithoutExtension = uploadedFile.name.slice(0, 6);
            setFileName(`${fileNameWithoutExtension}.${fileExtension}`);
        }
    };

    const handleUploaded = async () => {
        try {
            setLoading(true)
            if (!userImage) return;
            const fileId = uuid();
            console.log(fileId);

            // Simulate progress
          
           

            await bucket.createFile(BUCKET_ID, fileId, userImage);

           
            console.log('file uploaded');
            const fileUrl = bucket.getFileDownload(BUCKET_ID, fileId);
            updateAvatar(fileUrl);
        } catch (error) {
            console.log(error, 'file upload error');
        }
        setLoading(false)
    };

    return (
        <>
            <div className={`flex flex-col h-screen w-full ${theme.backgroundColor} lg:flex-col items-center`}>
                
            
                <div className='text-white mt-[5rem] text-2xl'>
                    <h1 className={`${theme.backgroundColor === 'bg-black' ? 'text-white' : 'text-black'} font-bold font-mono`}>
                        Hello
                        <span className='text-orange-500 font-bold text-3xl ml-3'>{username}</span>
                    </h1>
                </div>
                <div className='mt-5 bg-white w-16 h-16 rounded-full text-center flex justify-center items-center bg-opacity-50 cursor-pointer'>
                    <img className='rounded-full w-16 h-16' src={avatar} alt="" />
                </div>
                <div className='flex mt-[1rem] gap-4 '>
                    {avatars.map((avatarImage, index) => (
                        <div key={index} className='mt-5 cursor-crosshair bg-white w-16 h-16 rounded-full text-center flex justify-center items-center bg-opacity-50'>
                            <img onClick={() => { handleAvatar(avatarImage) }} className='rounded-full w-16 h-16' src={avatarImage} alt="" />
                        </div>
                    ))}
                </div>
                <div className='mt-10 text-black text-center flex flex-col  cursor-pointer'>
                    <label className="bg-blue-500 mt-4 px-4 py-2 rounded-lg cursor-pointer text-white">
                        {fileName}
                        <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                    <button className='bg-blue-500 mt-4 px-4 py-2 rounded-lg' onClick={handleUploaded}>
                        Upload avatar
                    </button>
                   
                </div>
             
                <div>
                    {
                        loading?(
                            <div className='w-full flex justify-center mt-4'>
                            <Spinner
                            thickness='3px'
                             style={{
                            height:'1.5rem',
                            width:"1.5rem",
                            color:'#FC4100',
                            fontWeight:'bold',
                            
                            
        
                        }} />
        
                            </div>
                        ):('')
                    }
                   
               
                    <form action='submit'>
                        <input type="text"
                            name='UserBio'
                            value={userBio}
                            onChange={(e) => setUserBio(e.target.value)}
                            placeholder='Say Something nice about yourself 😊'
                            className='h-20 w-[20rem] pl-1 font-mono mt-10 bg-black bg-opacity-50 rounded-md shadow-md text-white'
                        />
                    </form>
                </div>
                <div className='mt-10 text-white cursor-pointer bg-orange-500 py-2 px-5 rounded-xl'>
                    <Link to='/categories'>
                        <button onClick={onSubmit} className='cursor-pointer'>
                            Next
                        </button>
                    </Link>
                </div>
                
                <div>
                </div>
            </div>
        </>
    );
}

export default Avatar;
