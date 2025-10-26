import axiosInstance from './axiosConfig';

export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append('csvFile', file);

  const response = await axiosInstance.post('/registrations/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getRegistrations = async (filters = {}) => {
  const response = await axiosInstance.get('/registrations', {
    params: filters,
  });
  return response.data;
};

export const getDashboardStats = async (days = 30) => {
  const response = await axiosInstance.get('/dashboard/stats', {
    params: { days },
  });
  return response.data;
};

export const getClassesReport = async (filters = {}) => {
  const response = await axiosInstance.get('/reports/classes', {
    params: filters,
  });
  return response.data;
};

export const getReportFilters = async () => {
  const response = await axiosInstance.get('/reports/filters');
  return response.data;
};

export const getConfig = async () => {
  const response = await axiosInstance.get('/config');
  return response.data;
};

export const updateConfig = async (configData) => {
  // If caller already passed single { key, value }, send it directly
  if (
    configData &&
    typeof configData === 'object' &&
    'key' in configData &&
    'value' in configData
  ) {
    const response = await axiosInstance.put('/config', configData);
    return response.data.data || response.data;
  }

  // If caller passed an array of {key,value} objects, send them in parallel
  if (Array.isArray(configData)) {
    const promises = configData.map((item) =>
      axiosInstance
        .put('/config', item)
        .then((r) => ({ key: item.key, ok: true, data: r.data.data || r.data }))
        .catch((err) => ({
          key: item.key,
          ok: false,
          error: err.response?.data || err.message,
        }))
    );
    const results = await Promise.all(promises);
    const failures = results.filter((r) => !r.ok);
    if (failures.length) {
      const err = new Error('One or more config updates failed');
      err.details = results;
      throw err;
    }
    return { results };
  }

  // If caller provided a plain object of multiple keys, convert to per-key calls
  if (configData && typeof configData === 'object') {
    const entries = Object.entries(configData);
    const results = [];
    for (const [key, value] of entries) {
      try {
        const payload = { key, value };
        const res = await axiosInstance.put('/config', payload);
        results.push({ key, ok: true, data: res.data.data || res.data });
      } catch (err) {
        const failure = {
          key,
          ok: false,
          error: err.response?.data || err.message,
        };
        results.push(failure);
        const ex = new Error(`Failed to update config key=${key}`);
        ex.details = { key, error: err.response?.data || err.message, results };
        throw ex;
      }
    }
    return { results };
  }

  // Fallback: send whatever was provided
  const response = await axiosInstance.put('/config', configData);
  return response.data.data || response.data; // Handle both data structures
};

export const getUIConfig = async () => {
  const response = await axiosInstance.get('/config/ui');
  return response.data.data || response.data; // Handle both data structures
};

export const getStudents = async () => {
  const response = await axiosInstance.get('/students');
  return response.data;
};

export const getInstructors = async () => {
  const response = await axiosInstance.get('/instructors');
  return response.data;
};

export const getClassTypes = async () => {
  const response = await axiosInstance.get('/class-types');
  return response.data;
};

export const autoCreateStudents = async (studentIds) => {
  const response = await axiosInstance.post('/students/auto-create', {
    studentIds,
  });
  return response.data;
};

export const bulkUpdateConfig = async (configs) => {
  // Prefer bulk endpoint if available
  try {
    const response = await axiosInstance.put('/config/bulk', { configs });
    return response.data;
  } catch (err) {
    // Fallback: send per-key updates sequentially and return aggregated result
    const results = [];
    for (const item of configs) {
      const key = item.key || item.name || null;
      const value = item.value ?? item.val ?? item;
      if (!key) {
        results.push({ key: null, ok: false, error: 'Missing key' });
        continue;
      }
      try {
        const res = await axiosInstance.put('/config', { key, value });
        results.push({ key, ok: true, data: res.data });
      } catch (e) {
        results.push({ key, ok: false, error: e.response?.data || e.message });
      }
    }
    return { results };
  }
};
export const getDashboardSummary = async () => {
  const response = await axiosInstance.get('/dashboard/summary');
  return response.data;
};
