import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import TripForm from '../../../components/TripForm';
import { useTrip } from '../../../contexts/TripContext';
import { Trip } from '../../../services/tripService';

const EditTrip = () => {
  const router = useRouter();
  const { tripId } = router.query;
  const { getTripById } = useTrip();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrip = async () => {
      if (tripId && typeof tripId === 'string') {
        try {
          const tripData = await getTripById(tripId);
          setTrip(tripData);
        } catch (err) {
          setError('Failed to load trip details');
          console.error('Error loading trip:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTrip();
  }, [tripId, getTripById]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!trip) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Trip not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Trip
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Update your trip details below.
        </Typography>
      </Box>
      <TripForm mode="edit" initialData={trip} />
    </Container>
  );
};

export default EditTrip; 