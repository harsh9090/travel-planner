import axiosInstance from '../utils/axiosInstance';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
}   

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    location?: string;
    bio?: string;
    favoriteDestinations?: string[];
    travelPreferences?: {
      preferredTransport: string;
      accommodationType: string;
      budget: string;
    };
  };
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): AuthResponse['user'] | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}; 