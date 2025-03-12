import { Box, Container, Typography, Link, Grid } from '@mui/material';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <Box component="footer" className={styles.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={4} className={styles.footerContent}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className={styles.footerTitle}>
              Travel Budget Planner
            </Typography>
            <Typography variant="body2" className={styles.footerText}>
              Plan your trips smarter, travel better. Your all-in-one solution for travel budgeting and planning.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className={styles.footerTitle}>
              Quick Links
            </Typography>
            <Box className={styles.linkGroup}>
              <Link href="/" className={styles.footerLink}>Home</Link>
              <Link href="/about" className={styles.footerLink}>About</Link>
              <Link href="/contact" className={styles.footerLink}>Contact</Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className={styles.footerTitle}>
              Legal
            </Typography>
            <Box className={styles.linkGroup}>
              <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
              <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
              <Link href="/cookies" className={styles.footerLink}>Cookie Policy</Link>
            </Box>
          </Grid>
        </Grid>
        <Box className={styles.footerBottom}>
          <Typography variant="body2" className={styles.copyright}>
            © {new Date().getFullYear()} Travel Budget Planner. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 