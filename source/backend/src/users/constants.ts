import { SystemRoles } from "./enums";

export const ON_ACCOUNT_IMPORT_USERS_SEQUENCE = 'account.import.users';
export const ON_ACCOUNT_IMPORT_USERS_VALIDATION_SEQUENCE = 'account.validation.users.validation';

export const USERS_QUEUE = 'users';
export const USERS_ANALYSIS_QUEUE = 'users-analysis-queue';

export const ALLOWED_USERS_IMPORT_ROLES = [
    SystemRoles.ADMIN,
    SystemRoles.LEARNER,
];

export const CHUNK_SIZE = 20;

export const USERS_IMPORT_ERRORS = Symbol('users-import-errors');

export const usernameValidationRegex = /^[a-z0-9_\-@#.æøå]+$/;
export const usernameValidationRegexMessage =
  'username can only contain letters, numbers, and _-@#';
