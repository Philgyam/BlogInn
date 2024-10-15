import React from 'react';
import { useNavigate } from 'react-router-dom';

const OtherPosts = ({ userPosts, author }) => {
    const navigate = useNavigate();

    const handlePostClick = (userPost) => {
        const trimmedAuthor = userPost.Author.trim(); // Trimmed author
        const trimmedCategory = userPost.Category.trim(); // Trimmed category
        const path = `/post/${trimmedAuthor}/${trimmedCategory}/${userPost.$id}`; // Updated path
        navigate(path);
    };

    return (
        <div className={`mt-10 px-5`}>
            <h2 className="text-lg text-orange-500 font-bold">Other Posts by {author}:</h2>
            {userPosts.length > 0 ? (
                <ul className="list-disc list-inside">
                    {userPosts.map((userPost) => (
                        <li
                            key={userPost.$id}
                            onClick={() => handlePostClick(userPost)} // Navigate on click
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
                                <h3 className="font-bold">{userPost.Title}</h3>
                                <p>{userPost.Content.slice(0, 100)}...</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No other posts available.</p>
            )}
        </div>
    );
};

export default OtherPosts;