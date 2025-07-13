import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/axios';
import toast from 'react-hot-toast';

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [resources, setResources] = useState([]);
  const [trending, setTrending] = useState({ posts: [], resources: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discussions');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateResource, setShowCreateResource] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    language: '',
    page: 1
  });

  // Form states
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
    language: 'sinhala',
    tags: []
  });

  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'vocabulary',
    language: 'sinhala',
    difficulty: 'intermediate',
    content: '',
    tags: []
  });

  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchResources();
    fetchTrending();
  }, [filters]);

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await apiClient.get(`/api/community/posts?${params}`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await apiClient.get('/api/community/resources');
      setResources(response.data.resources);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await apiClient.get('/api/community/trending');
      setTrending(response.data);
    } catch (error) {
      console.error('Failed to fetch trending content:', error);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to create posts');
      return;
    }
    
    try {
      console.log('Creating post:', newPost);
      console.log('Token:', localStorage.getItem('token'));
      console.log('User:', user);
      
      const response = await apiClient.post('/api/community/posts', newPost);
      console.log('Post created:', response.data);
      toast.success('Post created successfully!');
      setShowCreatePost(false);
      setNewPost({
        title: '',
        content: '',
        category: 'general',
        language: 'sinhala',
        tags: []
      });
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
      console.error('Error response:', error.response);
      toast.error(`Failed to create post: ${error.response?.data?.message || error.message}`);
    }
  };

  const createResource = async (e) => {
    e.preventDefault();
    
    try {
      await apiClient.post('/api/community/resources', newResource);
      toast.success('Resource created successfully!');
      setShowCreateResource(false);
      setNewResource({
        title: '',
        description: '',
        type: 'vocabulary',
        language: 'sinhala',
        difficulty: 'intermediate',
        content: '',
        tags: []
      });
      fetchResources();
    } catch (error) {
      console.error('Failed to create resource:', error);
      toast.error('Failed to create resource');
    }
  };

  const likePost = async (postId) => {
    try {
      const response = await apiClient.post(`/api/community/posts/${postId}/like`);
      // Update the post in the list
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, likes: response.data.isLiked ? [...post.likes, user._id] : post.likes.filter(id => id !== user._id) }
          : post
      ));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const addReply = async (postId) => {
    if (!replyContent.trim()) return;

    try {
      await apiClient.post(`/api/community/posts/${postId}/reply`, {
        content: replyContent
      });
      toast.success('Reply added successfully!');
      setReplyContent('');
      fetchPosts(); // Refresh to get updated replies
    } catch (error) {
      console.error('Failed to add reply:', error);
      toast.error('Failed to add reply');
    }
  };

  const rateResource = async (resourceId, rating) => {
    try {
      await apiClient.post(`/api/community/resources/${resourceId}/rate`, { rating });
      toast.success('Rating submitted!');
      fetchResources();
    } catch (error) {
      console.error('Failed to rate resource:', error);
      toast.error('Failed to submit rating');
    }
  };

  const downloadResource = async (resourceId) => {
    try {
      await apiClient.post(`/api/community/resources/${resourceId}/download`);
      toast.success('Resource downloaded!');
      fetchResources();
    } catch (error) {
      console.error('Failed to download resource:', error);
      toast.error('Failed to download resource');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Community Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect, learn, and share with fellow language learners
          </p>
        </div>

        {/* Trending Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Trending This Week</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Trending Discussions</h3>
              <div className="space-y-3">
                {trending.posts.slice(0, 3).map((post) => (
                  <div key={post._id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{post.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {post.viewCount} views • {post.likes.length} likes
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Popular Resources</h3>
              <div className="space-y-3">
                {trending.resources.slice(0, 3).map((resource) => (
                  <div key={resource._id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{resource.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {resource.downloads} downloads • ⭐ {resource.rating.average.toFixed(1)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['discussions', 'resources'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Filters and Create Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="question">Questions</option>
              <option value="discussion">Discussions</option>
              <option value="resource">Resources</option>
              <option value="cultural">Cultural</option>
              <option value="general">General</option>
            </select>
            <select
              value={filters.language}
              onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Languages</option>
              <option value="sinhala">Sinhala</option>
              <option value="tamil">Tamil</option>
              <option value="english">English</option>
            </select>
          </div>
          <button
            onClick={() => activeTab === 'discussions' ? setShowCreatePost(true) : setShowCreateResource(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            Create {activeTab === 'discussions' ? 'Post' : 'Resource'}
          </button>
        </div>

        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>by {post.author.username}</span>
                      <span>•</span>
                      <span className="capitalize">{post.category}</span>
                      <span>•</span>
                      <span className="capitalize">{post.language}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => likePost(post._id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                      post.likes.includes(user._id)
                        ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <span>❤️</span>
                    <span>{post.likes.length}</span>
                  </button>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Replies ({post.replies.length})
                  </h4>
                  <div className="space-y-3 mb-4">
                    {post.replies.slice(0, 3).map((reply, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {reply.author.username}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {reply.content}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Add a reply..."
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => addReply(post._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {resource.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    resource.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    resource.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {resource.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>by {resource.author.username}</span>
                  <span>⭐ {resource.rating.average.toFixed(1)} ({resource.rating.count})</span>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {resource.type}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded capitalize">
                    {resource.language}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => downloadResource(resource._id)}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => rateResource(resource._id, 5)}
                    className="bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700"
                  >
                    ⭐ Rate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Post</h3>
              <form onSubmit={createPost} className="space-y-4">
                <input
                  type="text"
                  placeholder="Post title"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <textarea
                  placeholder="Post content"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  required
                  rows={6}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="general">General</option>
                    <option value="question">Question</option>
                    <option value="discussion">Discussion</option>
                    <option value="resource">Resource</option>
                    <option value="cultural">Cultural</option>
                  </select>
                  <select
                    value={newPost.language}
                    onChange={(e) => setNewPost(prev => ({ ...prev, language: e.target.value }))}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="sinhala">Sinhala</option>
                    <option value="tamil">Tamil</option>
                    <option value="english">English</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreatePost(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                  >
                    Create Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Resource Modal */}
        {showCreateResource && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Resource</h3>
              <form onSubmit={createResource} className="space-y-4">
                <input
                  type="text"
                  placeholder="Resource title"
                  value={newResource.title}
                  onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <textarea
                  placeholder="Resource description"
                  value={newResource.description}
                  onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <textarea
                  placeholder="Resource content (vocabulary list, grammar rules, etc.)"
                  value={newResource.content}
                  onChange={(e) => setNewResource(prev => ({ ...prev, content: e.target.value }))}
                  required
                  rows={6}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="grid grid-cols-3 gap-4">
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value }))}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="vocabulary">Vocabulary</option>
                    <option value="grammar">Grammar</option>
                    <option value="pronunciation">Pronunciation</option>
                    <option value="cultural">Cultural</option>
                    <option value="exercise">Exercise</option>
                    <option value="other">Other</option>
                  </select>
                  <select
                    value={newResource.language}
                    onChange={(e) => setNewResource(prev => ({ ...prev, language: e.target.value }))}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="sinhala">Sinhala</option>
                    <option value="tamil">Tamil</option>
                    <option value="english">English</option>
                  </select>
                  <select
                    value={newResource.difficulty}
                    onChange={(e) => setNewResource(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateResource(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                  >
                    Create Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community; 