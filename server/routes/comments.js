const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/auth');

// Get all comments with user data populated
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('userId', 'name avatar')
      .sort({ createdAt: 1 });
    
    // Build nested structure
    const commentMap = {};
    const rootComments = [];
    
    // First pass: create a map of all comments
    comments.forEach(comment => {
      commentMap[comment._id] = {
        ...comment.toObject(),
        replies: []
      };
    });
    
    // Second pass: build the tree structure
    comments.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap[comment.parentId];
        if (parent) {
          parent.replies.push(commentMap[comment._id]);
        }
      } else {
        rootComments.push(commentMap[comment._id]);
      }
    });
    
    res.json(rootComments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new comment (Protected - requires authentication)
router.post('/', authMiddleware, async (req, res) => {
  const comment = new Comment({
    userId: req.user._id, // Use authenticated user's ID
    content: req.body.content,
    parentId: req.body.parentId || null
  });

  try {
    const newComment = await comment.save();
    const populatedComment = await Comment.findById(newComment._id)
      .populate('userId', 'name avatar email');
    
    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.emit('newComment', populatedComment);
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a comment (Protected - user can only delete their own comments)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if the user owns this comment
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }
    
    // Delete the comment and all its replies
    await deleteCommentAndReplies(comment._id);
    
    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.emit('commentDeleted', req.params.id);
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to recursively delete comment and all replies
async function deleteCommentAndReplies(commentId) {
  // Find all replies to this comment
  const replies = await Comment.find({ parentId: commentId });
  
  // Recursively delete all replies
  for (const reply of replies) {
    await deleteCommentAndReplies(reply._id);
  }
  
  // Delete the comment itself
  await Comment.findByIdAndDelete(commentId);
}

module.exports = router;
