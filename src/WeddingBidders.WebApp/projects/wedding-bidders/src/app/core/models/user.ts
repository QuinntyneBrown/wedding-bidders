export interface User {
  userId: string;
  username: string;
  roles: string[];
  defaultProfileId?: string;
}

export interface Role {
  roleId: string;
  name: string;
  privileges: Privilege[];
}

export interface Privilege {
  privilegeId: string;
  roleId: string;
  aggregate: string;
  accessRight: AccessRight;
}

export enum AccessRight {
  None = 0,
  Read = 1,
  Write = 2,
  Create = 3,
  Delete = 4
}
