export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    GOOGLE_LOGIN: "/auth/google",
    REGISTER: "/auth/register",
    ME: "/auth/me",
  },

  WORKSPACE: {
    GET_ALL: "/workspaces",
    CREATE: "/workspaces",
  },

  PROJECT: {
    GET_ALL: "/projects",
    CREATE: "/projects",
  },
} as const;
