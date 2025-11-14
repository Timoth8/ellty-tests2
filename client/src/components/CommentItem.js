import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import CommentForm from './CommentForm';

const MAX_DEPTH = 3; // Maximum visual nesting depth
const REPLIES_PER_PAGE = 5; // Number of replies to show initially

const CommentItem = ({ comment, onReply, onDelete, isAuthenticated, depth = 0, parentAlignment = 'left' }) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false); // Hidden by default
  const [visibleRepliesCount, setVisibleRepliesCount] = useState(REPLIES_PER_PAGE);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year} в ${hours}:${minutes}`;
  };

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleReplySubmit = async (replyData) => {
    await onReply({ ...replyData, parentId: comment._id });
    setShowReplyForm(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment? All replies will also be deleted.')) {
      try {
        await axios.delete(`/api/comments/${comment._id}`);
        if (onDelete) {
          onDelete(comment._id);
        }
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete comment');
      }
    }
  };

  // Zig-zag pattern: replies alternate relative to their parent
  // Top level (depth 0) is always left
  // Direct children alternate based on parent: if parent is left, child is right, and vice versa
  let currentAlignment;
  let childAlignment;
  
  if (depth === 0) {
    currentAlignment = 'left';
    childAlignment = 'right';
  } else {
    // Alternate from parent
    currentAlignment = parentAlignment;
    childAlignment = parentAlignment === 'left' ? 'right' : 'left';
  }
  
  const alignmentClass = currentAlignment === 'left' ? 'ml-0' : 'ml-auto';
  
  // Check if this comment has replies
  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = comment.replies?.length || 0;
  
  // Check if current user owns this comment
  const isOwner = user && comment.userId?._id === user._id;
  
  // Pagination logic
  const visibleReplies = hasReplies ? comment.replies.slice(0, visibleRepliesCount) : [];
  const hasMoreReplies = replyCount > visibleRepliesCount;
  const remainingReplies = replyCount - visibleRepliesCount;
  
  // Check if we're at max visual depth
  const atMaxDepth = depth >= MAX_DEPTH;
  
  const handleLoadMore = () => {
    setVisibleRepliesCount(prev => prev + REPLIES_PER_PAGE);
  };
  
  const handleShowAll = () => {
    setVisibleRepliesCount(replyCount);
  };

  return (
    <div className={`mb-4 ${alignmentClass}`} style={{ maxWidth: depth === 0 ? '100%' : '95%' }}>
      <div className={`border rounded-lg p-4 ${atMaxDepth ? 'border-purple-200 bg-purple-50' : 'border-gray-200'} shadow-sm`}>
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={comment.userId?.avatar || 'https://via.placeholder.com/60'}
              alt={comment.userId?.name || 'User'}
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold text-gray-900">
                {comment.userId?.name || 'Anonymous'}
              </span>
            </div>
            
            <div className="text-sm text-orange-400 mb-3">
              {formatDate(comment.createdAt)}
            </div>

            {/* Scrollable content container */}
            <div className="max-h-96 overflow-y-auto overflow-x-auto mb-3">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <button
                  onClick={handleReplyClick}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                >
                  Reply
                </button>
              )}
              
              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                >
                  Delete
                </button>
              )}
              
              {hasReplies && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors flex items-center gap-1"
                >
                  {showReplies ? (
                    <>
                      <span>▼</span>
                      <span>Hide {replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
                    </>
                  ) : (
                    <>
                      <span>▶</span>
                      <span>Show {replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {showReplyForm && isAuthenticated && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <CommentForm 
              onSubmit={handleReplySubmit}
              onCancel={() => setShowReplyForm(false)}
              isReply={true}
            />
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {hasReplies && showReplies && (
        <div className="mt-4 space-y-4">
          {visibleReplies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              isAuthenticated={isAuthenticated}
              depth={depth + 1}
              parentAlignment={childAlignment}
            />
          ))}
          
          {/* Load More Button */}
          {hasMoreReplies && (
            <div className={`flex gap-2 items-center pt-2 ${alignmentClass}`} style={{ maxWidth: '95%' }}>
              <button
                onClick={handleLoadMore}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors px-4 py-2 border border-purple-300 rounded-lg hover:bg-purple-50"
              >
                Load {Math.min(REPLIES_PER_PAGE, remainingReplies)} more {remainingReplies === 1 ? 'reply' : 'replies'}
              </button>
              
              {remainingReplies > REPLIES_PER_PAGE && (
                <button
                  onClick={handleShowAll}
                  className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
                >
                  Show all {remainingReplies}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
