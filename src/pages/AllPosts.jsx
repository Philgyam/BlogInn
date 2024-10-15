import React, { useState, useEffect, useContext } from 'react';
import { account, databases, DATABASE_ID, COLLECTION_ID, COLLECTION_PROFILE_ID, COLLECTION_COMMENT_ID } from '../appwrite/appwriteconfig';
import { ThemeContext } from '../components/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { FaRegComment } from "react-icons/fa";
import { SlLike, SlDislike } from "react-icons/sl";
import dayjs from 'dayjs';
import { Query } from 'appwrite';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [userAvatars, setUserAvatars] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const { theme } = useContext(ThemeContext);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState({});
  const [dailyDigestPosts, setDailyDigestPosts] = useState([]);
  const [followedUsers, setFollowedUsers] = useState({});
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

  const fetchAllUsers = async () => {
    try {
      const userProfiles = await databases.listDocuments(DATABASE_ID, COLLECTION_PROFILE_ID);
      setAllUsers(userProfiles.documents);
    } catch (error) {
      console.log(error);
    }
  };

  const postFetch = async () => {
    try {
      const post = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('isArchived', [false])
      ]);
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
    setDailyDigestPosts(shuffled.slice(0, 3));
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await account.get();
        setUserId(userDetails.$id);
        await fetchUserAvatars();
        await fetchAllUsers();
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

  const toggleFollow = (userId) => {
    setFollowedUsers((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} py-10`}>
      <div className="container mx-auto px-4 flex flex-col lg:flex-row">
        <div className="w-full lg:w-3/5">
          {loading ? (
            <div className="flex h-screen justify-center items-center bg-black">
              <span className="loader"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">
                  <p>No posts available</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div 
                    key={post.$id}
                    onClick={() => {
                      const author = post.Author.trim();
                      const category = post.Category.trim();
                      const path = `/post/${author}/${category}/${post.$id}`;
                      console.log(`Navigating to: ${path}`);
                      navigate(path, { replace: false });
                    }}
                    className={`bg-white text-green-600 shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105 cursor-pointer flex flex-col border-b border-gray-300`}
                  >
                    <div className="relative">
                      <img className="w-full h-48 object-cover" src={post.postImage} alt="" />
                      <div className="absolute bottom-0 right-0 p-2 bg-gray-800 bg-opacity-75 text-white">
                        {post.Category}
                      </div>
                    </div>
                    <div className="p-4 flex-grow">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-4">
                          <img className="h-10 w-10 rounded-full object-cover" src={userAvatars[post.postID]} alt="" />
                          <div>
                            <p className="text-gray-700 font-semibold">{post.Author}</p>
                            <p className="text-gray-400 text-sm">{formatDate(post.dateCreated)}</p>
                          </div>
                        </div>
                      </div>
                      <h1 className="text-xl font-bold text-gray-900 mb-2">{post.Title}</h1>
                      <p className="text-gray-700 mb-4">{truncateContent(post.Content)}</p>
                    </div>
                    <div className="mt-auto p-4 bg-white border-t border-gray-300 flex justify-between items-center">
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
                ))
              )}
            </div>
          )}
        
        </div>
      
        {/* Right Sidebar */}
        <div className=" lg:block lg:w-2/5 lg:pl-12 mt-10 lg:mt-0">
          {/* Daily Digest Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Daily Digest</h2>
            {dailyDigestPosts.map((post, index) => (
              <div key={index} className="mb-4 border-b border-gray-300 pb-2">
                <div className="flex items-center space-x-4">
                  <img className="h-8 w-8 rounded-full object-cover" src={userAvatars[post.postID]} alt="" />
                  <div>
                    <p className="text-gray-700 font-semibold">{post.Title}</p>
                    <p className="text-gray-400 text-sm">{post.Author} - {formatDate(post.dateCreated)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Follow Persons Section */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Follow Persons</h2>
            <div className="space-y-4">
              {allUsers.slice(0, 5).map((user) => (
                <div key={user.profile_id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img className="h-10 w-10 rounded-full object-cover" src={userAvatars[user.profile_id]} alt="" />
                    <span className="text-gray-800">{user.username}</span>
                  </div>
                  <button
                    onClick={() => toggleFollow(user.profile_id)}
                    className={`px-4 py-1 rounded-full text-xs ${
                      followedUsers[user.profile_id] ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {followedUsers[user.profile_id] ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllPosts;