import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    databases,
    DATABASE_ID,
    COLLECTION_ID,
    COLLECTION_PROFILE_ID,
    COLLECTION_COMMENT_ID,
    account
} from '../appwrite/appwriteconfig';
import { ThemeContext } from '../components/ThemeProvider';
import CommentSection from './CommentSection'; // Import your CommentSection
import { v4 as uuidv4 } from 'uuid';
import { Permission, Query, Role } from 'appwrite';
import OtherPosts from './OtherPosts';

function FullPost() {
    const { user, category, id } = useParams();
    const { theme } = useContext(ThemeContext);
    const [post, setPost] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [commentContent, setCommentContent] = useState('');
    const [userImage, setUserImage] = useState('');
    const [username, setUsername] = useState('');
    const [postId, setPostId] = useState('');
    const [userId, setUserId] = useState('');
    const [comments, setComments] = useState([]);
    const [commentNum, setCommentNum] = useState(0);
    const navigate = useNavigate();

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {
        const userPost = async () => {
            try {
                const post = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
                setPost(post);
                setUserImage(post.Avatar);
                setPostId(post.$id);
                fetchUserPosts(post.Author);
            } catch (error) {
                console.log(error, 'Error fetching post');
            }
        };
        userPost();
    }, [id]);

    const fetchUserPosts = async (author) => {
        try {
            const userPosts = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('Author', [author])]);
            setUserPosts(userPosts.documents);
        } catch (error) {
            console.log(error, 'Error fetching user posts');
        }
    };

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const userDetails = await account.get();
                const userProfile = await databases.getDocument(DATABASE_ID, COLLECTION_PROFILE_ID, userDetails.$id);
                setUserImage(userProfile.UserAvatar);
                setUsername(userProfile.username);
                setUserId(userDetails.$id);
                console.log(userProfile)
            } catch (error) {
                console.log(error, 'Error fetching user profile');
            }
        };
        fetchAvatar();
    }, []);

    const submitPost = async () => {

        
        console.log({
            author: username,
            date_commented: currentDate,
            post_id: postId,
            userAvatar: userImage,
            content: commentContent
        });

        try {
            // Validate fields
            if (!commentContent || !userId || !username || !currentDate || !postId || !userImage) {
                console.log('Missing required fields');
                return;
            }
    
            console.log({
                author: username,
                date_commented: currentDate,
                post_id: postId,
                userAvatar: userImage,
                content: commentContent
            });
    
            // Create document in Appwrite
            await databases.createDocument(DATABASE_ID, COLLECTION_COMMENT_ID, uuidv4(), {
                author: username,
                date_commented: currentDate,
                post_id: postId,
                userAvatar: userImage,
                content: commentContent
            }, [
                Permission.read(Role.user(userId)),
                Permission.write(Role.user(userId)),
                Permission.delete(Role.user(userId)),
                Permission.update(Role.user(userId)),
            ]);
    
            // Reset content and fetch comments
            setCommentContent('');
            fetchComments();
    
        } catch (error) {
            console.log(error, 'Error submitting comment');
        }
    };
    

    const fetchComments = async () => {
        try {
            const comments = await databases.listDocuments(DATABASE_ID, COLLECTION_COMMENT_ID, [Query.equal('post_id', [`${postId}`])]);
            setComments(comments.documents);
            setCommentNum(comments.documents.length);
        } catch (error) {
            console.log(error, 'Error fetching comments');
        }
    };

    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId]);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setShowComments(currentScrollY < lastScrollY); // Show comments when scrolling up
            lastScrollY = currentScrollY;
        };

        const checkIfMobileOrMedium = () => {
            return window.innerWidth <= 1024; // Adjust threshold for medium devices (tablet)
        };

        if (checkIfMobileOrMedium()) {
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    

    return (
        <div className={`${theme.backgroundColor} ${theme.backgroundColor === 'bg-black' ? 'text-white' : 'text-black'} lg:h-full  mx-auto xl:px-[20rem] `} >
         <div className={`flex gap-[5rem] lg:flex-row flex-col px-5 lg:w-full ${theme.backgroundColor}`}>
    <div className='flex-1'> {/* Left side for post content */}
        <h1 className='text-3xl text-orange-500 mb-2 ml-2 mt-3 font-mono text-center'>BlogInn</h1>
        <div className='flex flex-col mt-5'>
            <div className='w-16 h-16 flex mb-4'>
                <img className='w-full h-full object-cover rounded-full shadow-lg' src={post.Avatar} alt="Author Avatar" />
            </div>
            <div className='flex flex-col'>
                <p className='text-lg font-semibold'>Author: {post.Author}</p>
                <p className='text-gray-600'>{post.dateCreated}</p>
            </div>
            <div className='mt-2 flex justify-end'>
                <p className='italic mr-2'>Category: {post.Category}</p>
            </div>
            <div className='md:w-full flex items-center justify-center mt-5 mb-10'>
                <img className='md:w-[50%] md: max-h-[300px] object-cover rounded-2xl border border-gray-200 shadow-md' 
                src={post.postImage} 
                alt="Post" />
            </div>
            <h1 className='text-center text-3xl font-bold mt-5'>{post.Title}</h1>
            <p className='text-center mt-4 px-4 md:px-0'>{post.Content}</p>
        </div>
        <div className="mt-10 border-b-2 border-b-gray-300 w-full"></div>
    </div>
    
    {/* Right side text */}
    <div className='flex-1 hidden mt-[10rem]  lg:block text-white'> {/* Take full width on large screens */}
        <div className='p-6'>
        <OtherPosts userPosts={userPosts} author={post.Author} />

        </div>
        <div>
        <CommentSection
                    comments={comments}
                    setCommentContent={setCommentContent}
                    commentContent={commentContent}
                    submitPost={submitPost}
                    commentNum={commentNum}
                    userImage={userImage}

                />
                
        </div>
    </div>
</div>
            

            {showComments && (
    <div className="lg:hidden md:flex md:justify-center md:w-full mt-8">
        <div className="md:w-3/4"> {/* Adjust width as needed */}
            <CommentSection
                comments={comments}
                setCommentContent={setCommentContent}
                commentContent={commentContent}
                submitPost={submitPost}
                commentNum={commentNum}
                userImage={userImage}
            />
        </div>
    </div>
)}


<div className={`${theme.backgroundColor} lg:w-[50%]   ${theme.backgroundColor === 'bg-black' ? 'text-white' : 'text-black'} `}>
    
    
    <OtherPosts userPosts={userPosts} author={post.Author} />
    
</div>

            <div className="flex justify-center lg:justify-start lg:ml-5 pb-10  items-center pt-[2rem] ">
                <button
                    onClick={() => navigate('/home')}
                    className="flex items-center bg-blue-500 text-white font-semibold rounded-lg px-6 py-3 shadow-md hover:bg-blue-600 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M10 3a1 1 0 01.6.2l7 5A1 1 0 0118 10h-1v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7H1a1 1 0 01-.6-1.8l7-5A1 1 0 0110 3zm0 2.5L4 9v8h3v-5h6v5h3V9l-6-4.5z" />
                    </svg>
                    Home
                </button>
            </div>
        </div>
    );
}

export default FullPost;