export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isModified(field: string): boolean;
  createdAt: Date;
  updatedAt: Date;
} 