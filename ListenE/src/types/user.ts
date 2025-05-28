export type IUserLoginItem = {
  email: string;
  password: string;
  remember: boolean;
};

export type IUserRegisterItem = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type IUserResetPasswordItem = {
  email: string;
  password: string;
  confirmPassword: string;
  confirmCode: string;
};

export type IUserItem = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  address: string;
  roleName: string;
  email: string;
  phoneNumber: string;
};

export type FetchUsersParams = {
  page?: number;
  size?: number;
  email?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
};

export type IUserResponseItem = {
  id: number;
  email: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  lastLogin: string;
  isActivated: boolean;
  isEmailConfirmed: boolean;
  updatedAt: string;
  createdAt: string;
  roles: string[];
};
