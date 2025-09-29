export const config = {
  "API_BASE_URL": "https://ai-rem-dev-api.scanner.opsmx.org",   
  "API_ENDPOINTS": {
  "GOOGLE_LOGIN": "/auth/google/login",
  "GET_USER":"/api/v1/profile",
  "AUTH_LOGIN": "/auth/login",
  "AUTH_LOGOUT": "/auth/logout",
  "GET_HUB": "/api/v1/hubs/user/list",
  "CREATE_HUB": "/api/v1/hubs",
  "GET_REPOSITORY": "/api/v1/projects/list/summary/",
  "CREATE_REPOSITORY": "/api/v1/projects",
  "GET_SAST": "/api/v1/vuln/list/sast",
  "SAST_REMEDIATION": "/api/v1/remediations/sast",
  "GET_SCA": "/api/v1/vuln/list/sca",
  "GITHUB_PROVIDER": "/v1/github/auth/installation",
  "GET_INTEGRATIONS": "/api/v1/integrations",
  "CREATE_INTEGRATION": "/api/v1/integrations/github/create",
  "DELETE_INTEGRATION": "/api/v1/integrations/delete/",
  "GET_REPO_USER_ORG": "/api/v1/integrations/github/details"

}
}