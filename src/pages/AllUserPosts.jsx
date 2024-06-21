import React, { useState, useEffect } from 'react';
import { bucket, BUCKET_ID, account, DATABASE_ID, COLLECTION_ID, COLLECTION_PROFILE_ID, databases, COLLECTION_COMMENT_ID } from '../appwrite/appwriteconfig';
import { ID, Permission, Role, Query } from 'appwrite';
import { ThemeContext } from '../components/ThemeProvider';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegComment } from "react-icons/fa";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";
import { useParams } from 'react-router-dom';

function AllUserPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [avatar, setAvatar] = useState('');
  const [user, setUser] = useState('');
  const { theme, updateTheme } = React.useContext(ThemeContext);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState({});

  // Fetch posts and comments
  const fetchPostsAndComments = async () => {
    try {
      // Fetch posts
      const postResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('postID', [`${userId}`])
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
        console.log(error);
      }
    };
    fetchAvatar();
  }, []);

  return (
    <div className=' h-screen '>
      {loading ? (
        <div className=" shadow rounded-md p-4 max-w-sm w-full mx-auto">
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
      ) : (
        <div className={`h-screen w-[100%] flex flex-col gap-10 px-5`}>
          {posts.length === 0 ? (
            <div className="text-center mt-5">
              <p>No posts by user</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <div key={index}
                onClick={() => {
                  navigate(`/Profile/${user}/${post.Category}/${post.$id}`, { replace: false });
                }}
                className={`mt-2 shadow-xl h-[15rem] w-[100%] py-2 flex flex-col transition duration-[5000ms] bg-white rounded-xl px-5`}>
                <div className='flex justify-between text-orange-500'>
                  <div className='mb-4'>
                    <p>{post.dateCreated}</p>
                  </div>
                  <div></div>
                  <div></div>
                  <p>You</p>
                  <img className='h-8 w-8 rounded-full object-fit' src={post.Avatar} alt="" />
                </div>
                <h1 className='text-[1.5rem] mb-2'>{post.Title}</h1>
                <div className='flex h-[6rem] items-center mb-4'>
                  <p>{post.Content}</p>
                  <div className='w-[50%] h-full'>
                    <img className='w-[100%] h-full' src={post.postImage} alt="" />
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div className='flex gap-5 items-center'>
                    <p className='flex items-center gap-2 bg-gray-200 px-2 rounded-xl py-1'>
                      <FaRegComment />
                      <span>{commentCounts[post.$id] || 0}</span>
                    </p>
                    <div className='flex items-center gap-2 bg-gray-200 px-2 rounded-xl py-1'>
                      <div>
                        <SlLike />
                      </div>
                      <div>
                        <p>10</p>
                      </div>
                      |
                      <SlDislike />
                    </div>
                  </div>
                  <button className='bg-slate-100 text-gray-500 py-1 px-2 rounded-2xl'>{post.Category}</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AllUserPosts;
