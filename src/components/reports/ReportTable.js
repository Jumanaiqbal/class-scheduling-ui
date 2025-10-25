import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../../utils/helpers';

const ReportTable = ({ data, loading = false, pagination, onPageChange }) => {
  const reports = data?.data || [];
  const { page = 0, limit = 10, total = 0 } = pagination || {};

  const handleChangePage = (event, newPage) => {
    onPageChange?.(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    onPageChange?.(1, parseInt(event.target.value, 10));
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              Loading reports...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Class Schedule Report
        </Typography>

        <AnimatePresence>
          {reports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Box textAlign="center" py={6}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No classes found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your filters or upload new class schedules.
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Registration ID</strong></TableCell>
                      <TableCell><strong>Student</strong></TableCell>
                      <TableCell><strong>Instructor</strong></TableCell>
                      <TableCell><strong>Class</strong></TableCell>
                      <TableCell><strong>Start Time</strong></TableCell>
                      <TableCell><strong>End Time</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.map((report, index) => (
                      <TableRow
                        key={report._id || index}
                        component={motion.tr}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        hover
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {report.registrationId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {report.studentName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {report.studentId}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {report.instructorName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {report.instructorId}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {report.className}
                            </Typography>
                            {report.classDescription && (
                              <Typography variant="caption" color="text.secondary">
                                {report.classDescription}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(report.startTime)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(report.endTime)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={report.status || 'scheduled'}
                            color={report.status === 'cancelled' ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <TablePagination
                component="div"
                count={total}
                page={page - 1}
                onPageChange={handleChangePage}
                rowsPerPage={limit}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ReportTable;