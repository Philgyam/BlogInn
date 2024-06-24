import React, { useState, useEffect, useContext } from 'react';
import { account, databases, DATABASE_ID, COLLECTION_ID, COLLECTION_PROFILE_ID, COLLECTION_COMMENT_ID } from '../appwrite/appwriteconfig';
import { ThemeContext } from '../components/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { FaRegComment } from "react-icons/fa";
import { SlLike, SlDislike } from "react-icons/sl";
import dayjs from 'dayjs';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [userAvatars, setUserAvatars] = useState({});
  const { theme } = useContext(ThemeContext);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState({});
  const [dailyDigestPosts, setDailyDigestPosts] = useState([]);
  const navigate = useNavigate();

  const fetchUserAvatars = async () => {
    try {
      const userProfile = await databases.listDocuments(DATABASE_ID, COLLECTION_PROFILE_ID,[
        Query.equal('isArchived', [false])
      ]);
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
      selectRandomDailyDigestPosts(post.documents);

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

  const selectRandomDailyDigestPosts = (posts) => {
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    setDailyDigestPosts(shuffled.slice(0, 5));
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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} py-6`}>
      <div className="container mx-auto px-4 flex flex-col lg:flex-row">
        <div className="w-full lg:w-3/5">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className={`bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105 cursor-pointer flex border-b border-gray-300`}
                  >
                    <div className="p-3 flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-3">
                          <img className="h-8 w-8 rounded-full object-cover" src={userAvatars[post.postID]} alt="" />
                          <div>
                            <p className="text-gray-700 font-semibold text-sm">{post.Author}</p>
                            <p className="text-gray-400 text-xs">{formatDate(post.dateCreated)}</p>
                          </div>
                        </div>
                        <button className="bg-gray-200 text-gray-700 py-1 px-2 rounded-full text-xs">{post.Category}</button>
                      </div>
                      <h1 className="text-lg font-bold text-gray-900 mb-1">{post.Title}</h1>
                      <p className="text-gray-700 text-sm mb-2">{truncateContent(post.Content)}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-3 text-xs">
                          <div className="flex items-center space-x-1 text-gray-600">
                            <FaRegComment />
                            <span>{commentCounts[post.$id] || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <SlLike />
                            <span>10</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <SlDislike />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-gray-200">
                      <img className="w-full h-full object-cover" src={post.postImage} alt="" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="lg:pl-8 mt-6 lg:mt-0">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Daily Digest</h2>
            {dailyDigestPosts.map((post, index) => (
              <div key={index} className="mb-3 border-b border-gray-300 pb-2">
                <div className="flex items-center space-x-3">
                  <img className="h-6 w-6 rounded-full object-cover" src={userAvatars[post.postID]} alt="" />
                  <div>
                    <p className="text-gray-700 font-semibold text-sm">{post.Title}</p>
                    <p className="text-gray-400 text-xs">{post.Author} - {formatDate(post.dateCreated)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Follow Persons Section */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Follow Persons</h2>
            {/* Add your follow persons content here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllPosts;
