import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const UploadResults = ({ results, loading = false }) => {
  if (!results) return null;

  const { success, message, results: lineResults = [] } = results;

  const successCount = lineResults.filter(r => r.success).length;
  const errorCount = lineResults.filter(r => !r.success).length;

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Upload Results
        </Typography>

        {/* Summary */}
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <Chip
            icon={<SuccessIcon />}
            label={`${successCount} Successful`}
            color="success"
            variant={successCount > 0 ? "filled" : "outlined"}
          />
          <Chip
            icon={<ErrorIcon />}
            label={`${errorCount} Errors`}
            color={errorCount > 0 ? "error" : "default"}
            variant={errorCount > 0 ? "filled" : "outlined"}
          />
          <Chip
            icon={<InfoIcon />}
            label={`${lineResults.length} Total Rows`}
            variant="outlined"
          />
        </Box>

        {/* Overall Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Alert 
                severity={success ? "success" : "error"} 
                sx={{ mb: 3 }}
              >
                {message}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detailed Results Table */}
        {lineResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              Detailed Results
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Line</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Registration ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lineResults.map((result, index) => (
                    <TableRow
                      key={index}
                      component={motion.tr}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      sx={{
                        backgroundColor: result.success ? 'success.light' : 'error.light',
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2">
                          {result.line}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {result.data?.Action}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={result.success ? 'Success' : 'Error'}
                          color={result.success ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          color={result.success ? 'success.dark' : 'error.dark'}
                        >
                          {result.success ? result.message : result.error}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {result.registrationId || '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadResults;