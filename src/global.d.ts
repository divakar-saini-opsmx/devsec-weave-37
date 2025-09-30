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
          CREATE_REPOSITORY: string;
          GET_SAST: string;
          SAST_REMEDIATION: string;
          GET_SCA: string;
          GITHUB_PROVIDER: string;
          GET_INTEGRATIONS: string;
          CREATE_INTEGRATION: string;
          DELETE_INTEGRATION: string;  
          GET_REPO_USER_ORG: string; 
          SCA_REMEDIATION : string; 
          DASHBOARD_OPTIMIZATION : string;
          DASHBOARD_PRIORITIZATION : string;   
          // Add other endpoints as needed         
        }        
      [key: string]: any;
    };
  }
}

