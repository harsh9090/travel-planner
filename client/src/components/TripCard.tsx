import { Card, CardContent, CardActions, Typography, Button, Box, Chip, CardMedia } from '@mui/material';
import { CalendarMonth, AttachMoney, LocationOn } from '@mui/icons-material';
import { useMemo } from 'react';

interface TripCardProps {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  onView?: () => void;
}

const TripCard = ({ title, destination, startDate, endDate, budget, onView }: TripCardProps) => {
  // Get a deterministic image based on the destination
  const getDestinationImage = useMemo(() => {
    const destinations: { [key: string]: string } = {
      'Paris': '/images/paris.jpg',
      'Tokyo': '/images/tokyo.jpg',
      'Santorini': '/images/santorini.jpg',
      'default': '/images/default-destination.jpg'
    };

    // Check if the destination contains any of the keys
    const matchedCity = Object.keys(destinations).find(
      city => destination.toLowerCase().includes(city.toLowerCase())
    );

    return matchedCity ? destinations[matchedCity] : destinations.default;
  }, [destination]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        }
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={getDestinationImage}
        alt={destination}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOn sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {destination}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Chip 
            icon={<CalendarMonth />} 
            label={`${formatDate(startDate)} - ${formatDate(endDate)}`}
            size="small"
            sx={{ maxWidth: '100%' }}
          />
          <Chip 
            icon={<AttachMoney />} 
            label={`Budget: $${budget.toLocaleString('en-US')}`}
            color="primary"
            size="small"
            sx={{ maxWidth: '100%' }}
          />
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          onClick={onView}
          variant="outlined"
          fullWidth
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TripCard; 