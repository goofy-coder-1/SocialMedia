import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar/navbar';
import Login from './components/accountCreation/Login';
import AccountCreation from './components/accountCreation/createaccount';
import CodeVerification from './components/accountCreation/codeVerification';
import Profile from './components/Profile/Profile';
import ProfileUpdate from './components/Profile/profileUpdate';
import Home from './components/Home/Home';
import SearchResults from './components/searchResults/searchResult';
import { UserContext } from './contextapi/usercontext';
import UserProfile from './components/searchResults/userProfile';
import PostForm from './components/PostForm/postForm';
import { PostProvider } from './contextapi/postcontext';
import Notification from './components/notification/Notification';
import FriendRequest from './components/Request/friendRequest';
import Inbox from './components/Inbox/Inbox.jsx';
import { FriendProvider } from './contextapi/Friendcontext.jsx';
import ResetPass from './components/passwordReset/resetPass.jsx';
import CodeVerifyPass from './components/passwordReset/codeverify.jsx';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <PostProvider>
          <FriendProvider>
          <NavBar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verifycodepass" element={<CodeVerifyPass />} />
            <Route path="/signin" element={<AccountCreation />} />
            <Route path='/sendcode' element={<ResetPass />} />
            <Route path="/code" element={<CodeVerification />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/update" element={<ProfileUpdate />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/postsform" element={<PostForm />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/requests" element={<FriendRequest />} />
            <Route path="/messages" element={<Inbox />} />
          </Routes>
          </FriendProvider>
        </PostProvider>
      </UserContext.Provider>
    </Router>
  );
};

export default App;
