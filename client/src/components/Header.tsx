import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/router';
import styles from '../styles/Header.module.css';

const Header = () => {
  const router = useRouter();

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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 