import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { StatsChart } from '../components/dashboard';
import { useApi } from '../hooks/useApi';
import { getDashboardStats, getRegistrations, getStudents, getInstructors } from '../services/api';

const StatCard = ({ title, value, subtitle, icon, color = 'primary', loading = false, error = null }) => (
  <Card
    component={motion.div}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    sx={{ height: '100%' }}
  >
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="text.secondary" gutterBottom variant="overline">
            {title}
          </Typography>
          {loading ? (
            <Box display="flex" alignItems="center" gap={1} my={1}>
              <CircularProgress size={20} />
              <Typography variant="body2">Loading...</Typography>
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 1 }}>
              Failed to load data
            </Alert>
          ) : (
            <>
              <Typography variant="h4" component="div" fontWeight={600}>
                {value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            </>
          )}
        </Box>
        <Box
          component={motion.div}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: `${color}.light`,
            color: `${color}.main`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [days, setDays] = useState(30);

  // Memoize the API functions
  const getStats = useCallback(() => getDashboardStats(days), [days]);

  const { 
    data: statsData, 
    loading: statsLoading,
    error: statsError,
    execute: refreshStats 
  } = useApi(getStats, true);

  const { 
    data: registrationsData, 
    loading: registrationsLoading,
    error: registrationsError,
    execute: refreshRegistrations
  } = useApi(getRegistrations, true);

  const { 
    data: studentsData, 
    loading: studentsLoading,
    error: studentsError,
    execute: refreshStudents
  } = useApi(getStudents, true);

  const { 
    data: instructorsData, 
    loading: instructorsLoading,
    error: instructorsError,
    execute: refreshInstructors
  } = useApi(getInstructors, true);

  // Function to refresh all data
  const refreshAllData = useCallback(async () => {
    try {
      await Promise.all([
        refreshStats(),
        refreshRegistrations(),
        refreshStudents(),
        refreshInstructors()
      ]);
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error);
    }
  }, [refreshStats, refreshRegistrations, refreshStudents, refreshInstructors]);

  // Refresh stats when days change
  useEffect(() => {
    refreshStats().catch(console.error);
  }, [days, refreshStats]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    // Initial load
    refreshAllData();
    
    // Set up auto-refresh
    const intervalId = setInterval(refreshAllData, 5 * 60 * 1000);
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array since refreshAllData is now stable

  const totalClasses = registrationsData?.data?.length || 0;
  const totalStudents = studentsData?.data?.length || 0;
  const totalInstructors = instructorsData?.data?.length || 0;

  return (
    <Box>
      {/* Header */}
      {(statsError || registrationsError || studentsError || instructorsError) && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={refreshAllData}
            >
              Retry
            </Button>
          }
        >
          Some data failed to load. Click retry to try again.
        </Alert>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor your driving school class schedules and performance
            </Typography>
          </Box>
          <Chip 
            label="Live Data" 
            color="success" 
            variant="outlined"
            icon={<TrendingIcon />}
          />
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Classes"
            value={totalClasses}
            subtitle="Scheduled sessions"
            icon={<ScheduleIcon fontSize="large" />}
            color="primary"
            loading={registrationsLoading}
            error={registrationsError}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Students"
            value={totalStudents}
            subtitle="Registered learners"
            icon={<PeopleIcon fontSize="large" />}
            color="secondary"
            loading={studentsLoading}
            error={studentsError}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Instructors"
            value={totalInstructors}
            subtitle="Teaching staff"
            icon={<SchoolIcon fontSize="large" />}
            color="info"
            loading={instructorsLoading}
            error={instructorsError}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="System Status"
            value={statsError ? "Error" : "Online"}
            subtitle={statsError ? "System issues detected" : "All systems operational"}
            icon={<TrendingIcon fontSize="large" />}
            color={statsError ? "error" : "success"}
            loading={false}
            error={null}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <StatsChart
            data={statsData}
            loading={statsLoading}
            error={statsError}
            days={days}
            onDaysChange={setDays}
          />
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            sx={{ height: '100%' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Manage your driving school operations efficiently
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={2}>
                {[
                  { label: 'Upload New Schedules', description: 'Add class schedules via CSV' },
                  { label: 'View Reports', description: 'Analyze class performance' },
                  { label: 'Manage Students', description: 'Update student information' },
                  { label: 'System Settings', description: 'Configure application' },
                ].map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {action.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {action.description}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;