import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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

const StatsChart = ({ data, onDaysChange, days = 30 }) => {
  const processedData = React.useMemo(() => {
    if (!data?.data?.dailyStats) return [];
    const weekdayMap = {
      0: { day: 'Sun', count: 0 },
      1: { day: 'Mon', count: 0 },
      2: { day: 'Tue', count: 0 },
      3: { day: 'Wed', count: 0 },
      4: { day: 'Thu', count: 0 },
      5: { day: 'Fri', count: 0 },
      6: { day: 'Sat', count: 0 },
    };
    data.data.dailyStats.forEach(({ date, count }) => {
      const d = new Date(date);
      const weekday = d.getDay();
      if (weekdayMap[weekday]) {
        weekdayMap[weekday].count += count;
      }
    });
    // Return Mon-Sun order
    return [
      weekdayMap[1],
      weekdayMap[2],
      weekdayMap[3],
      weekdayMap[4],
      weekdayMap[5],
      weekdayMap[6],
      weekdayMap[0],
    ];
  }, [data]);

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      sx={{
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 2px 8px 0 rgb(60 64 67 / .10)',
        bgcolor: '#fff',
        border: '1px solid #e0f2f2',
        p: 3,
        mt: 1,
      }}
    >
      <CardContent>
        <Box
          mb={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              mb: 1,
              fontFamily: 'Google Sans, sans-serif',
              color: '#222',
              letterSpacing: '-0.5px',
            }}
          >
            Classes per day
          </Typography>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="date-range-label">Date Range</InputLabel>
            <Select
              labelId="date-range-label"
              value={days}
              label="Date Range"
              onChange={(e) => onDaysChange(Number(e.target.value))}
            >
              <MenuItem value={7}>Last 7 days</MenuItem>
              <MenuItem value={30}>Last 30 days</MenuItem>
              <MenuItem value={90}>Last 90 days</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart
            data={processedData}
            margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#DADCE0" />
            <XAxis
              dataKey="day"
              tick={{
                fontSize: 14,
                fill: '#5F6368',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tick={{
                fontSize: 12,
                fill: '#5F6368',
                fontFamily: 'Roboto, sans-serif',
              }}
              allowDecimals={false}
              domain={[0, 25]}
              axisLine={false}
              tickLine={false}
              width={32}
              padding={{ top: 10, bottom: 10 }}
              interval={0}
            />
            <Tooltip
              formatter={(value) => [`${value} classes`, '']}
              contentStyle={{
                backgroundColor: '#202124',
                borderRadius: 8,
                border: 'none',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                fontSize: 12,
                color: '#fff',
                fontFamily: 'Roboto, sans-serif',
                padding: 10,
              }}
              labelStyle={{
                color: '#fff',
                fontFamily: 'Google Sans, sans-serif',
                fontSize: 14,
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#00838A"
              strokeWidth={2}
              dot={{ fill: '#00838A', stroke: '#fff', strokeWidth: 2, r: 4 }}
              activeDot={{
                r: 6,
                fill: '#fff',
                stroke: '#00838A',
                strokeWidth: 2,
              }}
              isAnimationActive={true}
              fillOpacity={1}
              fill="url(#gradient)"
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00838A" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#00838A" stopOpacity={0} />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
export default StatsChart;
