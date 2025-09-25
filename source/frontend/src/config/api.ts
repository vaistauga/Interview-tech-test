export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL,
  ENDPOINTS: {
    USERS: '/api/v1/users',
    USERS_IMPORT: '/api/v1/users/import',
    USERS_IMPORT_FILE_UPLOAD: '/api/v1/users/import-file-upload',
    USERS_IMPORT_FILE_STATUS: '/api/v1/users/import-file-upload',
    ACCOUNTS: '/api/v1/accounts',
  },
  TIMEOUT: 10000,
} as const;
