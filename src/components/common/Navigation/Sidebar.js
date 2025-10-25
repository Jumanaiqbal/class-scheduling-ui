import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Toolbar, 
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CloudUpload as UploadIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

const drawerWidth = 240;

const menuItems = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: DashboardIcon },
  { path: ROUTES.UPLOAD, label: 'Upload CSV', icon: UploadIcon },
  { path: ROUTES.REPORTS, label: 'Reports', icon: ReportsIcon },
  { path: ROUTES.CONFIG, label: 'Configuration', icon: SettingsIcon },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: '2px 0 12px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Toolbar />
      
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <ListItem
                key={item.path}
                component={motion.div}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                button
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : 'primary.main', minWidth: 40 }}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.9rem',
                  }}
                />
              </ListItem>
            );
          })}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ px: 2, pb: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Driving School Management System v1.0
            </Typography>
          </motion.div>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;