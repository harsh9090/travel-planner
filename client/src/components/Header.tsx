import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import styles from '../styles/Header.module.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfileClick = () => {
    handleClose();
    router.push('/Profile');
  };

  return (
    <AppBar position="static" className={styles.header}>
      <Toolbar className={styles.toolbar}>
        <Typography 
          variant="h6" 
          component="div" 
          className={styles.logo}
          onClick={() => router.push('/')}
        >
          Travel Budget Planner
        </Typography>
        <Box className={styles.navButtons}>
          <Button 
            className={router.pathname === '/' ? styles.activeButton : styles.navButton} 
            onClick={() => router.push('/')}
          >
            Home
          </Button>
          
          {isAuthenticated ? (
            <>
              <Button 
                className={router.pathname === '/dashboard' ? styles.activeButton : styles.navButton}
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
              <IconButton
                onClick={handleMenu}
                size="small"
                sx={{ ml: 2 }}
              >
                {user?.name ? (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#2d3748' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                ) : (
                  <AccountCircleIcon />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                className={router.pathname === '/login' ? styles.activeButton : styles.navButton}
                onClick={() => router.push('/login')}
              >
                Login
              </Button>
              <Button 
                className={router.pathname === '/register' ? styles.activeButton : styles.navButton}
                onClick={() => router.push('/register')}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 