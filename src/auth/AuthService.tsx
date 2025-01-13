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

const change = async (field: 'name' | 'password', value: string): Promise<string | null> => {
  try {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty or invalid.`);
    }

    const token = getToken();
    if (!token) {
      throw new Error('Unauthorized. Please log in again.');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const payload = { [field]: value };

    const response = await axios.put(`${API_URL}/change`, payload, config);

    if (response.data.message) {
      return null; // Success, no error to return
    }

    return response.data.error || 'Unknown error occurred. Please try again.';
  } catch (error: any) {
    return error.response?.data?.error || error.message || 'An error occurred. Please try again.';
  }
};

const logout = () => {
  localStorage.removeItem('token');
};

const getToken = () => {
  return localStorage.getItem('token');
};

const getUsername = () => {
  const token = getToken();
  if (!token) {
    return null;
  }
  const payload = token.split('.')[1];
  const data = JSON.parse(atob(payload));
  return data.name;
}

const AuthService = {
  register,
  login,
  logout,
  getToken,
  getUsername,
  change
};

export default AuthService;
