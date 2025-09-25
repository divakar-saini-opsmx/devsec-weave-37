import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";

const AuthCallback = () => {

  const baseUrl = window.REACT_APP_CONFIG.API_BASE_URL || "";
  const getUser = window.REACT_APP_CONFIG.API_ENDPOINTS.GET_USER || "";
  
  const { setIsAuthenticated } = useAuth();  
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${baseUrl}${getUser}`, {
      method: "GET",
      credentials: "include", // crucial for cookies!
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(user => {
        console.log("User:", user);
        localStorage.setItem("token", "true");        
        setIsAuthenticated(true); // ✅ trigger rerender
        //navigate("/");
        navigate('/hub-setup');
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  
  return <div>Logging you in...</div>;
};
export default AuthCallback;