// central place for backend endpoints (change for your backend or env vars)
export const API_ENDPOINTS = {
  login: "/api/auth/login",
  signup: "/api/auth/register",
  oauth: {
    google: "/api/auth/google",
    github: "/api/auth/github",
  },
};
