// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";

// createRoot(document.getElementById("root")!).render(<App />);


import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const loadConfig = async () => {
  try {
    const res = await fetch('/app.config.json');
    console.log("Response from app.config.json:", res);
    const config = await res.json();
    window.REACT_APP_CONFIG = config;
  } catch (err) {
    console.error('Failed to load app.config.json', err);
    // Optional fallback config
    window.REACT_APP_CONFIG = {
        API_BASE_URL: "",
        API_ENDPOINTS: {
        GOOGLE_LOGIN : "/auth/google/login",
        GET_USER: "/api/v1/profile",
        AUTH_LOGIN: "/auth/login",
        AUTH_LOGOUT: "/auth/logout",
        GET_HUB: "/api/hublist",
        CREATE_HUB: "/api/createhub",
        GET_REPOSITORY: "/api/v1/projects/list/summary/",
        GET_SAST: "/api/v1/vuln/list/sast",
        SAST_REMEDIATION: "api/v1/remediations/sast"
        // Add other endpoints as needed   
      }        
    };
  }
};

loadConfig().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
