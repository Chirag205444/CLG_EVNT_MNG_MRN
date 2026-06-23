const express = require('express');
const router = express.Router();

const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getMyPosts
} = require('../controlers/post.controler');

const authMiddleware = require('../middlewares/auth.middleware');
const coordinatorMiddleware = require('../middlewares/coordinator.Middleware');

// Public route within auth context (accessible to student and coordinator)
router.get('/', authMiddleware, getAllPosts);
router.get('/my-posts', authMiddleware, coordinatorMiddleware, getMyPosts);
router.get('/:id', authMiddleware, getPostById);

// Protected routes (coordinator only)
router.post('/', authMiddleware, coordinatorMiddleware, createPost);
router.put('/:id', authMiddleware, coordinatorMiddleware, updatePost);
router.delete('/:id', authMiddleware, coordinatorMiddleware, deletePost);

module.exports = router;
