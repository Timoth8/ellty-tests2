import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from './context/AuthContext';
import CommentList from './components/CommentList';
import CommentForm from './components/CommentForm';
import Login from './components/Login';
import Register from './components/Register';

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? 'https://your-backend-url.up.railway.app' : 'http://localhost:5000');

// Socket.IO connection
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || API_URL;

// Set axios base URL
axios.defaults.baseURL = API_URL;

function App() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();

  useEffect(() => {
    fetchComments();
    
    // Initialize Socket.IO connection
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    setSocket(newSocket);
    
    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Socket.IO event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('🔌 Connected to real-time server');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from real-time server');
    });

    socket.on('newComment', (newComment) => {
      console.log('📨 New comment received:', newComment);
      // Refresh comments to maintain nested structure
      fetchComments();
    });

    socket.on('commentDeleted', (deletedCommentId) => {
      console.log('🗑️ Comment deleted:', deletedCommentId);
      // Refresh comments to update the list
      fetchComments();
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('newComment');
      socket.off('commentDeleted');
    };
  }, [socket]);

  const fetchComments = async () => {
    try {
      const response = await axios.get('/api/comments');
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (commentData) => {
    try {
      await axios.post('/api/comments', commentData);
      fetchComments(); // Refresh comments after adding new one
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert(error.response?.data?.message || 'Failed to post comment');
    }
  };

  const handleCommentDelete = () => {
    fetchComments(); // Refresh comments after deletion
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Auth */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Comments</h1>
              <p className="text-gray-600">Join the conversation</p>
            </div>
            
            <div>
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comment Form - Only for authenticated users */}
        {isAuthenticated ? (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add a Comment</h2>
            <CommentForm onSubmit={handleCommentSubmit} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-center">
            <p className="text-gray-600 mb-4">
              Please login to post comments
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Login to Comment
            </button>
          </div>
        )}

        {/* Comments List - Public */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <CommentList 
            comments={comments}
            onReply={handleCommentSubmit}
            onDelete={handleCommentDelete}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {/* Register Modal */}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
