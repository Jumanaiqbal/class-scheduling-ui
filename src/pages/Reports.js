import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from '@mui/icons-material';
import { ReportFilters, ReportTable } from '../components/reports';
import { useApi } from '../hooks/useApi';
import { getClassesReport, getReportFilters } from '../services/api';

const Reports = () => {
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [hasSearched, setHasSearched] = useState(false);

  const { data: reportsData, loading: reportsLoading, error: reportsError, execute: fetchReports } = useApi(
    () => getClassesReport({ ...filters, ...pagination }),
    false
  );

  const { data: filterOptions, loading: filterOptionsLoading } = useApi(getReportFilters, true);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = () => {
    setHasSearched(true);
    fetchReports();
  };

  const handleClearFilters = () => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
    setHasSearched(false);
  };

  const handlePageChange = (page, limit = pagination.limit) => {
    setPagination({ page, limit });
    fetchReports();
  };

  const renderContent = () => {
    if (reportsError) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          An error occurred while fetching the reports. Please try again.
        </Alert>
      );
    }

    if (!hasSearched) {
      return (
        <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
          <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Reports Found
          </Typography>
          <Typography color="text.secondary">
            Use the filters above and click search to generate a report
          </Typography>
        </Paper>
      );
    }

    return (
      <ReportTable
        data={reportsData}
        loading={reportsLoading}
        pagination={{
          ...pagination,
          total: reportsData?.pagination?.total || 0
        }}
        onPageChange={handlePageChange}
      />
    );
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
            Class Reports
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analyze and filter class schedule data with advanced reporting
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12}>
          <ReportFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            onSearch={handleSearch}
            loading={reportsLoading}
            filterOptions={filterOptions?.filters || {}}
          />
        </Grid>

        {/* Report Content */}
        <Grid item xs={12}>
          {renderContent()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;