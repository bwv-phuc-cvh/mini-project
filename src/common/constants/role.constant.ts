export const ROLES_KEY = 'roles';

export const Role = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];
