export type UserImportType = {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    language?: string;
    active?: '0' | '1' | 0 | 1;
    role?: string; // Role code
    branch?: string; // Branch name
    groups?: string; // Group names
    companyName?: string;
    department?: string;
    manager?: string;
    country?: string;
    jobTitle?: string;
    mobilePhone?: string;
    officeLocation?: string;
    managerEmail?: string;
    goPhishPosition?: string;
  };
  
  export const USER_IMPORT_TYPE_KEYS: (keyof UserImportType)[] = [
    'username',
    'firstName',
    'lastName',
    'email',
    'language',
    'active',
    'role',
    'branch',
    'groups',
    'companyName',
    'department',
    'manager',
    'country',
    'jobTitle',
    'mobilePhone',
    'officeLocation',
    'managerEmail',
    'goPhishPosition',
  ];
  