import { Container, Typography, Grid, Box, Button, Paper, InputBase, IconButton, Fab } from '@mui/material';
import { Search, Add, FilterList, FlightTakeoff, Explore, AccountBalance, ArrowForward } from '@mui/icons-material';
import { useRouter } from 'next/router';
import TripCard from '../components/TripCard';
import styles from '../styles/Home.module.css';
import { authService } from '../services/authService';
import { useEffect, useState } from 'react';

// Mock data - replace with actual API calls later
const mockTrips = [
  {
    id: '1',
    title: 'Summer in Paris',
    destination: 'Paris, France',
    startDate: '2024-06-01',
    endDate: '2024-06-15',
    budget: 3000
  },
  {
    id: '2',
    title: 'Tokyo Adventure',
    destination: 'Tokyo, Japan',
    startDate: '2024-07-10',
    endDate: '2024-07-25',
    budget: 4500
  },
  {
    id: '3',
    title: 'Greek Islands Hopping',
    destination: 'Santorini, Greece',
    startDate: '2024-08-05',
    endDate: '2024-08-20',
    budget: 3800
  }
];

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleGetStarted = () => {
    router.push('/register');
  };

  const handleCreateTrip = () => {
    if (isAuthenticated) {
      console.log('Create new trip');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <Box className={styles.heroSection}>
        <Container>
          <div className={styles.heroContent}>
            <Typography variant="h2" component="h1" className={styles.heroTitle}>
              Your Journey Begins Here
            </Typography>
            <Typography variant="h5" className={styles.heroSubtitle}>
              Transform your travel dreams into reality
            </Typography>
            
            <Typography className={styles.catchPhrase}>
              <FlightTakeoff sx={{ mr: 1, verticalAlign: 'middle' }} />
              Discover amazing destinations worldwide
            </Typography>
            <Typography className={styles.catchPhrase}>
              <Explore sx={{ mr: 1, verticalAlign: 'middle' }} />
              Create personalized travel itineraries
            </Typography>
            <Typography className={styles.catchPhrase}>
              <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
              Track and manage your travel budget effortlessly
            </Typography>

            {!isAuthenticated ? (
              <Box className={styles.heroButtons}>
                <Button
                  variant="contained"
                  size="large"
                  className={styles.heroButton}
                  onClick={handleGetStarted}
                >
                  Get Started
                  <ArrowForward sx={{ ml: 1 }} />
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  className={styles.heroButtonOutlined}
                  onClick={() => router.push('/login')}
                >
                  Sign In
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                size="large"
                className={styles.heroButton}
                onClick={handleCreateTrip}
              >
                Start Your Adventure
              </Button>
            )}
          </div>
        </Container>
      </Box>

      <Container className={styles.mainContent}>
        {isAuthenticated ? (
          <>
            {/* Search and Filter Bar */}
            <Box className={styles.searchContainer}>
              <Paper className={styles.searchBar}>
                <InputBase
                  className={styles.searchInput}
                  placeholder="Search your trips..."
                  fullWidth
                />
                <IconButton type="button" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <Search />
                </IconButton>
              </Paper>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                className={styles.filterButton}
              >
                Filter
              </Button>
            </Box>

            {/* Trips Section */}
            <Box className={styles.tripsSection}>
              <Typography
                variant="h4"
                component="h2"
                className={styles.tripsSectionHeader}
              >
                My Trips
                <Button
                  variant="text"
                  className={styles.viewAllButton}
                  onClick={() => console.log('View all')}
                >
                  View All
                </Button>
              </Typography>
              <Grid container spacing={3}>
                {mockTrips.map((trip) => (
                  <Grid item xs={12} sm={6} md={4} key={trip.id}>
                    <TripCard
                      title={trip.title}
                      destination={trip.destination}
                      startDate={trip.startDate}
                      endDate={trip.endDate}
                      budget={trip.budget}
                      onView={() => console.log('View trip:', trip.id)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        ) : (
          <Box className={styles.featuresSection}>
            <Typography variant="h4" component="h2" className={styles.sectionTitle}>
              Why Choose Our Travel Planner?
            </Typography>
            <Grid container spacing={4} className={styles.featuresGrid}>
              <Grid item xs={12} md={4}>
                <Paper className={styles.featureCard}>
                  <FlightTakeoff className={styles.featureIcon} />
                  <Typography variant="h6">Smart Trip Planning</Typography>
                  <Typography>
                    Easily plan and organize your trips with our intuitive tools and features.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper className={styles.featureCard}>
                  <Explore className={styles.featureIcon} />
                  <Typography variant="h6">Destination Insights</Typography>
                  <Typography>
                    Get detailed information about destinations and create perfect itineraries.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper className={styles.featureCard}>
                  <AccountBalance className={styles.featureIcon} />
                  <Typography variant="h6">Budget Management</Typography>
                  <Typography>
                    Keep track of your expenses and stay within your travel budget.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>

      {/* Floating Action Button - Only show when authenticated */}
      {isAuthenticated && (
        <Fab
          color="primary"
          aria-label="add"
          className={styles.fab}
          onClick={handleCreateTrip}
        >
          <Add />
        </Fab>
      )}
    </div>
  );
}
