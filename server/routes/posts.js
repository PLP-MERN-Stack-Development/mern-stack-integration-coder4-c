// routes/posts.js - Routes for blog posts

const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Category = require('../models/Category');

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// @route   GET /api/posts/search
// @desc    Search blog posts
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    const posts = await Post.find({
      isPublished: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } }
      ]
    })
      .populate('category', 'name slug')
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(50); // Limit search results

    res.json({
      success: true,
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @route   GET /api/posts
// @desc    Get all blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    let query = { isPublished: true };
    if (category) {
      query.category = category;
    }

    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('category', 'name slug')
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a specific blog post
// @access  Public
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid post ID'),
], handleValidationErrors, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('author', 'name');

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Increment view count
    await post.incrementViewCount();

    res.json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @route   POST /api/posts
// @desc    Create a new blog post
// @access  Public (for now)
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be less than 100 characters'),
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('author')
    .isMongoId()
    .withMessage('Valid author ID is required'),
  body('excerpt')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Excerpt must be less than 200 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),
], handleValidationErrors, async (req, res) => {
  try {
    const { title, content, category, author, excerpt, tags, isPublished } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category',
      });
    }

    const post = new Post({
      title,
      content,
      category,
      author,
      excerpt,
      tags,
      isPublished,
    });

    await post.save();

    await post.populate('category', 'name slug');
    await post.populate('author', 'name');

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Post with this title already exists',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update an existing blog post
// @access  Public (for now)
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid post ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be less than 100 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('excerpt')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Excerpt must be less than 200 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),
], handleValidationErrors, async (req, res) => {
  try {
    const { title, content, category, excerpt, tags, isPublished } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Check if category exists if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category',
        });
      }
    }

    // Update fields
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (tags !== undefined) post.tags = tags;
    if (isPublished !== undefined) post.isPublished = isPublished;

    await post.save();

    await post.populate('category', 'name slug');
    await post.populate('author', 'name');

    res.json({
      success: true,
      data: post,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Post with this title already exists',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a blog post
// @access  Public (for now)
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid post ID'),
], handleValidationErrors, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    await post.remove();

    res.json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @route   POST /api/posts/:id/comments
// @desc    Add a comment to a blog post
// @access  Public (for now)
router.post('/:id/comments', [
  param('id').isMongoId().withMessage('Invalid post ID'),
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Comment content is required'),
  body('author')
    .optional()
    .isString()
    .withMessage('Author must be a string'),
], handleValidationErrors, async (req, res) => {
  try {
    const { content, author } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // For now, use mock user ID since auth is not implemented
    const userId = '507f1f77bcf86cd799439011'; // Mock user ID

    const comment = await post.addComment(userId, content);

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

module.exports = router;