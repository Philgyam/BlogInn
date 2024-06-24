import React, { useState, useEffect, useContext } from 'react';
import { bucket, BUCKET_ID, account, DATABASE_ID, COLLECTION_ID, COLLECTION_PROFILE_ID, databases, COLLECTION_COMMENT_ID } from '../appwrite/appwriteconfig';
import { Query } from 'appwrite';
import { ThemeContext } from '../components/ThemeProvider';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegComment } from "react-icons/fa";
import { SlLike, SlDislike } from "react-icons/sl";
import { RiDeleteBin6Fill } from "react-icons/ri";
import dayjs from 'dayjs';
import { FaCloudUploadAlt } from "react-icons/fa";


function AllUserPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [avatar, setAvatar] = useState('');
  const [user, setUser] = useState('');
  const { theme, updateTheme } = useContext(ThemeContext);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Fetch posts and comments
  const fetchPostsAndComments = async () => {
    try {
      // Fetch posts
      const postResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('postID', [`${userId}`]),
        Query.equal('isArchived', [true])
      ]);

      // Fetch comments
      const commentResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_COMMENT_ID);

      // Count comments for each post
      const commentCounts = {};
      commentResponse.documents.forEach(comment => {
        const postId = comment.post_id;
        if (!commentCounts[postId]) {
          commentCounts[postId] = 0;
        }
        commentCounts[postId]++;
      });

      setPosts(postResponse.documents);
      setCommentCounts(commentCounts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, postId);
      setPosts(posts.filter(post => post.$id !== postId));
    } catch (error) {
      console.log('Error deleting post:', error);
    } finally {
      setShowModal(false);
    }
  };

  const archivePost = async (postId) => {
    try {
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, postId, {
        isArchived: false
      });
      setPosts(posts.filter(post => post.$id !== postId));
    } catch (error) {
      console.log('Error archiving post:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPostsAndComments();
    }
  }, [userId]);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const userDetailes = await account.get();
        const userProfile = await databases.getDocument(DATABASE_ID, COLLECTION_PROFILE_ID, userDetailes.$id);

        const image = userProfile.UserAvatar;
        const username = userProfile.username;

        setUser(username);
        setUserId(userDetailes.$id);
        setAvatar(image);
      } catch (error) {
        console.log('Error fetching avatar:', error);
      }
    };
    fetchAvatar();
  }, []);

  const truncateContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.slice(0, maxLength) + '...';
    }
    return content;
  };

  const formatDate = (date) => {
    const postDate = dayjs(date);
    const today = dayjs();
    const yesterday = today.subtract(1, 'day');

    if (postDate.isSame(today, 'day')) {
      return 'Today';
    } else if (postDate.isSame(yesterday, 'day')) {
      return 'Yesterday';
    } else {
      return postDate.format('MMM D, YYYY');
    }
  };

  return (
    <div className="h-screen bg-gray-100 p-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-700 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {posts.length === 0 ? (
            <div className="text-center text-gray-700 mt-5">
              <p className="text-lg">Hey Blogger,No Archived posts yet</p>
              
            </div>
          ) : (
            posts.map((post, index) => (
              <div key={index}
                onClick={() => {
                  navigate(`/Profile/${user}/${post.Category}/${post.$id}`, { replace: true });
                }}
                className="bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105 cursor-pointer flex border-b border-gray-300"
              >
                <div className="p-4 flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <img className="h-10 w-10 rounded-full object-cover" src={avatar} alt="Avatar" />
                      <div>
                        <p className="text-gray-700 font-semibold">You</p>
                        <p className="text-gray-400 text-sm">{formatDate(post.dateCreated)}</p>
                      </div>
                    </div>
                    <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm">{post.Category}</button>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 mb-2">{truncateContent(post.Title, 20)}</h1>
                  <p className="text-gray-700 mb-4">{truncateContent(post.Content, 30)}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                    <RiDeleteBin6Fill style={{color:'red'}} onClick={(e) => { e.stopPropagation(); setSelectedPostId(post.$id); setShowModal(true); }} />
                      <FaCloudUploadAlt  style={{color:'green'}} onClick={(e) => { e.stopPropagation(); archivePost(post.$id); }} />
               
                      
                     
                    </div>
                   
                  </div>
                </div>
                <div className="w-24 h-24 bg-gray-200">
                  <img className="w-full h-full object-cover" src={post.postImage} alt="Post" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this post?</p>
            <div className="flex justify-end gap-4">
              <button className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition" onClick={() => deletePost(selectedPostId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllUserPosts;
