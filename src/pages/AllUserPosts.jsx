import React, { useState, useEffect } from 'react';
import { bucket, BUCKET_ID, account, DATABASE_ID, COLLECTION_ID, COLLECTION_PROFILE_ID, databases, COLLECTION_COMMENT_ID } from '../appwrite/appwriteconfig';
import { ID, Permission, Role, Query } from 'appwrite';
import { ThemeContext } from '../components/ThemeProvider';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegComment } from "react-icons/fa";
import { SlLike, SlDislike } from "react-icons/sl";
import { useParams } from 'react-router-dom';
import { RiDeleteBin6Fill } from "react-icons/ri";

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
        console.log('its here');
      }
    };
    fetchAvatar();
  }, []);

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
        <div className="flex flex-col items-center gap-8">
          {posts.length === 0 ? (
            <div className="text-center text-gray-700 mt-5">
              <p className="text-lg">Hey Blogger, you haven't made any post yet</p>
              <Link to='/addPost'>
                <button className="px-4 py-2 mt-4 rounded bg-orange-500 text-white hover:bg-orange-600 transition">Add First Post</button>
              </Link>
            </div>
          ) : (
            posts.map((post, index) => (
              <div key={index}
                onClick={() => {
                  navigate(`/Profile/${user}/${post.Category}/${post.$id}`, { replace: true });
                }}
                className="mt-2 shadow-lg h-auto w-full max-w-4xl py-4 px-6 flex flex-col bg-white rounded-xl transition-transform hover:scale-105">
                <div className="flex justify-between items-center mb-4 text-gray-600">
                  <p>{post.dateCreated}</p>
                  <p>You</p>
                  <img className="h-10 w-10 rounded-full object-cover" src={avatar} alt="Avatar" />
                </div>
                <h1 className="text-2xl font-bold mb-2">{post.Title}</h1>
                <div className="flex h-auto items-center mb-4">
                  <p className="flex-1 text-gray-700">{post.Content}</p>
                  <div className="w-40 h-40 ml-4">
                    <img className="w-full h-full object-cover rounded-lg shadow-sm" src={post.postImage} alt="Post" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center text-gray-500">
                    <p className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
                      <FaRegComment />
                      <span>{commentCounts[post.$id] || 0}</span>
                    </p>
                    <div className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full">
                      <SlLike />
                      <p>10</p>
                      <SlDislike />
                      <RiDeleteBin6Fill />
                    </div>
                  </div>
                  <button className="bg-gray-200 text-gray-700 py-1 px-4 rounded-full">{post.Category}</button>
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
