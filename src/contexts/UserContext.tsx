import React, { createContext, useState, useEffect } from 'react';
import type { User } from '../types/DBTypes';
import { useAuthentication } from '../hooks/apiHooks';

type AuthContextType = {
  user: User | null;
  handleLogin: (newUser: User) => void;
  handleLogout: () => void;
};

const UserContext = createContext<AuthContextType | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const { getUserByToken } = useAuthentication();

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };


  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      

      if (token) {
        try {
          const userData = await getUserByToken(token);
          setUser(userData.user ? userData.user : userData);
        } catch { 
          
          console.error('Token check failed. You have been logged out.');
          localStorage.removeItem('token');
        }
      }
    };

    checkToken();
  }, []);

  return (
    <UserContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };