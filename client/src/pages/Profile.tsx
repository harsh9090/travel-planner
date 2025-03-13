import React, { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Alert,
  Divider,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../utils/axiosInstance';

interface ProfileFormData {
  name: string;
  email: string;
  location: string;
  bio: string;
  favoriteDestinations: string[];
  travelPreferences: {
    preferredTransport: string;
    accommodationType: string;
    budget: string;
  };
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function Profile() {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    bio: user?.bio || '',
    favoriteDestinations: user?.favoriteDestinations || [],
    travelPreferences: {
      preferredTransport: user?.travelPreferences?.preferredTransport || 'any',
      accommodationType: user?.travelPreferences?.accommodationType || 'any',
      budget: user?.travelPreferences?.budget || 'moderate'
    },
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
        bio: user.bio || '',
        favoriteDestinations: user.favoriteDestinations || [],
        travelPreferences: {
          preferredTransport: user.travelPreferences?.preferredTransport || 'any',
          accommodationType: user.travelPreferences?.accommodationType || 'any',
          budget: user.travelPreferences?.budget || 'moderate'
        }
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    setError('');
    setSuccess('');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.put('/auth/profile', {
        name: formData.name,
        location: formData.location,
        bio: formData.bio,
        favoriteDestinations: formData.favoriteDestinations,
        travelPreferences: formData.travelPreferences
      });

      if (response.data?.user) {
        await login(response.data.token, response.data.user, false);
        setSuccess('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || 'Failed to update profile');
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.status === 200) {
        setSuccess('Password changed successfully');
        setIsChangingPassword(false);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }));
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || 'Failed to change password');
      } else {
        setError('Failed to change password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: '#2d3748',
              fontSize: '2rem',
              mr: 3
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              Profile Settings
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your account settings and preferences
            </Typography>
          </Box>
        </Box>

        {(error || success) && (
          <Alert 
            severity={error ? "error" : "success"} 
            sx={{ mb: 3 }}
            onClose={() => error ? setError('') : setSuccess('')}
          >
            {error || success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleUpdateProfile} noValidate>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Personal Information
            <Button
              onClick={() => setIsEditing(!isEditing)}
              sx={{ ml: 2 }}
              size="small"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </Typography>
          
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            disabled={!isEditing || isLoading}
            required
          />
          
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            margin="normal"
            disabled={!isEditing || isLoading}
          />
          <TextField
            fullWidth
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            disabled={!isEditing || isLoading}
          />
          <TextField
            fullWidth
            label="Favorite Destinations"
            name="favoriteDestinations"
            value={formData.favoriteDestinations.join(', ')}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              favoriteDestinations: e.target.value.split(',').map(dest => dest.trim())
            }))}
            margin="normal"
            helperText="Enter destinations separated by commas"
            disabled={!isEditing || isLoading}
          />
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Travel Preferences
          </Typography>
          
          <TextField
            select
            fullWidth
            label="Preferred Transport"
            name="travelPreferences.preferredTransport"
            value={formData.travelPreferences.preferredTransport}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              travelPreferences: {
                ...prev.travelPreferences,
                preferredTransport: e.target.value
              }
            }))}
            margin="normal"
            disabled={!isEditing || isLoading}
            SelectProps={{
              native: true
            }}
          >
            {['any', 'plane', 'train', 'car', 'bus'].map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Accommodation Type"
            name="travelPreferences.accommodationType"
            value={formData.travelPreferences.accommodationType}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              travelPreferences: {
                ...prev.travelPreferences,
                accommodationType: e.target.value
              }
            }))}
            margin="normal"
            disabled={!isEditing || isLoading}
            SelectProps={{
              native: true
            }}
          >
            {['any', 'hotel', 'hostel', 'apartment', 'resort'].map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Budget Preference"
            name="travelPreferences.budget"
            value={formData.travelPreferences.budget}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              travelPreferences: {
                ...prev.travelPreferences,
                budget: e.target.value
              }
            }))}
            margin="normal"
            disabled={!isEditing || isLoading}
            SelectProps={{
              native: true
            }}
          >
            {['budget', 'moderate', 'luxury'].map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </TextField>

          {isEditing && (
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box component="form" onSubmit={handleChangePassword} noValidate>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Change Password
            <Button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              sx={{ ml: 2 }}
              size="small"
            >
              {isChangingPassword ? 'Cancel' : 'Change'}
            </Button>
          </Typography>

          {isChangingPassword && (
            <>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                margin="normal"
                disabled={isLoading}
                required
              />
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                margin="normal"
                disabled={isLoading}
                required
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmNewPassword"
                type="password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                margin="normal"
                disabled={isLoading}
                required
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ mt: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Update Password'}
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
} 