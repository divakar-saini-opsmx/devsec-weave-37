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

import { createContext, useContext, useState } from "react";

type User = {
  username: string;
  authenticated: boolean;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(null);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

