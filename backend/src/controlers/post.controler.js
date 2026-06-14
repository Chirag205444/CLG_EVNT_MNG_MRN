const postModel = require('../models/post.model');

// Create a new post (Coordinators only)
const createPost = async (req, res) => {
    try {
        const { title, description, category, venue, eventDate } = req.body;

        // Validation checks
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }
        if (!description || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: "Description is required"
            });
        }
        
        const validCategories = ['event', 'placement', 'workshop', 'hackathon', 'announcement', 'club_activity', 'others'];
        if (!category || !validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
            });
        }

        const post = await postModel.create({
            title: title.trim(),
            description: description.trim(),
            category,
            venue: venue ? venue.trim() : undefined,
            eventDate,
            createdBy: req.user._id // reference to creator
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post
        });
    } catch (err) {
        console.error("Error in createPost:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get all posts (Accessible to students & coordinators)
const getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            data: posts
        });
    } catch (err) {
        console.error("Error in getAllPosts:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get post by ID (Accessible to students & coordinators)
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await postModel.findById(id)
            .populate('createdBy', 'name email')
            .lean();

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: post
        });
    } catch (err) {
        console.error("Error in getPostById:", err);
        // Handle invalid ObjectId format
        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID format"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update a post (Coordinators only, must be owner)
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, venue, eventDate } = req.body;

        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Ownership Check
        const userId = (req.user.id || req.user._id).toString();
        if (post.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only modify your own posts"
            });
        }

        // Validation checks if fields are provided
        if (title !== undefined && !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title cannot be empty"
            });
        }
        if (description !== undefined && !description.trim()) {
            return res.status(400).json({
                success: false,
                message: "Description cannot be empty"
            });
        }
        if (category !== undefined) {
            const validCategories = ['event', 'placement', 'workshop', 'hackathon', 'announcement', 'club_activity', 'others'];
            if (!validCategories.includes(category)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
                });
            }
        }

        // Update fields
        if (title !== undefined) post.title = title.trim();
        if (description !== undefined) post.description = description.trim();
        if (category !== undefined) post.category = category;
        if (venue !== undefined) post.venue = venue.trim();
        if (eventDate !== undefined) post.eventDate = eventDate;

        const updatedPost = await post.save();

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost
        });
    } catch (err) {
        console.error("Error in updatePost:", err);
        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID format"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete a post (Coordinators only, must be owner)
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Ownership Check
        const userId = (req.user.id || req.user._id).toString();
        if (post.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only modify your own posts"
            });
        }

        await postModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (err) {
        console.error("Error in deletePost:", err);
        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID format"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};
