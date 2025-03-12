import React from 'react';
import { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Card,
  CardContent,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Flight as FlightIcon,
  AccountBalance as BudgetIcon,
  Map as MapIcon,
  DateRange as DateIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import styles from '../styles/Dashboard.module.css';
import ProtectedRoute from '../components/ProtectedRoute';

export default function Dashboard() {
  const [upcomingTrips] = useState([
    {
      id: 1,
      destination: 'Paris, France',
      date: '15-20 May 2024',
      budget: 2500,
      spent: 1200,
      status: 'Planning'
    },
    {
      id: 2,
      destination: 'Tokyo, Japan',
      date: '10-25 June 2024',
      budget: 4000,
      spent: 800,
      status: 'Booked'
    }
  ]);

  return (
    <ProtectedRoute>
      <Container maxWidth="xl" className={styles.dashboardContainer}>
        {/* Header Section */}
        <Box className={styles.dashboardHeader}>
          <Box>
            <Typography variant="h4" className={styles.welcomeText}>
              Welcome back, Alex
            </Typography>
            <Typography variant="body1" className={styles.subText}>
              Track your travel plans and manage your budgets
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className={styles.newTripButton}
          >
            Plan New Trip
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} className={styles.statsSection}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className={styles.statCard}>
              <Box className={styles.statContent}>
                <Box className={styles.statIcon} style={{ background: 'rgba(45, 55, 72, 0.1)' }}>
                  <FlightIcon className={styles.icon} />
                </Box>
                <Box>
                  <Typography variant="h6" className={styles.statValue}>2</Typography>
                  <Typography variant="body2" className={styles.statLabel}>Upcoming Trips</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className={styles.statCard}>
              <Box className={styles.statContent}>
                <Box className={styles.statIcon} style={{ background: 'rgba(72, 187, 120, 0.1)' }}>
                  <BudgetIcon className={styles.icon} style={{ color: '#48bb78' }} />
                </Box>
                <Box>
                  <Typography variant="h6" className={styles.statValue}>$6,500</Typography>
                  <Typography variant="body2" className={styles.statLabel}>Total Budget</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className={styles.statCard}>
              <Box className={styles.statContent}>
                <Box className={styles.statIcon} style={{ background: 'rgba(237, 137, 54, 0.1)' }}>
                  <MapIcon className={styles.icon} style={{ color: '#ed8936' }} />
                </Box>
                <Box>
                  <Typography variant="h6" className={styles.statValue}>2</Typography>
                  <Typography variant="body2" className={styles.statLabel}>Destinations</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className={styles.statCard}>
              <Box className={styles.statContent}>
                <Box className={styles.statIcon} style={{ background: 'rgba(66, 153, 225, 0.1)' }}>
                  <DateIcon className={styles.icon} style={{ color: '#4299e1' }} />
                </Box>
                <Box>
                  <Typography variant="h6" className={styles.statValue}>42</Typography>
                  <Typography variant="body2" className={styles.statLabel}>Travel Days</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Upcoming Trips Section */}
        <Box className={styles.sectionHeader}>
          <Typography variant="h5">Upcoming Trips</Typography>
          <Button variant="text" className={styles.viewAllButton}>View All</Button>
        </Box>
        
        <Grid container spacing={3} className={styles.tripsGrid}>
          {upcomingTrips.map((trip) => (
            <Grid item xs={12} md={6} key={trip.id}>
              <Card className={styles.tripCard}>
                <CardContent>
                  <Box className={styles.tripHeader}>
                    <Typography variant="h6" className={styles.tripDestination}>
                      {trip.destination}
                    </Typography>
                    <Chip
                      label={trip.status}
                      size="small"
                      className={styles.statusChip}
                      style={{
                        backgroundColor: trip.status === 'Booked' ? 'rgba(72, 187, 120, 0.1)' : 'rgba(237, 137, 54, 0.1)',
                        color: trip.status === 'Booked' ? '#48bb78' : '#ed8936'
                      }}
                    />
                  </Box>
                  <Box className={styles.tripDetails}>
                    <Box className={styles.tripInfo}>
                      <DateIcon className={styles.tripIcon} />
                      <Typography variant="body2">{trip.date}</Typography>
                    </Box>
                    <Box className={styles.tripInfo}>
                      <BudgetIcon className={styles.tripIcon} />
                      <Typography variant="body2">${trip.budget.toLocaleString()}</Typography>
                    </Box>
                  </Box>
                  <Box className={styles.budgetProgress}>
                    <Box className={styles.budgetHeader}>
                      <Typography variant="body2">Budget Spent</Typography>
                      <Typography variant="body2" color="textSecondary">
                        ${trip.spent.toLocaleString()} / ${trip.budget.toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(trip.spent / trip.budget) * 100}
                      className={styles.progressBar}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Budget Overview Section */}
        <Box className={styles.sectionHeader}>
          <Typography variant="h5">Budget Overview</Typography>
          <IconButton className={styles.filterButton}>
            <DateIcon />
          </IconButton>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper className={styles.budgetChart}>
              <Typography variant="h6" gutterBottom>Monthly Spending</Typography>
              {/* Chart component will be added here */}
              <Box className={styles.chartPlaceholder}>
                <Typography variant="body2" color="textSecondary">
                  Chart visualization will be implemented
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={styles.recentActivity}>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              <Box className={styles.activityList}>
                <Box className={styles.activityItem}>
                  <Box className={styles.activityIcon} style={{ background: 'rgba(72, 187, 120, 0.1)' }}>
                    <ArrowUpwardIcon style={{ color: '#48bb78' }} />
                  </Box>
                  <Box className={styles.activityContent}>
                    <Typography variant="body2">Flight Tickets - Paris</Typography>
                    <Typography variant="caption" color="textSecondary">2 days ago</Typography>
                  </Box>
                  <Typography variant="body2" className={styles.activityAmount} style={{ color: '#48bb78' }}>
                    +$850
                  </Typography>
                </Box>
                <Box className={styles.activityItem}>
                  <Box className={styles.activityIcon} style={{ background: 'rgba(237, 137, 54, 0.1)' }}>
                    <ArrowDownwardIcon style={{ color: '#ed8936' }} />
                  </Box>
                  <Box className={styles.activityContent}>
                    <Typography variant="body2">Hotel Booking - Tokyo</Typography>
                    <Typography variant="caption" color="textSecondary">5 days ago</Typography>
                  </Box>
                  <Typography variant="body2" className={styles.activityAmount} style={{ color: '#ed8936' }}>
                    -$1,200
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ProtectedRoute>
  );
} 