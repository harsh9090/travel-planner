import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AccountBalance as BudgetIcon,
  LocalHotel as HotelIcon,
  FlightTakeoff as FlightIcon,
  Restaurant as FoodIcon,
  DirectionsBus as TransportIcon,
  Attractions as ActivityIcon,
  ShoppingBag as ShoppingIcon,
  Edit as EditIcon,
  AttachMoney as MoneyIcon,
  ArrowDownward,
  ArrowUpward,
} from '@mui/icons-material';
import styles from '../styles/BudgetManagement.module.css';
import ProtectedRoute from '../components/ProtectedRoute';

type ExpenseCategory = 'flight' | 'hotel' | 'food' | 'transport' | 'activities' | 'shopping' | 'other';

interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
}

const categoryIcons = {
  flight: <FlightIcon />,
  hotel: <HotelIcon />,
  food: <FoodIcon />,
  transport: <TransportIcon />,
  activities: <ActivityIcon />,
  shopping: <ShoppingIcon />,
  other: <BudgetIcon />,
};

const categoryColors = {
  flight: '#4299e1',
  hotel: '#48bb78',
  food: '#ed8936',
  transport: '#667eea',
  activities: '#9f7aea',
  shopping: '#ed64a6',
  other: '#718096',
};

export default function BudgetManagement() {
  const [totalBudget, setTotalBudget] = useState(5000);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [newExpense, setNewExpense] = useState({
    category: 'other' as ExpenseCategory,
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      category: 'flight',
      description: 'Round-trip flight to Paris',
      amount: 850,
      date: '2024-05-15',
    },
    {
      id: '2',
      category: 'hotel',
      description: 'Hotel booking - 5 nights',
      amount: 1200,
      date: '2024-05-15',
    },
  ]);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalBudget - totalExpenses;
  const budgetProgress = (totalExpenses / totalBudget) * 100;

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      description: newExpense.description,
      amount: Number(newExpense.amount),
      date: newExpense.date,
    };

    setExpenses([...expenses, expense]);
    setNewExpense({
      category: 'other',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const handleEditBudget = () => {
    if (newBudgetAmount && !isNaN(Number(newBudgetAmount))) {
      setTotalBudget(Number(newBudgetAmount));
      setIsEditBudgetOpen(false);
      setNewBudgetAmount('');
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    } else {
      return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    }
  });

  return (
    <ProtectedRoute>
      <Container maxWidth="xl" className={styles.budgetContainer}>
        <Typography variant="h4" className={styles.pageTitle}>
          Budget Management
        </Typography>

        {/* Budget Overview */}
        <Grid container spacing={3} className={styles.budgetOverview}>
          <Grid item xs={12} md={4}>
            <Paper className={styles.budgetCard}>
              <Typography variant="h6">Total Budget</Typography>
              <Box className={styles.budgetAmount}>
                <Typography variant="h3">
                  ${totalBudget.toLocaleString()}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setIsEditBudgetOpen(true)}
                  className={styles.editBudgetButton}
                >
                  <EditIcon />
                </IconButton>
              </Box>
              <Box className={styles.budgetProgress}>
                <LinearProgress
                  variant="determinate"
                  value={budgetProgress}
                  className={styles.progressBar}
                  color={budgetProgress > 90 ? "error" : budgetProgress > 75 ? "warning" : "primary"}
                />
                <Typography variant="body2" color="textSecondary">
                  ${totalExpenses.toLocaleString()} spent of ${totalBudget.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={styles.budgetCard}>
              <Typography variant="h6">Remaining Budget</Typography>
              <Typography
                variant="h3"
                className={styles.budgetAmount}
                style={{ color: remainingBudget > 0 ? '#48bb78' : '#f56565' }}
              >
                ${remainingBudget.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {budgetProgress.toFixed(1)}% of budget used
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={styles.budgetCard}>
              <Typography variant="h6">Expense Categories</Typography>
              <Box className={styles.categoryList}>
                {Object.entries(expensesByCategory).map(([category, amount]) => (
                  <Box key={category} className={styles.categoryItem}>
                    <Box className={styles.categoryIcon} style={{ backgroundColor: categoryColors[category as ExpenseCategory] }}>
                      {categoryIcons[category as ExpenseCategory]}
                    </Box>
                    <Box className={styles.categoryDetails}>
                      <Typography variant="body2" className={styles.categoryName}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Typography>
                      <Typography variant="body2" className={styles.categoryAmount}>
                        ${amount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Edit Budget Dialog */}
        <Dialog 
          open={isEditBudgetOpen} 
          onClose={() => setIsEditBudgetOpen(false)}
          className={styles.editBudgetDialog}
        >
          <DialogTitle>Update Total Budget</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="New Budget Amount"
              type="number"
              fullWidth
              value={newBudgetAmount}
              onChange={(e) => setNewBudgetAmount(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditBudgetOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleEditBudget} variant="contained" color="primary">
              Update Budget
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add New Expense */}
        <Paper className={styles.addExpenseSection}>
          <Typography variant="h6" gutterBottom>Add New Expense</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newExpense.category}
                  label="Category"
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as ExpenseCategory })}
                >
                  <MenuItem value="flight">Flight</MenuItem>
                  <MenuItem value="hotel">Hotel</MenuItem>
                  <MenuItem value="food">Food</MenuItem>
                  <MenuItem value="transport">Transport</MenuItem>
                  <MenuItem value="activities">Activities</MenuItem>
                  <MenuItem value="shopping">Shopping</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="contained"
                className={styles.addButton}
                onClick={handleAddExpense}
                style={{ height: '56px' }}
              >
                <AddIcon />
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Expense List */}
        <Paper className={styles.expenseList}>
          <Box className={styles.expenseListHeader}>
            <Typography variant="h6">Recent Expenses</Typography>
            <Box className={styles.expenseListControls}>
              <FormControl size="small" className={styles.sortControl}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="amount">Amount</MenuItem>
                </Select>
              </FormControl>
              <IconButton
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className={styles.sortOrderButton}
              >
                {sortOrder === 'desc' ? (
                  <ArrowDownward className={styles.sortIcon} />
                ) : (
                  <ArrowUpward className={styles.sortIcon} />
                )}
              </IconButton>
            </Box>
          </Box>
          
          <Grid container spacing={2}>
            {sortedExpenses.length > 0 ? (
              sortedExpenses.map((expense) => (
                <Grid item xs={12} key={expense.id}>
                  <Card className={styles.expenseCard}>
                    <CardContent>
                      <Grid container alignItems="center">
                        <Grid item xs={1}>
                          <Box
                            className={styles.expenseIcon}
                            style={{ backgroundColor: categoryColors[expense.category] }}
                          >
                            {categoryIcons[expense.category]}
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body1">{expense.description}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(expense.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="body2" className={styles.categoryLabel}>
                            {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="h6" className={styles.expenseAmount}>
                            ${expense.amount.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteExpense(expense.id)}
                            className={styles.deleteButton}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box className={styles.emptyState}>
                  <BudgetIcon className={styles.emptyStateIcon} />
                  <Typography variant="h6">No Expenses Yet</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Add your first expense using the form above
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Container>
    </ProtectedRoute>
  );
} 