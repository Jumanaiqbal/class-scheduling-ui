import React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Typography,
  Container,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import TopNav from '../Navigation/TopNav';
import { usePalette } from '../../../themes/usePalette';
import { DirectionsCar as DirectionsCarIcon } from '@mui/icons-material';

const Layout = ({ children }) => {
  const palette = usePalette();
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: palette.surfaceLight,
          color: palette.primary,
          borderBottom: `1px solid ${palette.borderLight}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <DirectionsCarIcon
              fontSize="large"
              sx={{ color: palette.primary }}
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Google Sans, sans-serif',
                color: palette.textPrimaryLight,
              }}
            >
              Scheduler
            </Typography>
            <TopNav />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTf3cRS6JVr9WNxQYaW_1xbnt7KeAI3xZk-wkrN-dEggzkkUgQgBFSkqtGDs-eFgb2IFLrk5wf6oaKNKS11Jjm87ZcZdNtjykqZOuirV6HTHKmcgzF0WsSD9yS_ld0hlnVsRCfZwT3uCuOboc0AwWl4zXFZz4tQQWPa60UjQxQ3J3Pd4A1e_dXcccRVHR5WI2gFlxcYzKuGBDpN52PsC-WqJLxJnIpIi3xnsubknNXxK7K6zedgpVGUFHyt1LTT5imvgxGtF6bfwQ" />
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100%',
          overflow: 'auto',
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="xl" sx={{ my: 5 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
