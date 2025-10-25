import React, { useState } from 'react';
import { Box, Typography, Grid, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { CSVUploader, UploadResults } from '../components/upload';
import { useApi } from '../hooks/useApi';
import { uploadCSV } from '../services/api';

const Upload = () => {
  const [uploadResults, setUploadResults] = useState(null);
  const { execute: uploadFile, loading, error } = useApi(uploadCSV, false);

  const handleFileUpload = async (file) => {
    try {
      const results = await uploadFile(file);
      setUploadResults(results);
    } catch (err) {
      // Error handled by useApi hook
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
            Upload Class Schedules
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload CSV files to create, update, or delete class schedules in bulk
          </Typography>
        </Box>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </motion.div>
      )}

      <Grid container spacing={3}>
        {/* Upload Section */}
        <Grid item xs={12} lg={6}>
          <CSVUploader 
            onFileUpload={handleFileUpload}
            loading={loading}
          />
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} lg={6}>
          {uploadResults && (
            <UploadResults 
              results={uploadResults}
              loading={loading}
            />
          )}
        </Grid>
      </Grid>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Box mt={4} p={3} bgcolor="background.default" borderRadius={2}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            📋 CSV Format Instructions
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Your CSV file should have the following columns in order:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li><strong>Registration ID:</strong> Leave as "null" for new registrations</li>
            <li><strong>Student ID:</strong> Student identifier (e.g., "1001")</li>
            <li><strong>Instructor ID:</strong> Instructor identifier (e.g., "2001")</li>
            <li><strong>Class ID:</strong> Class type identifier (e.g., "DRV101")</li>
            <li><strong>Class Start Time:</strong> Format: MM/DD/YYYY HH:mm</li>
            <li><strong>Action:</strong> "new", "update", or "delete"</li>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Upload;