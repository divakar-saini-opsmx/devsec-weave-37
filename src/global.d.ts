export {};

declare global {
  interface Window {
    REACT_APP_CONFIG: {
        API_BASE_URL: string;
        API_ENDPOINTS: { 
          GOOGLE_LOGIN : string;
          GET_USER: string;
          AUTH_LOGIN: string;
          AUTH_LOGOUT: string;
          GET_HUB: string;
          CREATE_HUB: string;
          GET_REPOSITORY: string;
          GET_SAST: string;
          SAST_REMEDIATION: string;
          // Add other endpoints as needed
         
        }        
      [key: string]: any;
    };
  }
}

