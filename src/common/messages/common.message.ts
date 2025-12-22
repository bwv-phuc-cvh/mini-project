export const COMMON_MESSAGE = {
  INVALID: (name: string) => `${name} invalid`,
  REQUIRED: (name: string) => `${name} is required`,
  NOT_FOUND: (name: string) => `${name} not found`,
  ALREADY_EXISTS: (name: string) => `${name} already exists`,
  FORBIDDEN: 'Forbidden',
  UNAUTHORIZED: 'Unauthorized',
  EXPIRED: (name: string) => `${name} has expired`,
  NOT_MATCH: (name: string, name2: string) => `${name} do not match ${name2}`,
};
