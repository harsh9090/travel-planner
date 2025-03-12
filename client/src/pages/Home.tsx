import React from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Plan Your Perfect Trip
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Discover amazing destinations, manage your travel budget, and create unforgettable memories.
        </Typography>
        <Box sx={{ mt: 4 }}>
          {isAuthenticated ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={4} sx={{ mt: 6 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Smart Trip Planning
            </Typography>
            <Typography color="textSecondary">
              Plan your trips with intelligent suggestions and real-time updates.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Budget Management
            </Typography>
            <Typography color="textSecondary">
              Keep track of your expenses and stay within your budget.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Travel Insights
            </Typography>
            <Typography color="textSecondary">
              Get weather forecasts and local information for your destinations.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 