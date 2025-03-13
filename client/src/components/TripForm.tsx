import React from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Alert,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { Trip, CreateTripData } from '../services/tripService';
import { useTrip } from '../contexts/TripContext';
import { useRouter } from 'next/router';

interface TripFormProps {
  initialData?: Trip;
  mode: 'create' | 'edit';
}

const TripForm: React.FC<TripFormProps> = ({ initialData, mode }) => {
  const router = useRouter();
  const { createTrip, updateTrip } = useTrip();
  const [error, setError] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<CreateTripData>({
    defaultValues: {
      title: initialData?.title || '',
      destination: initialData?.destination || '',
      startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
      endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(),
      budget: initialData?.budget || 0,
      description: initialData?.description || ''
    }
  });

  const startDate = watch('startDate');

  const onSubmit = async (data: CreateTripData) => {
    try {
      if (mode === 'create') {
        await createTrip(data);
        router.push('/dashboard');
      } else if (initialData) {
        await updateTrip(initialData._id, data);
        router.push(`/trips/${initialData._id}`);
      }
    } catch (err:unknown) {
      setError('Failed to save trip. Please try again.');
      console.error('Error saving trip:', err);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {mode === 'create' ? 'Create New Trip' : 'Edit Trip'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Trip Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="destination"
              control={control}
              rules={{ required: 'Destination is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Destination"
                  fullWidth
                  error={!!errors.destination}
                  helperText={errors.destination?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="startDate"
              control={control}
              rules={{ required: 'Start date is required' }}
              render={({ field }) => (
                <DatePicker
                  label="Start Date"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startDate,
                      helperText: errors.startDate?.message
                    }
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="endDate"
              control={control}
              rules={{
                required: 'End date is required',
                validate: (value) =>
                  value >= startDate || 'End date must be after start date'
              }}
              render={({ field }) => (
                <DatePicker
                  label="End Date"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  minDate={startDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate?.message
                    }
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="budget"
              control={control}
              rules={{
                required: 'Budget is required',
                min: { value: 0, message: 'Budget must be positive' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Budget"
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                  error={!!errors.budget}
                  helperText={errors.budget?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : mode === 'create'
                  ? 'Create Trip'
                  : 'Save Changes'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default TripForm; 