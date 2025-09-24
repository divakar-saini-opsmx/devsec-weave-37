// import { Navigate } from "react-router-dom";


// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  

//   const isAuthenticated = !!localStorage.getItem("token");
//   console.log(`The value of isAuth is ${isAuthenticated}`);
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

// //   const token = localStorage.getItem("token");
// //   if (!token) {
// //     return <Navigate to="/login" replace />;
// //   }
  
//   return <>{children}</>;
// };

//export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;