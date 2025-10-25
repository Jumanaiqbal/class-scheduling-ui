import React from 'react';
import dayjs from 'dayjs';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Stack,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const ReportFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  onSearch,
  loading = false,
  filterOptions = {} 
}) => {
  const { instructors = [], students = [], classTypes = [] } = filterOptions;

  const handleFilterChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleDateChange = (field, date) => {
    handleFilterChange(field, date ? dayjs(date).format('YYYY-MM-DD') : '');
  };

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filter Reports
          </Typography>
          
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<ClearIcon />}
              onClick={onClearFilters}
              variant="outlined"
              size="small"
            >
              Clear All
            </Button>
          </Stack>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            {/* Date Range */}
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={filters.startDate ? dayjs(filters.startDate) : null}
                onChange={(date) => handleDateChange('startDate', date)}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="End Date"
                value={filters.endDate ? dayjs(filters.endDate) : null}
                onChange={(date) => handleDateChange('endDate', date)}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>

            {/* Instructor Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Instructor"
                value={filters.instructorId || ''}
                onChange={(e) => handleFilterChange('instructorId', e.target.value)}
              >
                <MenuItem value="">All Instructors</MenuItem>
                {instructors.map((instructor) => (
                  <MenuItem key={instructor.instructorId} value={instructor.instructorId}>
                    {instructor.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Student Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Student"
                value={filters.studentId || ''}
                onChange={(e) => handleFilterChange('studentId', e.target.value)}
              >
                <MenuItem value="">All Students</MenuItem>
                {students.map((student) => (
                  <MenuItem key={student.studentId} value={student.studentId}>
                    {student.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Class Type Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                size="small"
                label="Class Type"
                value={filters.classType || ''}
                onChange={(e) => handleFilterChange('classType', e.target.value)}
              >
                <MenuItem value="">All Class Types</MenuItem>
                {classTypes.map((classType) => (
                  <MenuItem key={classType.classId} value={classType.classId}>
                    {classType.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SearchIcon />}
              onClick={onSearch}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Reports'}
            </Button>
          </Box>
        </LocalizationProvider>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;