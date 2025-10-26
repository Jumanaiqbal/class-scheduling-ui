import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePalette } from '../../../themes/usePalette';

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Reports', path: '/reports' },
  { label: 'CSV Uploader', path: '/upload' },
  { label: 'Configuration', path: '/config' },
];

const TopNav = () => {
  const palette = usePalette();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 4 }}>
      {navItems.map((item) => {
        const selected = location.pathname === item.path;
        return (
          <Button
            key={item.path}
            variant={selected ? 'contained' : 'text'}
            sx={{
              bgcolor: selected ? palette.primaryLight : undefined,
              color: selected ? palette.primary : palette.textSecondaryLight,
              fontFamily: 'Google Sans, sans-serif',
              borderRadius: '9999px',
              boxShadow: selected ? 'none' : undefined,
              fontWeight: selected ? 600 : 500,
              border: selected ? `1px solid ${palette.primary}` : undefined,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: palette.primary,
                color: '#fff',
              },
            }}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        );
      })}
    </Box>
  );
};

export default TopNav;
