import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

interface AuthResponse {
  token: string;
}

const register = async (name: string, password: string): Promise<string | null> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, { name, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return null;
  } catch (error: any) {
    return error.response?.data?.error || 'Registration failed. Please try again.';
  }
};

const login = async (name: string, password: string): Promise<string | null> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, { name, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return null;
  } catch (error: any) {
    return error.response?.data?.error || 'Login failed. Please check your credentials.';
  }
};

const logout = () => {
  localStorage.removeItem('token');
};

const getToken = () => {
  return localStorage.getItem('token');
};

const AuthService = {
  register,
  login,
  logout,
  getToken,
};

export default AuthService;
