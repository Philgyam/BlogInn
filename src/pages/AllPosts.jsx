import React, { useState, useEffect, useContext } from 'react';
import { account, databases, DATABASE_ID, COLLECTION_ID, COLLECTION_PROFILE_ID, COLLECTION_COMMENT_ID } from '../appwrite/appwriteconfig';
import { ThemeContext } from '../components/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { FaRegComment } from "react-icons/fa";
import { SlLike, SlDislike } from "react-icons/sl";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [userAvatars, setUserAvatars] = useState({});
  const { theme } = useContext(ThemeContext);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState({});
  const navigate = useNavigate();

  const fetchUserAvatars = async () => {
    try {
      const userProfile = await databases.listDocuments(DATABASE_ID, COLLECTION_PROFILE_ID);
      const avatars = {};
      userProfile.documents.forEach((profile) => {
        avatars[profile.profile_id] = profile.UserAvatar;
      });
      setUserAvatars(avatars);
    } catch (error) {
      console.log(error);
    }
  };

  const postFetch = async () => {
    try {
      const post = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      setPosts(post.documents);

      const comments = await databases.listDocuments(DATABASE_ID, COLLECTION_COMMENT_ID);
      const commentCounts = {};

      comments.documents.forEach((comment) => {
        const postId = comment.post_id;
        if (!commentCounts[postId]) {
          commentCounts[postId] = 0;
        }
        commentCounts[postId]++;
      });

      setCommentCounts(commentCounts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await account.get();
        setUserId(userDetails.$id);
        await fetchUserAvatars();
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userId) {
      postFetch();
    }
  }, [userId]);

  const truncateContent = (content) => {
    const words = content.split(' ');
    if (words.length > 10) {
      return words.slice(0, 10).join(' ') + '...';
    }
    return content;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} py-10`}>
      <div className="container mx-auto px-4 flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/3">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">
                  <p>No posts by user</p>
                </div>
              ) : (
                posts.map((post, index) => (
                  <div 
                    key={index}
                    onClick={() => {
                      navigate(`/profile/${post.Author}/${post.Category}/${post.$id}`, { replace: false });
                    }}
                    className={`bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105 cursor-pointer flex`}
                  >
                    <div className="p-4 flex-grow">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-4">
                          <img className="h-10 w-10 rounded-full object-cover" src={userAvatars[post.postID]} alt="" />
                          <div>
                            <p className="text-gray-700 font-semibold">{post.Author}</p>
                            <p className="text-gray-400 text-sm">{new Date(post.dateCreated).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm">{post.Category}</button>
                      </div>
                      <h1 className="text-xl font-bold text-gray-900 mb-2">{post.Title}</h1>
                      <p className="text-gray-700 mb-4">{truncateContent(post.Content)}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <FaRegComment />
                            <span>{commentCounts[post.$id] || 0}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <SlLike />
                            <span>10</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <SlDislike />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-24 h-24 bg-gray-200">
                      <img className="w-full h-full object-cover" src={post.postImage} alt="" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="hidden lg:block lg:w-1/3 lg:pl-6 mt-10 lg:mt-0">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Daily Digest</h2>
            <p className="text-gray-700">This section can be used to display daily updates, important notices, or featured content. You can populate it with dynamic or static content as needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllPosts;
