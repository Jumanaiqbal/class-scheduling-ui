import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
} from '@mui/material';
import { Save as SaveIcon, Refresh as ResetIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';

const ConfigForm = ({ config, onSave, onReset, loading = false }) => {
  const originalRef = useRef({});

  const UI_TO_BACKEND = {
    classDuration: 'CLASS_DURATION',
    maxStudentClasses: 'MAX_STUDENT_CLASSES_PER_DAY',
    maxInstructorClasses: 'MAX_INSTRUCTOR_CLASSES_PER_DAY',
  };

  const defaultValues = {
    notifications: config?.notifications !== false,
    classDuration: config?.classDuration || 45,
    maxStudentClasses: config?.maxStudentClasses || 3,
    maxInstructorClasses: config?.maxInstructorClasses || 5,
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues });

  useEffect(() => {
    const initial = {
      notifications: config?.notifications !== false,
      classDuration: config?.classDuration || 45,
      maxStudentClasses: config?.maxStudentClasses || 3,
      maxInstructorClasses: config?.maxInstructorClasses || 5,
    };
    reset(initial);
    originalRef.current = initial;
  }, [config, reset]);

  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  const handleSave = async (data) => {
    try {
      const UPDATABLE_KEYS = [
        'classDuration',
        'maxStudentClasses',
        'maxInstructorClasses',
      ];

      const original = originalRef.current || {};
      const changed = {};
      const skipped = [];

      Object.entries(data).forEach(([k, v]) => {
        if (!UPDATABLE_KEYS.includes(k)) {
          skipped.push(k);
          return;
        }
        const prev = original[k];
        if (prev !== v) changed[k] = v;
      });

      if (Object.keys(changed).length === 0) {
        if (skipped.length) {
          setSaveStatus({
            type: 'info',
            message: `No editable changes. Skipped: ${skipped.join(', ')}`,
          });
        } else {
          setSaveStatus({ type: 'info', message: 'No changes to save.' });
        }
        return;
      }

      // map UI keys to backend canonical keys
      const mappedPayload = {};
      Object.entries(changed).forEach(([uiKey, value]) => {
        const backendKey = UI_TO_BACKEND[uiKey] || uiKey;
        mappedPayload[backendKey] = value;
      });

      // onSave is expected to accept a plain object of backendKey: value
      await onSave(mappedPayload);

      // update original snapshot (keep it in UI-key space)
      originalRef.current = { ...original, ...changed };

      let msg = 'Configuration saved successfully!';
      if (skipped.length) msg += ` (skipped: ${skipped.join(', ')})`;
      setSaveStatus({ type: 'success', message: msg });
    } catch (error) {
      // API may return structured details for per-key failures
      const msg = error?.message || 'Failed to save configuration';
      const details = error?.details;
      if (details && Array.isArray(details)) {
        // details might be [{ key, status, error }, ...]
        const errors = details
          .filter((d) => d.status === 'error')
          .map((d) => `${d.key}: ${d.error || d.message}`);
        if (errors.length) {
          setSaveStatus({
            type: 'error',
            message: `Some keys failed: ${errors.join('; ')}`,
          });
          console.error('Config save error details:', details);
          return;
        }
      }
      if (details) console.error('Config save error details:', details);
      else console.error('Config save error:', error);
      setSaveStatus({ type: 'error', message: msg });
    }
  };

  const handleReset = () => {
    const defaults = {
      notifications: true,
      classDuration: 45,
      maxStudentClasses: 3,
      maxInstructorClasses: 5,
    };
    reset(defaults);
    originalRef.current = defaults;
    onReset?.();
    setSaveStatus({
      type: 'info',
      message: 'Configuration reset to defaults!',
    });
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
          {/* Business Rules */}
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              sx={{ mt: 2 }}
            >
              Business Rules
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="classDuration"
              control={control}
              rules={{ required: true, min: 15, max: 180 }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Class Duration (minutes)"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 45)
                  }
                  inputProps={{ min: 15, max: 180 }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="maxStudentClasses"
              control={control}
              rules={{ required: true, min: 1, max: 10 }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Max Student Classes/Day"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 3)
                  }
                  inputProps={{ min: 1, max: 10 }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="maxInstructorClasses"
              control={control}
              rules={{ required: true, min: 1, max: 15 }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Max Instructor Classes/Day"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 5)
                  }
                  inputProps={{ min: 1, max: 15 }}
                />
              )}
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box
              display="flex"
              gap={2}
              justifyContent="flex-end"
              sx={{ mt: 2 }}
            >
              <Button
                startIcon={<ResetIcon />}
                onClick={handleReset}
                variant="outlined"
                disabled={loading || isSubmitting}
              >
                Reset to Defaults
              </Button>
              <Button
                startIcon={<SaveIcon />}
                onClick={handleSubmit(handleSave)}
                variant="contained"
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? 'Saving...' : 'Save Configuration'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ConfigForm;
