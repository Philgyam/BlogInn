import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    bucket,
    BUCKET_ID,
    account,
    DATABASE_ID,
    COLLECTION_ID,
    COLLECTION_PROFILE_ID,
    databases,
    COLLECTION_COMMENT_ID
} from '../appwrite/appwriteconfig';
import { ThemeContext } from '../components/ThemeProvider';
import { FaRegComment } from "react-icons/fa";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";
import { v4 as uuidv4 } from 'uuid';
import { Permission, Query, Role } from 'appwrite';

function FullPost() {
    const { id } = useParams();
    const { theme } = useContext(ThemeContext);

    const [post, setPost] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [commentBox, setCommentBox] = useState(false);
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
                const post = await databases.getDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    id
                );
                setPost(post);
                setUserImage(post.Avatar);
                setPostId(post.$id);
                fetchUserPosts(post.Author); // Fetch posts from the same user
            } catch (error) {
                console.log(error, 'Error fetching post');
            }
        };
        userPost();
    }, [id]);

    const fetchUserPosts = async (author) => {
        try {
            const userPosts = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.equal('Author', [author])]
            );
            setUserPosts(userPosts.documents);
        } catch (error) {
            console.log(error, 'Error fetching user posts');
        }
    };

    useEffect(() => {
        let lastScrollY = 0;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setShowComments(currentScrollY <= lastScrollY);
            lastScrollY = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const userDetails = await account.get();
                const userProfile = await databases.getDocument(DATABASE_ID, COLLECTION_PROFILE_ID, userDetails.$id);
                setUserImage(userProfile.UserAvatar);
                setUsername(userProfile.username);
                setUserId(userDetails.$id);
            } catch (error) {
                console.log(error, 'Error fetching user profile');
            }
        };
        fetchAvatar();
    }, []);

    const submitPost = async () => {
        try {
            if (!commentContent) return;
            await databases.createDocument(DATABASE_ID, COLLECTION_COMMENT_ID, uuidv4(), {
                author: username,
                date_commented: currentDate,
                post_id: postId,
                userAvatar: userImage,
                content: commentContent
            }, [
                Permission.read(Role.any()),
                Permission.write(Role.user(userId)),
                Permission.delete(Role.user(userId)),
                Permission.update(Role.user(userId)),
            ]);
            setCommentContent('');
            fetchComments();
        } catch (error) {
            console.log(error, 'Error submitting comment');
        }
    };

    const fetchComments = async () => {
        try {
            const comments = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_COMMENT_ID,
                [Query.equal('post_id', [`${postId}`])]
            );
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

    return (
        <div className={`${theme.backgroundColor}  ${theme.backgroundColor === 'bg-black' ? ' text-white' : 'text-white'}`}>

<div className={`flex flex-col px-5 w-full ${theme.backgroundColor}`}>
    <h1 className='text-3xl text-orange-500 mb-2 ml-2 mt-3 font-mono text-center'>BlogInn</h1>
    
    <div className='flex flex-col  mt-5'>
        <div className='w-16 h-16 flex mb-4'>
            <img className='w-full h-full object-cover rounded-full shadow-lg' src={post.Avatar} alt="Author Avatar" />
        </div>
        
        <div className='flex flex-col '>
            <p className='text-lg font-semibold'>Author: {post.Author}</p>
            <p className='text-gray-600'>{post.dateCreated}</p>
        </div>
        
        <div className='mt-2 flex justify-end'>
    <p className='italic mr-2'>Category: {post.Category}</p>
    
</div>

        
        <div className='w-full mt-5 mb-10'>
            <img className='w-full max-h-[400px] object-cover rounded-lg border border-gray-200 shadow-md' src={post.postImage} alt="Post" />
        </div>

        <h1 className='text-center text-3xl font-bold mt-5'>{post.Title}</h1>

        <p className='text-center mt-4 px-4 md:px-0'>{post.Content}</p>
    </div>
   
    <div className="mt-10 border-b-2 border-b-gray-300 w-full"></div>
</div>

            {showComments && (
                <div className=''>
                    <div className={`bg-[#31363F] w-[90%] md:w-[80%] lg:w-[70%] h-[4rem] fixed bottom-0 z-10 mx-5 flex items-center justify-center py-5 shadow-xl rounded-t-2xl`}>
                        <div>
                            <div className='flex flex-row gap-[3rem] md:gap-[5rem] items-center'>
                                <button
                                    onClick={() => setCommentBox(!commentBox)}
                                    className='flex items-center gap-2  px-2 py-1 rounded-xl'>
                                    <FaRegComment 
                                    style={{
                                        color:'orange'
                                    }}
                                    />
                                    <span>{commentNum}</span>
                                </button>
                                <div className='flex items-center gap-2  px-2 py-1 rounded-xl'>
                                    <div><SlLike
                                    style={{
                                        color:'orange'
                                    }} 
                                    /></div>
                                    <div><p>10</p></div>|<SlDislike
                                    style={{
                                        color:'orange'
                                    }}
                                    />
                                </div>
                            </div>
                            {commentBox && (
    <div className={`absolute bottom-[3.5rem] left-0 w-full transform transition-all duration-300 ease-in-out`}>
        <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-t-xl shadow-2xl border border-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <h2 className="text-lg font-semibold text-white">Comments</h2>
                    </div>
                    <span className="text-sm text-gray-400">{comments.length} comments</span>
                </div>

                {/* Comments List */}
                <div className="h-[12rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent px-4">
                    {comments.map((comment, index) => (
                        <div
                            key={index}
                            className="flex items-start p-3 my-2 bg-gray-800/50 backdrop-blur-sm rounded-lg 
                                     border border-gray-700/50 hover:border-gray-600 transition-all duration-200
                                     hover:bg-gray-800/70 group"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-orange-500/20 
                                              group-hover:ring-orange-500/40 transition-all duration-200">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={comment.userAvatar || 'default-avatar.png'}
                                        alt={`${comment.author}'s avatar`}
                                    />
                                </div>
                            </div>
                            <div className="ml-3 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-orange-500">{comment.author}</span>
                                    <span className="text-xs text-gray-500">•</span>
                                    <span className="text-xs text-gray-500">just now</span>
                                </div>
                                <p className="mt-1 text-gray-300 text-sm leading-relaxed">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="px-4 py-3 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800">
                    <div className="flex items-center gap-3">
                       
                        <input
                            name="comment"
                            onChange={(e) => setCommentContent(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                            text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 
                            focus:ring-orange-500/50 focus:border-transparent transition-all duration-200"
                        
                            type="text"
                            value={commentContent || ''}
                            placeholder="Add a comment..."
                        />
                        <button
                            onClick={submitPost}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2
                            hover:bg-orange-600 focus:ring-2 focus:ring-orange-500/50 focus:outline-none
                            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}

                        </div>
                    </div>
                </div>
            )}

<div className={`mt-10  ${theme.backgroundColor} ${theme.backgroundColor === 'bg-black' ? 'text-white' : 'text-black'} px-5`}>
    <h2 className="text-lg text-orange-500 font-bold">Other Posts by {post.Author}:</h2>
    {userPosts.length > 0 ? (
        <ul className="list-disc list-inside">
            {userPosts.map((userPost) => (
                <li 
                    key={userPost.$id} 
                    onClick={() => navigate(`/profile/${userPost.Author}/${userPost.Category}/${userPost.$id}`)}
                    className="flex items-center gap-3 mb-3 border p-3 rounded-lg shadow-lg 
                             hover:shadow-xl transition duration-300 cursor-pointer 
                             hover:border-orange-500/50 hover:bg-gray-800/50"
                >
                    {userPost.postImage && (
                        <img
                            src={userPost.postImage}
                            alt="User Post"
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                    )}
                    <div>
                        <h3 className="font-bold ">{userPost.Title}</h3>
                        <p className="">{userPost.Content.slice(0, 100)}...</p>
                    </div>
                </li>
            ))}
        </ul>
    ) : (
        <p className="text-gray-500">No other posts available.</p>
    )}
</div>

        </div>
    );
}

export default FullPost;
