import React, { createContext, useState } from 'react';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  // This is the function you want to share
  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  // Also share posts so Home can render updated posts
  return (
    <PostContext.Provider value={{ posts, setPosts, handlePostCreated }}>
      {children}
    </PostContext.Provider>
  );
};
