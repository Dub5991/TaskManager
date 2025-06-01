// UserContext.tsx - User Context Provider
import React, { createContext, useState } from 'react';
import type { User } from '../types';

// Define the shape of the user context
type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component for user context
const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };