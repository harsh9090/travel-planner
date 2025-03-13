import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  DateRange as DateIcon,
  AccountBalance as BudgetIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useTrip } from '../../../contexts/TripContext';
import { Trip } from '../../../services/tripService';
import { format } from 'date-fns';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'primary';
    case 'ongoing':
      return 'success';
    case 'completed':
      return 'info';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const TripDetails = () => {
  const router = useRouter();
  const { tripId } = router.query;
  const { getTripById, deleteTrip } = useTrip();
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

  const handleEdit = () => {
    router.push(`/trips/${tripId}/edit`);
  };

  const handleDelete = async () => {
    if (trip) {
      try {
        await deleteTrip(trip._id);
        router.push('/dashboard');
      } catch (err) {
        setError('Failed to delete trip');
        console.error('Error deleting trip:', err);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!trip) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Trip not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {trip.title}
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              label={trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              color={getStatusColor(trip.status)}
            />
            <Typography variant="body1" color="textSecondary">
              Created on {format(new Date(trip.createdAt), 'MMM d, yyyy')}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ mr: 2 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Trip Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Destination
                    </Typography>
                    <Typography variant="body1">{trip.destination}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <DateIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Dates
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(trip.startDate), 'MMM d, yyyy')} -{' '}
                      {format(new Date(trip.endDate), 'MMM d, yyyy')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <BudgetIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Budget
                    </Typography>
                    <Typography variant="body1">
                      ${trip.budget.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            {trip.description && (
              <Box mt={3}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">{trip.description}</Typography>
              </Box>
            )}
          </Paper>

          {trip.activities && trip.activities.length > 0 && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Activities</Typography>
                <Button startIcon={<AddIcon />} size="small">
                  Add Activity
                </Button>
              </Box>
              <List>
                {trip.activities.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={activity.name}
                        secondary={
                          <>
                            {format(new Date(activity.date), 'MMM d, yyyy')}
                            {activity.notes && ` - ${activity.notes}`}
                            <Typography
                              component="span"
                              variant="body2"
                              color="textSecondary"
                              sx={{ display: 'block' }}
                            >
                              Cost: ${activity.cost.toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < (trip.activities?.length ?? 0) - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {trip.tips && trip.tips.length > 0 && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Travel Tips</Typography>
                <Button startIcon={<AddIcon />} size="small">
                  Add Tip
                </Button>
              </Box>
              <List>
                {trip.tips.map((tip, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={tip.content}
                        secondary={
                          <>
                            <Chip
                              label={tip.category}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                            <Typography
                              component="span"
                              variant="caption"
                              color="textSecondary"
                              sx={{ display: 'block', mt: 0.5 }}
                            >
                              Added on {format(new Date(tip.createdAt), 'MMM d, yyyy')}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < (trip.tips?.length ?? 0) - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}

          {trip.expenses && trip.expenses.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Expenses</Typography>
                <Button startIcon={<AddIcon />} size="small">
                  Add Expense
                </Button>
              </Box>
              <List>
                {trip.expenses.map((expense, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography>{expense.category}</Typography>
                            <Typography>${expense.amount.toLocaleString()}</Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            {format(new Date(expense.date), 'MMM d, yyyy')}
                            {expense.description && (
                              <Typography
                                component="span"
                                variant="body2"
                                color="textSecondary"
                                sx={{ display: 'block' }}
                              >
                                {expense.description}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    {index < (trip.expenses?.length ?? 0) - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default TripDetails; 