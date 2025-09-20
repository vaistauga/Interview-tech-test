export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL,
  ENDPOINTS: {
    USERS: '/api/v1/users',
    USERS_IMPORT: '/api/v1/users/import',
    ACCOUNTS: '/api/v1/accounts',
  },
  TIMEOUT: 10000,
} as const;
