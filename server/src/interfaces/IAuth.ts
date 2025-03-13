export interface IDecodedToken {
  userId: string;
  email: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface IAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
} 