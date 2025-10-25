import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

const StatsChart = ({ data, onDaysChange, days = 30, loading = false, error = null }) => {
  // Process the data to fill in missing dates
  const processedData = useMemo(() => {
    if (!data?.data?.dailyStats) return [];

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const dateMap = new Map(
      data.data.dailyStats.map(item => [item.date, item.count])
    );

    const allDates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      allDates.push({
        date: dateString,
        count: dateMap.get(dateString) || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return allDates;
  }, [data, days]);

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      sx={{ height: '100%' }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={600}>
            Class Schedule Trends
          </Typography>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={days}
              label="Period"
              onChange={(e) => onDaysChange(e.target.value)}
            >
              <MenuItem value={7}>Last 7 days</MenuItem>
              <MenuItem value={30}>Last 30 days</MenuItem>
              <MenuItem value={90}>Last 90 days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box height={300}>
            <Skeleton variant="rectangular" height={300} animation="wave" />
          </Box>
        ) : error ? (
          <Box height={300} display="flex" alignItems="center" justifyContent="center">
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          </Box>
        ) : processedData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                allowDecimals={false}
                domain={[0, 'auto']}
              />
              <Tooltip 
                formatter={(value) => [`${value} classes`, 'Scheduled']}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 8,
                  border: '1px solid #eee',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#1976d2"
                strokeWidth={3}
                dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#42a5f5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Box height={300} display="flex" alignItems="center" justifyContent="center">
            <Typography color="text.secondary" textAlign="center">
              No data available for the selected period.
              <br />
              <Typography variant="body2" component="span">
                Upload CSV files to see class schedule trends.
              </Typography>
            </Typography>
          </Box>
        )}

        {processedData.length > 0 && !loading && !error && (
          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              Showing {processedData.length} days of data
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total classes: {processedData.reduce((sum, item) => sum + item.count, 0)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsChart;