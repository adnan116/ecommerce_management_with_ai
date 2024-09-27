export interface IUserSignupData {
  firstName: string;
  lastName: string;
  dob: Date;
  phoneNumber: string;
  email: string;
  gender: string;
  religion: string;
  profilePicture?: string;
  username: string;
  password: string;
  createdBy: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

export interface IUserSignupResponse {
  id?: number;
  username?: string;
  email?: string;
}

export interface IUserLoginResponse {
  accessToken: string;
  userName: string;
  userInfo: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}
