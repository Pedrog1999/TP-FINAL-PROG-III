import { createContext, useContext, useState, useEffect } from 'react';
import { isLoggedIn, logout, getToken } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn()) {
      setUser({ token: getToken() });
    }
    setLoading(false);
  }, []);

  const doLogout = () => {
    setUser(null);
    logout();
  };

  const doLogin = (token) => {
    localStorage.setItem('token', token);
    setUser({ token });
  };

  return (
    <AuthContext.Provider value={{ user, loading, doLogin, doLogout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}