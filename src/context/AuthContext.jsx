import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../axios/AxiosInstance';
import { setAccessToken } from '../service/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [Token, setToken] = useState(null);
  const [user, setUser] = useState(0);
  const [loading, setLoading] = useState(true);

  // On app load: try to refresh access token
  useEffect(() => {
    const refresh = async () => {
      try {
          console.log('loading.....')
          const res = await axiosInstance.get('/auth/refresh'); 
          console.log(res)
          setToken(res.data.AccessToken);
          setAccessToken(res.data.AccessToken);
          setUser(res.data.user); // If you send user back from backend
          console.log('loading ended.....')
      } catch (err) {
        console.log(err)
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    refresh();
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post('/auth/login', { email, password }, { withCredentials: true });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = async () => {
    await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ Token, user, setUser, setToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
