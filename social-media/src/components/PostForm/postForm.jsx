import React, { useState, useContext } from 'react';
import axios from 'axios';
import { PostContext } from '/src/contextapi/postcontext.jsx';
import '../PostForm/PostForm.css'
import { baseUrl } from '../../../url';

const PostForm = () => {
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const { handlePostCreated } = useContext(PostContext);
  const [isLoading, setIsLoading] = useState(false)

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    if (!content.trim()) {
      return setMessage('Content is required');
    }

    const formData = new FormData();
    formData.append('content', content);
    if (photo) formData.append('photo', photo);

    try {
      const res = await axios.post(`${baseUrl}/api/postsapi/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      handlePostCreated(res.data.post);
      setContent('');
      setPhoto(null);
      setMessage('Post created!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to create post');
    }
    finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container text-center mt-4 loading-screen">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        required
        style={{ width: '100%', padding: '8px' }}
      />
      <div className='post-content'>
      <input
       className='choose-file'
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
        style={{ marginTop: '8px'}}
      />
      <button className='post-button' type="submit" style={{ display: 'block', marginTop: '8px' }}>
        Post
      </button>
      </div>
      {message && <p>{message}</p>}
    </form>
  );
};

export default PostForm;

