import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ProtectedRoute from '../components/ProtectedRoute';

interface Activity {
  id: string;
  time: string;
  description: string;
}

interface DayPlan {
  date: string;
  activities: Activity[];
}

export default function ItineraryManagement() {
  const [selectedDate, setSelectedDate] = useState('');
  const [newActivity, setNewActivity] = useState({ time: '', description: '' });
  const [itinerary, setItinerary] = useState<DayPlan[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleAddActivity = () => {
    if (!selectedDate || !newActivity.time || !newActivity.description) return;

    const activity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      ...newActivity
    };

    setItinerary(prev => {
      const dayIndex = prev.findIndex(day => day.date === selectedDate);
      if (dayIndex >= 0) {
        const updatedItinerary = [...prev];
        updatedItinerary[dayIndex].activities.push(activity);
        return updatedItinerary;
      } else {
        return [...prev, { date: selectedDate, activities: [activity] }];
      }
    });

    setNewActivity({ time: '', description: '' });
  };

  const handleDeleteActivity = (date: string, activityId: string) => {
    setItinerary(prev => 
      prev.map(day => {
        if (day.date === date) {
          return {
            ...day,
            activities: day.activities.filter(activity => activity.id !== activityId)
          };
        }
        return day;
      })
    );
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setNewActivity({ time: activity.time, description: activity.description });
  };

  const handleUpdateActivity = () => {
    if (!editingActivity || !selectedDate) return;

    setItinerary(prev =>
      prev.map(day => {
        if (day.date === selectedDate) {
          return {
            ...day,
            activities: day.activities.map(activity =>
              activity.id === editingActivity.id
                ? { ...activity, ...newActivity }
                : activity
            )
          };
        }
        return day;
      })
    );

    setEditingActivity(null);
    setNewActivity({ time: '', description: '' });
  };

  const selectedDayPlan = itinerary.find(day => day.date === selectedDate);

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                Itinerary Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Plan and organize your daily activities
              </Typography>
            </Paper>
          </Grid>

          {/* Date Selection and Activity Form */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Select Date
              </Typography>
              <TextField
                type="date"
                fullWidth
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Typography variant="h6" gutterBottom>
                {editingActivity ? 'Edit Activity' : 'Add New Activity'}
              </Typography>
              <TextField
                fullWidth
                type="time"
                label="Time"
                value={newActivity.time}
                onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={editingActivity ? handleUpdateActivity : handleAddActivity}
                disabled={!selectedDate || !newActivity.time || !newActivity.description}
              >
                {editingActivity ? 'Update Activity' : 'Add Activity'}
              </Button>
              {editingActivity && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setEditingActivity(null);
                    setNewActivity({ time: '', description: '' });
                  }}
                  sx={{ mt: 1 }}
                >
                  Cancel Edit
                </Button>
              )}
            </Paper>
          </Grid>

          {/* Activities List */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {selectedDate 
                  ? `Activities for ${new Date(selectedDate).toLocaleDateString()}`
                  : 'Select a date to view activities'}
              </Typography>

              {selectedDayPlan ? (
                <List>
                  {selectedDayPlan.activities
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        {index > 0 && <Divider />}
                        <ListItem
                          secondaryAction={
                            <Box>
                              <IconButton 
                                edge="end" 
                                aria-label="edit"
                                onClick={() => handleEditActivity(activity)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                edge="end" 
                                aria-label="delete"
                                onClick={() => handleDeleteActivity(selectedDate, activity.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          }
                        >
                          <ListItemText
                            primary={activity.description}
                            secondary={activity.time}
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  {selectedDate 
                    ? 'No activities planned for this day yet'
                    : 'Please select a date to view or add activities'}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ProtectedRoute>
  );
} 