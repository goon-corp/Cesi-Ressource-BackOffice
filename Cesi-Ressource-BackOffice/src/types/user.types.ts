export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email?: string;
  isActive: boolean;
  userRoleId?: string;
  userRole?: UserRole;
  creationTime?: string;
}

export interface UserRole {
  id: string;
  roleLabel: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  userName?: string;
  isActive?: boolean;
  userRoleId?: string;
}
