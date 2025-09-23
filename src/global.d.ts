export {};

declare global {
  interface Window {
    REACT_APP_CONFIG: {
        API_BASE_URL: string;
        API_ENDPOINTS: { 
          GOOGLE_LOGIN : string;
          AUTH_LOGIN: string;
          AUTH_LOGOUT: string;
          GET_HUB: string;
          CREATE_HUB: string;
          // Add other endpoints as needed
         
        }        
      [key: string]: any;
    };
  }
}

