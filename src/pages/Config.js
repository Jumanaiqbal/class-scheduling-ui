import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { ConfigForm } from '../components/config';
import { useApi } from '../hooks/useApi';
import { getUIConfig, updateConfig } from '../services/api';

const Config = () => {
  const {
    data: configData,
    loading: loadingConfig,
    error: configError,
    execute: fetchConfig,
  } = useApi(getUIConfig, true);

  const {
    execute: updateConfigData,
    loading: savingConfig,
    error: saveError,
  } = useApi(updateConfig, false);

  const handleSave = async (config) => {
    try {
      await updateConfigData(config);
      await fetchConfig(); // Refresh config data
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  };

  const handleReset = async () => {
    try {
      await fetchConfig(); // Refresh to get defaults
    } catch (error) {
      console.error('Failed to reset configuration:', error);
    }
  };

  return (
    <Box>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            System Configuration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Customize your driving school management system settings
          </Typography>
        </Box>
      </motion.div>

      {(configError || saveError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {configError || saveError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Configuration Form */}
        <Grid item xs={12} lg={8}>
          <ConfigForm
            config={configData || {}}
            onSave={handleSave}
            onReset={handleReset}
            loading={loadingConfig || savingConfig}
          />
        </Grid>

        {/* Info Card */}
        <Grid item xs={12} lg={4}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                💡 Configuration Tips
              </Typography>

              <Box display="flex" flexDirection="column" gap={2} mt={2}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Class Duration
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Set the default duration for all driving classes
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Daily Limits
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Prevent over-scheduling for students and instructors
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Theme & Language
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Personalize the interface to your preference
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Notifications
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Enable or disable system notifications
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Config;
