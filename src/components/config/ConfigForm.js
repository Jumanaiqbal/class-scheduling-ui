import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as ResetIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ConfigForm = ({ config, onSave, onReset, loading = false }) => {
  const [formData, setFormData] = useState({
    theme: config?.data?.theme || 'light',
    language: config?.data?.language || 'en',
    notifications: config?.data?.notifications !== false,
    classDuration: config?.data?.classDuration || 45,
    maxStudentClasses: config?.data?.maxStudentClasses || 3,
    maxInstructorClasses: config?.data?.maxInstructorClasses || 5,
  });

  // Update form data when config changes
  useEffect(() => {
    if (config?.data) {
      setFormData({
        theme: config.data.theme || 'light',
        language: config.data.language || 'en',
        notifications: config.data.notifications !== false,
        classDuration: config.data.classDuration || 45,
        maxStudentClasses: config.data.maxStudentClasses || 3,
        maxInstructorClasses: config.data.maxInstructorClasses || 5,
      });
    }
  }, [config]);

  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      setSaveStatus({ type: 'success', message: 'Configuration saved successfully!' });
    } catch (error) {
      setSaveStatus({ type: 'error', message: error.message });
    }
  };

  const handleReset = () => {
    setFormData({
      theme: 'light',
      language: 'en',
      notifications: true,
      classDuration: 45,
      maxStudentClasses: 3,
      maxInstructorClasses: 5,
    });
    onReset?.();
    setSaveStatus({ type: 'info', message: 'Configuration reset to defaults!' });
  };

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          System Configuration
        </Typography>

        {/* Status Alert */}
        <AnimatePresence>
          {saveStatus.message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert 
                severity={saveStatus.type} 
                sx={{ mb: 3 }}
                onClose={() => setSaveStatus({ type: '', message: '' })}
              >
                {saveStatus.message}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Grid container spacing={3}>
          {/* UI Settings */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Interface Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Theme</InputLabel>
              <Select
                value={formData.theme}
                label="Theme"
                onChange={(e) => handleChange('theme', e.target.value)}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                {/* <MenuItem value="auto">Auto</MenuItem> */}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Language</InputLabel>
              <Select
                value={formData.language}
                label="Language"
                onChange={(e) => handleChange('language', e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ar">Arabic</MenuItem>
                {/* <MenuItem value="fr">French</MenuItem> */}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.notifications}
                  onChange={(e) => handleChange('notifications', e.target.checked)}
                  color="primary"
                />
              }
              label="Enable Notifications"
            />
          </Grid>

          {/* Business Rules */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
              Business Rules
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Class Duration (minutes)"
              value={formData.classDuration}
              onChange={(e) => handleChange('classDuration', parseInt(e.target.value) || 45)}
              inputProps={{ min: 15, max: 180 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Max Student Classes/Day"
              value={formData.maxStudentClasses}
              onChange={(e) => handleChange('maxStudentClasses', parseInt(e.target.value) || 3)}
              inputProps={{ min: 1, max: 10 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Max Instructor Classes/Day"
              value={formData.maxInstructorClasses}
              onChange={(e) => handleChange('maxInstructorClasses', parseInt(e.target.value) || 5)}
              inputProps={{ min: 1, max: 15 }}
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button
                startIcon={<ResetIcon />}
                onClick={handleReset}
                variant="outlined"
                disabled={loading}
              >
                Reset to Defaults
              </Button>
              <Button
                startIcon={<SaveIcon />}
                onClick={handleSave}
                variant="contained"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Configuration'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ConfigForm;