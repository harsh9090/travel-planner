import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { Trip } from '../services/tripService';
import { useTrip } from '../contexts/TripContext';
import { format } from 'date-fns';

interface TripListProps {
  trips: Trip[];
  showActions?: boolean;
  emptyMessage?: string;
}

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

const TripList: React.FC<TripListProps> = ({
  trips,
  showActions = true,
  emptyMessage = 'No trips found'
}) => {
  const router = useRouter();
  const { deleteTrip } = useTrip();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [tripToDelete, setTripToDelete] = React.useState<Trip | null>(null);

  const handleEditClick = (tripId: string) => {
    router.push(`/trips/${tripId}/edit`);
  };

  const handleViewClick = (tripId: string) => {
    router.push(`/trips/${tripId}`);
  };

  const handleDeleteClick = (trip: Trip) => {
    setTripToDelete(trip);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (tripToDelete) {
      try {
        await deleteTrip(tripToDelete._id);
        setDeleteDialogOpen(false);
        setTripToDelete(null);
      } catch (error) {
        console.error('Failed to delete trip:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTripToDelete(null);
  };

  if (!trips.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" color="textSecondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {trips.map((trip) => (
          <Grid item xs={12} sm={6} md={4} key={trip._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {trip.title}
                  </Typography>
                  <Chip
                    label={trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    color={getStatusColor(trip.status)}
                    size="small"
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {trip.destination}
                </Typography>
                <Typography variant="body2" paragraph>
                  {format(new Date(trip.startDate), 'MMM d, yyyy')} -{' '}
                  {format(new Date(trip.endDate), 'MMM d, yyyy')}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Budget: ${trip.budget.toLocaleString()}
                </Typography>
                {trip.description && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      mt: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {trip.description}
                  </Typography>
                )}
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Button size="small" onClick={() => handleViewClick(trip._id)}>
                    View Details
                  </Button>
                  {showActions && (
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(trip._id)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(trip)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Trip</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the trip &quot;{tripToDelete?.title}&quot;? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TripList; 