import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('farmbora_user');
    const storedProfile = localStorage.getItem('farmbora_profile');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('farmbora_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('farmbora_user');
    localStorage.removeItem('farmbora_profile');
  };

  const updateProfile = (profileData) => {
    setProfile(profileData);
    localStorage.setItem('farmbora_profile', JSON.stringify(profileData));
  };

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
