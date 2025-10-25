import React, { useCallback, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { downloadCSV, validateCSV, CSV_TEMPLATE } from '../../utils/constants';

const CSVUploader = ({ onFileUpload, loading = false }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    const validationError = validateCSV(selectedFile);
    
    if (validationError) {
      setError(validationError);
      setFile(null);
    } else {
      setError('');
      setFile(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false,
  });

  const handleUpload = () => {
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDownloadTemplate = () => {
    downloadCSV(CSV_TEMPLATE, 'class_schedule_template.csv');
  };

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Upload Class Schedule CSV
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          Upload a CSV file to create, update, or delete class schedules. 
          The file should follow the specified format.
        </Typography>

        {/* Download Template */}
        <Box mb={3}>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleDownloadTemplate}
            variant="outlined"
            size="small"
          >
            Download Template
          </Button>
        </Box>

        {/* Drop Zone */}
        <Paper
          {...getRootProps()}
          variant="outlined"
          sx={{
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.300',
            backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          <input {...getInputProps()} />
          
          <UploadIcon 
            sx={{ 
              fontSize: 48, 
              color: isDragActive ? 'primary.main' : 'grey.400',
              mb: 2 
            }} 
          />
          
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Drop the CSV file here' : 'Drag & drop CSV file here'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            or click to select a file
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Supports .csv files up to 5MB
          </Typography>
        </Paper>

        {/* Selected File */}
        {file && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Box
              mt={2}
              p={2}
              border={1}
              borderColor="success.main"
              borderRadius={1}
              bgcolor="success.light"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <FileIcon color="success" />
              <Box flex={1}>
                <Typography variant="body2" fontWeight={500}>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(file.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          </motion.div>
        )}

        {/* Upload Button */}
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleUpload}
            disabled={!file || loading}
            size="large"
          >
            {loading ? 'Processing...' : 'Upload CSV'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CSVUploader;