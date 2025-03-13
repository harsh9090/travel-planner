import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { login } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setIsLoading(true);

    try {
      // Make the API call
      const response = await axiosInstance.post('/auth/login', formData);
      
      // Check if we have valid data
      if (response.data?.token && response.data?.user) {
        await login(response.data.token, response.data.user);
        router.push('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        // Handle specific error cases
        if (err.response?.status === 401) {
          setError('Invalid email or password');
        } else if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else if (!err.response) {
          setError('Network error. Please check your connection.');
        } else {
          setError('An error occurred during login. Please try again.');
        }
        console.error('Login error:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
      } else {
        setError('An unexpected error occurred');
        console.error('Unexpected error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Welcome Back
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 4 }}>
          Sign in to continue to your account
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          noValidate
          sx={{ 
            '& form': { display: 'contents' },
            '& button[type="submit"]': { display: 'block' }
          }}
        >
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="email"
            autoFocus
            error={!!error}
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="current-password"
            error={!!error}
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading || !formData.email || !formData.password}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Don&apos;t have an account?{' '}
            <Link 
              href="/register" 
              style={{
                color: theme.palette.primary.main,
                textDecoration: 'none'
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 