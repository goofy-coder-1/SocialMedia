// FriendContext.jsx
import { createContext, useContext, useState } from 'react';

const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const [refreshFriends, setRefreshFriends] = useState(false);

  const triggerRefresh = () => {
    setRefreshFriends(prev => !prev); // toggle boolean to trigger effects
  };

  return (
    <FriendContext.Provider value={{ refreshFriends, triggerRefresh }}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriendContext = () => useContext(FriendContext);
