import { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  TrendingUp as TrendingIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  UploadFile as UploadFileIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { StatsChart } from '../components/dashboard';
import { getDashboardStats } from '../services/api';

import { getDashboardSummary } from '../services/api';
import { usePalette } from '../themes/usePalette';

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
  loading = false,
  error = null,
}) => {
  const palette = usePalette();
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      sx={{
        height: '100%',
        borderRadius: 2,
        boxShadow: 'sm',
        bgcolor: palette.surfaceLight,
        border: `1px solid ${palette.borderLight}`,
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography
              color={palette.textSecondaryLight}
              gutterBottom
              variant="overline"
              sx={{ fontFamily: 'Google Sans, sans-serif' }}
            >
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
                <Typography
                  variant="h4"
                  component="div"
                  fontWeight={600}
                  sx={{ fontFamily: 'Google Sans, sans-serif', color }}
                >
                  {value}
                </Typography>
                <Typography
                  variant="body2"
                  color={palette.textSecondaryLight}
                  sx={{ fontFamily: 'Roboto, sans-serif' }}
                >
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
              backgroundColor: palette.primaryLight,
              color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [days, setDays] = useState(30);

  // Fetch summary stats on mount and refresh
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const refreshSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardSummary();
      if (res.success && res.data) {
        setSummary(res.data);
      } else {
        setSummary(null);
        setError('Failed to load dashboard summary');
      }
    } catch (err) {
      setSummary(null);
      setError('Failed to load dashboard summary');
    }
    setLoading(false);
  }, []);

  const fetchStatsData = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const res = await getDashboardStats(days);
      setStatsData(res);
    } catch (err) {
      setStatsData(null);
      setStatsError('Failed to load stats data');
    }
    setStatsLoading(false);
  }, [days]);

  // Summary interval (mount only)
  useEffect(() => {
    refreshSummary();
    const summaryInterval = setInterval(refreshSummary, 5 * 60 * 1000);
    return () => clearInterval(summaryInterval);
  }, [refreshSummary]);

  // Stats fetch on mount and days change
  useEffect(() => {
    fetchStatsData();
  }, [days, fetchStatsData]);

  // Stats interval (mount only)
  useEffect(() => {
    const statsInterval = setInterval(fetchStatsData, 5 * 60 * 1000);
    return () => clearInterval(statsInterval);
  }, [fetchStatsData]);

  const palette = usePalette();
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: palette.backgroundLight }}>
      <Box sx={{ p: { xs: 2, lg: 6 }, pt: 4 }}>
        {/* Header */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={refreshSummary}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={4}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                sx={{
                  fontFamily: 'Google Sans, sans-serif',
                  color: palette.textPrimaryLight,
                }}
              >
                Admin Dashboard
              </Typography>
              <Typography
                variant="body1"
                color={palette.textSecondaryLight}
                sx={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Monitor your driving school class schedules and performance
              </Typography>
            </Box>
            <Chip
              label="Live Data"
              color="success"
              variant="outlined"
              icon={<TrendingIcon />}
              sx={{ fontFamily: 'Google Sans, sans-serif' }}
            />
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Classes"
              value={summary?.totalClasses ?? 0}
              subtitle="Scheduled sessions"
              icon={<ScheduleIcon fontSize="large" />}
              color={palette.textPrimaryLight}
              loading={loading}
              error={error}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Active Students"
              value={summary?.activeStudents ?? 0}
              subtitle="Registered learners"
              icon={<PeopleIcon fontSize="large" />}
              color={palette.textPrimaryLight}
              loading={loading}
              error={error}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Instructors"
              value={summary?.activeInstructors ?? 0}
              subtitle="Teaching staff"
              icon={<SchoolIcon fontSize="large" />}
              color={palette.secondary}
              loading={loading}
              error={error}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="System Status"
              value={error ? 'Error' : 'Online'}
              subtitle={
                error ? 'System issues detected' : 'All systems operational'
              }
              icon={<TrendingIcon fontSize="large" />}
              color={palette.accent}
              loading={loading}
              error={error}
            />
          </Grid>
        </Grid>

        {/* Charts (removed legacy statsData, only show quick actions) */}
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
              sx={{
                height: '100%',
                borderRadius: 2,
                boxShadow: 'sm',
                bgcolor: palette.surfaceLight,
                border: `1px solid ${palette.borderLight}`,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight={600}
                  sx={{
                    fontFamily: 'Google Sans, sans-serif',
                    color: palette.textPrimaryLight,
                  }}
                >
                  Quick Actions
                </Typography>
                <Typography
                  variant="body2"
                  color={palette.textSecondaryLight}
                  paragraph
                  sx={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Manage your driving school operations efficiently
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="flex" flexDirection="column" gap={2}>
                  {[
                    {
                      label: 'Upload CSV',
                      icon: <UploadFileIcon sx={{ color: palette.primary }} />,
                      description: 'Add class schedules via CSV',
                      route: '/upload',
                    },
                    {
                      label: 'View Reports',
                      icon: <AssessmentIcon sx={{ color: palette.primary }} />,
                      description: 'Analyze class performance',
                      route: '/reports',
                    },
                    {
                      label: 'System Settings',
                      icon: <SettingsIcon sx={{ color: palette.primary }} />,
                      description: 'Configure application',
                      route: '/config',
                    },
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
                          border: `1px solid ${palette.borderLight}`,
                          borderRadius: 2,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: palette.primaryLight,
                            borderColor: palette.primary,
                          },
                        }}
                        onClick={() => navigate(action.route)}
                      >
                        {action.icon}
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            sx={{
                              fontFamily: 'Google Sans, sans-serif',
                              color: palette.textPrimaryLight,
                            }}
                          >
                            {action.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            color={palette.textSecondaryLight}
                            sx={{ fontFamily: 'Roboto, sans-serif' }}
                          >
                            {action.description}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
