import React, { useState } from 'react';
import { FaRegComment } from 'react-icons/fa'; 
import { SlLike, SlDislike } from 'react-icons/sl'; 

function CommentSection({
    comments,
    setCommentContent,
    commentContent,
    submitPost,
    commentNum,

}) {
    const [showCommentBox, setShowCommentBox] = useState(false);
    


    return (
        <div className=''>
            <div className={`bg-[#31363F] lg:hidden w-[90%] md:w-[80%] lg:w-[30%] h-[4rem] fixed lg:top-[50%] lg:right-[0]  bottom-0 z-10 mx-5 flex items-center justify-center py-5 shadow-xl rounded-t-2xl`}>
                <div>
                    <div className='flex flex-row gap-[3rem] md:gap-[5rem] items-center'>
                        <button
                            onClick={() => setShowCommentBox(!showCommentBox)} // Toggle only the comment box
                            className='flex items-center gap-2 px-2 py-1 rounded-xl'>
                            <FaRegComment style={{ color: 'orange' }} />
                            <span>{commentNum}</span>
                        </button>
                        <div className='flex items-center gap-2 px-2 py-1 rounded-xl'>
                            <div><SlLike style={{ color: 'orange' }} /></div>
                            <div><p>10</p></div>|<SlDislike style={{ color: 'orange' }} />
                        </div>
                    </div>
                    {showCommentBox && (
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
            <div className='text-white lg:block hidden'>

            <div className={` bottom-[3.5rem] left-0 w-full  px-10 transform transition-all duration-300 ease-in-out`}>
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
                                      
         </div>
        </div>
    );
}

export default CommentSection;