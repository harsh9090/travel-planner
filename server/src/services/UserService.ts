import { IUser } from '../interfaces/IUser';
import { User } from '../models/User';

export class UserService {
  // This is just a mock implementation
  private users: User[] = [];

  public async getUsers(): Promise<User[]> {
    return this.users;
  }

  public async getUserById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  public async createUser(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser = new User({
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    this.users.push(newUser);
    return newUser;
  }
} 