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

export type IUserTableFilterValue = string | string[];

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: string;
  phoneNumber: string;
  email: string;
};
