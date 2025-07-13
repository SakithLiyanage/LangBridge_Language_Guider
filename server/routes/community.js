const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Post, Resource } = require('../models/Community');

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const { category, language, page = 1, limit = 10 } = req.query;
    let query = {};

    if (category) query.category = category;
    if (language) query.language = language;

    const posts = await Post.find(query)
      .populate('author', 'username')
      .populate('replies.author', 'username')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
});

// Create new post
router.post('/posts', auth, async (req, res) => {
  try {
    console.log('Creating post with data:', req.body);
    console.log('User ID:', req.user.id);
    
    const { title, content, category, language, tags } = req.body;
    
    const post = new Post({
      author: req.user.id,
      title,
      content,
      category: category || 'general',
      language,
      tags: tags || []
    });

    console.log('Post object:', post);
    await post.save();
    console.log('Post saved successfully');
    await post.populate('author', 'username');
    
    // Award XP and update progress
    try {
      const Progress = require('../models/Progress');
      let progress = await Progress.findOne({ userId: req.user.id });
      if (!progress) progress = new Progress({ userId: req.user.id });
      progress.xpPoints = (progress.xpPoints || 0) + 10;
      progress.skills = progress.skills || {};
      progress.skills.community = Math.min(100, (progress.skills.community || 0) + 10);
      progress.lastActivityDate = new Date();
      await progress.save();
    } catch (progressError) {
      console.log('Progress update failed (community post):', progressError.message);
    }
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
});

// Get single post
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('replies.author', 'username')
      .populate('likes', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.viewCount += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
});

// Reply to post
router.post('/posts/:id/reply', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.replies.push({
      author: req.user.id,
      content
    });

    await post.save();
    await post.populate('replies.author', 'username');
    
    // Award XP and update progress
    try {
      const Progress = require('../models/Progress');
      let progress = await Progress.findOne({ userId: req.user.id });
      if (!progress) progress = new Progress({ userId: req.user.id });
      progress.xpPoints = (progress.xpPoints || 0) + 5;
      progress.skills = progress.skills || {};
      progress.skills.community = Math.min(100, (progress.skills.community || 0) + 5);
      progress.lastActivityDate = new Date();
      await progress.save();
    } catch (progressError) {
      console.log('Progress update failed (community reply):', progressError.message);
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add reply', error: error.message });
  }
});

// Like/unlike post
router.post('/posts/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json({ likes: post.likes.length, isLiked: likeIndex === -1 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like post', error: error.message });
  }
});

// Get user resources
router.get('/resources', async (req, res) => {
  try {
    const { type, language, difficulty, page = 1, limit = 10 } = req.query;
    let query = {}; // Remove isApproved filter to show all resources

    if (type) query.type = type;
    if (language) query.language = language;
    if (difficulty) query.difficulty = difficulty;

    const resources = await Resource.find(query)
      .populate('author', 'username')
      .sort({ rating: -1, downloads: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Resource.countDocuments(query);

    res.json({
      resources,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Failed to fetch resources:', error);
    res.status(500).json({ message: 'Failed to fetch resources', error: error.message });
  }
});

// Create new resource
router.post('/resources', auth, async (req, res) => {
  try {
    console.log('Creating resource with data:', req.body);
    console.log('User ID:', req.user.id);
    
    const { title, description, type, language, difficulty, content, tags } = req.body;
    
    const resource = new Resource({
      author: req.user.id,
      title,
      description,
      type,
      language,
      difficulty: difficulty || 'intermediate',
      content,
      tags: tags || [],
      isApproved: true // Set to true for testing
    });

    console.log('Resource object:', resource);
    await resource.save();
    console.log('Resource saved successfully');
    await resource.populate('author', 'username');
    
    // Award XP and update progress
    try {
      const Progress = require('../models/Progress');
      let progress = await Progress.findOne({ userId: req.user.id });
      if (!progress) progress = new Progress({ userId: req.user.id });
      progress.xpPoints = (progress.xpPoints || 0) + 15;
      progress.skills = progress.skills || {};
      progress.skills.community = Math.min(100, (progress.skills.community || 0) + 15);
      progress.lastActivityDate = new Date();
      await progress.save();
    } catch (progressError) {
      console.log('Progress update failed (community resource):', progressError.message);
    }
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ message: 'Failed to create resource', error: error.message });
  }
});

// Rate resource
router.post('/resources/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body; // 1-5 stars
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Update average rating
    const newCount = resource.rating.count + 1;
    const newAverage = ((resource.rating.average * resource.rating.count) + rating) / newCount;
    
    resource.rating = {
      average: newAverage,
      count: newCount
    };

    await resource.save();
    res.json(resource.rating);
  } catch (error) {
    res.status(500).json({ message: 'Failed to rate resource', error: error.message });
  }
});

// Download resource
router.post('/resources/:id/download', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.downloads += 1;
    await resource.save();

    res.json({ downloads: resource.downloads });
  } catch (error) {
    res.status(500).json({ message: 'Failed to download resource', error: error.message });
  }
});

// Get user's posts and resources
router.get('/my-content', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    const resources = await Resource.find({ author: req.user.id }).sort({ createdAt: -1 });

    res.json({ posts, resources });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user content', error: error.message });
  }
});

// Search posts and resources
router.get('/search', async (req, res) => {
  try {
    const { q, type } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(q, 'i');
    let results = {};

    if (!type || type === 'posts') {
      const posts = await Post.find({
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { tags: searchRegex }
        ]
      }).populate('author', 'username').limit(10);
      results.posts = posts;
    }

    if (!type || type === 'resources') {
      const resources = await Resource.find({
        isApproved: true,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex }
        ]
      }).populate('author', 'username').limit(10);
      results.resources = resources;
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search', error: error.message });
  }
});

// Get trending topics
router.get('/trending', async (req, res) => {
  try {
    const trendingPosts = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $addFields: {
          score: { $add: ['$viewCount', { $multiply: ['$likes', 2] }] }
        }
      },
      {
        $sort: { score: -1 }
      },
      {
        $limit: 5
      }
    ]);

    const trendingResources = await Resource.aggregate([
      {
        $match: { isApproved: true }
      },
      {
        $addFields: {
          score: { $add: ['$downloads', { $multiply: ['$rating.average', 10] }] }
        }
      },
      {
        $sort: { score: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({ posts: trendingPosts, resources: trendingResources });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trending content', error: error.message });
  }
});

module.exports = router; 