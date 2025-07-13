import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/axios';
import toast from 'react-hot-toast';

const TestAPI = () => {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState('');

  const testAPI = async () => {
    try {
      console.log('Testing API connection...');
      console.log('User:', user);
      console.log('Token:', localStorage.getItem('token'));
      
      const response = await apiClient.get('/api/stats');
      console.log('API Response:', response.data);
      setTestResult(JSON.stringify(response.data, null, 2));
      toast.success('API connection successful!');
    } catch (error) {
      console.error('API Test Error:', error);
      setTestResult(`Error: ${error.message}`);
      toast.error('API connection failed');
    }
  };

  const testFlashcard = async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    try {
      const testCard = {
        word: 'test',
        translation: 'test',
        language: 'sinhala',
        targetLanguage: 'english',
        category: 'general'
      };

      console.log('Testing flashcard creation...');
      const response = await apiClient.post('/api/flashcards', testCard);
      console.log('Flashcard created:', response.data);
      setTestResult(JSON.stringify(response.data, null, 2));
      toast.success('Flashcard test successful!');
    } catch (error) {
      console.error('Flashcard Test Error:', error);
      setTestResult(`Error: ${error.response?.data?.message || error.message}`);
      toast.error('Flashcard test failed');
    }
  };

  const testCommunity = async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    try {
      const testPost = {
        title: 'Test Post',
        content: 'This is a test post',
        category: 'general',
        language: 'sinhala',
        tags: []
      };

      console.log('Testing community post creation...');
      const response = await apiClient.post('/api/community/posts', testPost);
      console.log('Post created:', response.data);
      setTestResult(JSON.stringify(response.data, null, 2));
      toast.success('Community test successful!');
    } catch (error) {
      console.error('Community Test Error:', error);
      setTestResult(`Error: ${error.response?.data?.message || error.message}`);
      toast.error('Community test failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          API Test Page
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            User Status
          </h2>
          <div className="space-y-2 text-sm">
            <p><strong>Logged in:</strong> {user ? 'Yes' : 'No'}</p>
            {user && (
              <>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user._id}</p>
              </>
            )}
            <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            API Tests
          </h2>
          <div className="space-y-4">
            <button
              onClick={testAPI}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Test Basic API Connection
            </button>
            
            <button
              onClick={testFlashcard}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ml-2"
            >
              Test Flashcard Creation
            </button>
            
            <button
              onClick={testCommunity}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 ml-2"
            >
              Test Community Post Creation
            </button>
          </div>
        </div>

        {testResult && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Test Result
            </h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm">
              {testResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAPI; 