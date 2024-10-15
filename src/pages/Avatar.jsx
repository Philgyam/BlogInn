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
    const [username, setUsername] = useState('')
    const [fileName, setFileName] = useState('Choose Image');
    const { updateAvatar, avatar, updateUsername } = useContext(UsernameContext);

    const avatars = [
        'https://cloud.appwrite.io/v1/storage/buckets/66305f98003d99e0d5b5/files/66306257003b3ba6261b/view?project=66201769ed5710073074&mode=admin',
        'https://cloud.appwrite.io/v1/storage/buckets/66305f98003d99e0d5b5/files/663061f5001d3867b651/view?project=66201769ed5710073074&mode=admin',
        'https://cloud.appwrite.io/v1/storage/buckets/66305f98003d99e0d5b5/files/66306257003b3ba6261b/view?project=66201769ed5710073074&mode=admin',
        'https://cloud.appwrite.io/v1/storage/buckets/66292c86c05c5fc84f6b/files/670e8e96002ba2467cee/view?project=66201769ed5710073074&project=66201769ed5710073074'
    ];

    const handleAvatar = async (avatarClicked) => {
        updateAvatar(avatarClicked);
    };

    useEffect(() => {
        const fetchAvatar = async () => {
            const userDetailes = await account.get();
            setUserId(userDetailes.$id);
            setUsername(userDetailes.name)
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
            await bucket.createFile(BUCKET_ID, fileId, userImage);

            const fileUrl = bucket.getFileDownload(BUCKET_ID, fileId);
            updateAvatar(fileUrl);
        } catch (error) {
            console.log(error, 'file upload error');
        }
        setLoading(false)
    };

    return (
        <>
            <div className={`flex flex-col h-screen w-full items-center ${theme.backgroundColor}`}>
                <div className="text-white mt-10 text-4xl font-bold font-mono">
                    Hello, <span className="text-orange-500">{username}</span>
                </div>

                <div className="mt-5 bg-white w-32 h-32 rounded-full shadow-xl flex items-center justify-center relative glassmorphism">
                    <img className="rounded-full w-32 h-32 object-cover" src={avatar} alt="avatar" />
                </div>

                <div className="flex mt-6 gap-4 flex-wrap">
    {avatars.map((avatarImage, index) => (
        <div key={index} className="w-16 h-16 rounded-full overflow-hidden cursor-pointer transition-transform transform hover:scale-105">
            <img 
                onClick={() => handleAvatar(avatarImage)} 
                className="w-full h-full object-cover" 
                src={avatarImage} 
                alt="avatar option" 
                loading="lazy" 
            />
        </div>
    ))}
</div>

                <div className="mt-8 flex flex-col items-center">
                    <label className="bg-opacity-50 bg-gradient-to-r from-blue-400 to-purple-500 px-4 py-2 rounded-lg text-white cursor-pointer shadow-lg transition-transform transform hover:scale-105">
                        {fileName}
                        <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>

                    <button className="bg-opacity-50 bg-gradient-to-r from-purple-400 to-pink-500 mt-4 px-6 py-2 rounded-lg text-white shadow-lg transition-transform transform hover:scale-105" onClick={handleUploaded}>
                        Upload avatar
                    </button>
                </div>

                {loading && (
                    <div className="w-full flex justify-center mt-4">
                        <Spinner thickness="3px" size="lg" color="orange.400" />
                    </div>
                )}

                <form action="submit" className="mt-6 w-full flex justify-center">
                    <input type="text"
                        name="UserBio"
                        value={userBio}
                        onChange={(e) => setUserBio(e.target.value)}
                        placeholder="Say Something nice about yourself 😊"
                        className="w-80 h-12 px-4 text-white bg-opacity-30 bg-black rounded-md backdrop-blur-md border-0 placeholder-white shadow-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                </form>

                <div className="mt-10">
                    <Link to="/categories">
                        <button onClick={onSubmit} className="bg-orange-500 text-white px-6 py-2 rounded-full shadow-lg transition-transform transform hover:scale-105">
                            Next
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Avatar;
