import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar, Sidebar } from '../Navigation';
import { useApp } from '../../../contexts/AppContext';

const Layout = ({ children }) => {
  const { loading } = useApp();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        
        <Box sx={{ p: 3 }}>
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
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;