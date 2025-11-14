import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CommentForm = ({ onSubmit, onCancel, isReply = false }) => {
  const [content, setContent] = useState('');
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('Please enter a comment');
      return;
    }

    onSubmit({
      content: content.trim()
    });

    // Reset form
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          {isReply ? 'Your reply:' : 'Your comment:'}
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
          placeholder={isReply ? 'Write your reply...' : 'Write your comment...'}
          required
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          {isReply ? 'Post Reply' : 'Post Comment'}
        </button>
        {isReply && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;
