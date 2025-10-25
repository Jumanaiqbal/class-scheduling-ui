import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { DriveEta as DriveIcon } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar 
      position="fixed" 
      elevation={2}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #1976d2 0%, #00bcd4 100%)',
      }}
    >
      <Toolbar>
        <Box
          component={motion.div}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          display="flex"
          alignItems="center"
          gap={2}
        >
          <DriveIcon sx={{ fontSize: 32 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            DriveMaster Pro
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Chip 
          label="Scheduling System"
          variant="outlined"
          sx={{ 
            color: 'white', 
            borderColor: 'rgba(255,255,255,0.3)',
            fontWeight: 500 
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;