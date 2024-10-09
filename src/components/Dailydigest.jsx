import React from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

function DailyDigest({ dailyDigestPosts, userAvatars }) {
  const navigate = useNavigate();

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
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Daily Diest</h2>
      {dailyDigestPosts.slice(0, 3).map((post, index) => ( // Limit to 3 posts
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
  );
}

export default DailyDigest;
