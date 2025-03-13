import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useTrip } from '../contexts/TripContext';
import TripList from '../components/TripList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`trip-tabpanel-${index}`}
      aria-labelledby={`trip-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `trip-tab-${index}`,
    'aria-controls': `trip-tabpanel-${index}`
  };
}

const Dashboard = () => {
  const router = useRouter();
  const {
    trips,
    upcomingTrips,
    pastTrips,
    loading,
    error,
    fetchTrips,
    fetchUpcomingTrips,
    fetchPastTrips
  } = useTrip();
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        await Promise.all([fetchTrips(), fetchUpcomingTrips(), fetchPastTrips()]);
      } catch (err) {
        console.error('Failed to load trips:', err);
      }
    };
    loadTrips();
  }, [fetchTrips, fetchUpcomingTrips, fetchPastTrips]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateTrip = () => {
    router.push('/trips/create');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          My Trips
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateTrip}
        >
          Create New Trip
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="trip tabs">
          <Tab label="All Trips" {...a11yProps(0)} />
          <Tab label="Upcoming Trips" {...a11yProps(1)} />
          <Tab label="Past Trips" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TripList
          trips={trips}
          emptyMessage="No trips found. Click 'Create New Trip' to get started!"
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TripList
          trips={upcomingTrips}
          emptyMessage="No upcoming trips. Plan your next adventure!"
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <TripList trips={pastTrips} emptyMessage="No past trips found." />
      </TabPanel>
    </Container>
  );
};

export default Dashboard; 