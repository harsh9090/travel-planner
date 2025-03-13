import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import TripForm from '../../components/TripForm';

const CreateTrip = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Plan Your Next Adventure
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Fill in the details below to create your new trip.
        </Typography>
      </Box>
      <TripForm mode="create" />
    </Container>
  );
};

export default CreateTrip; 