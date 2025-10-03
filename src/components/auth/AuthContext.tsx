// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext<{
//   isAuthenticated: boolean;
//   setIsAuthenticated: (value: boolean) => void;
// }>({
//   isAuthenticated: false,
//   setIsAuthenticated: () => {},
// });

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     !!localStorage.getItem("token")
//   );

//   // Keep auth in sync with localStorage (on initial load)
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsAuthenticated(!token);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";

type User = {
  username: string;
  authenticated: boolean;
  avatar?: string;
} | null;

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Load from localStorage on mount
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const stored = localStorage.getItem('isAuthenticated');
    return stored === 'true';
  });
  
  const [user, setUser] = useState<User>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Persist to localStorage when they change
  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

