export enum Role {
  DONOR = 'DONOR',
  RECIPIENT = 'RECIPIENT',
  VERIFIER = 'VERIFIER',
  ADMIN = 'ADMIN',
}

export const ROLE_VALUES = Object.values(Role) as string[];