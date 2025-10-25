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
  const response = await axiosInstance.get('/registrations', { params: filters });
  return response.data;
};

export const getDashboardStats = async (days = 30) => {
  const response = await axiosInstance.get('/dashboard/stats', { params: { days } });
  return response.data;
};

export const getClassesReport = async (filters = {}) => {
  const response = await axiosInstance.get('/reports/classes', { params: filters });
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
  const response = await axiosInstance.post('/students/auto-create', { studentIds });
  return response.data;
};

export const bulkUpdateConfig = async (configs) => {
  const response = await axiosInstance.put('/config/bulk', { configs });
  return response.data;
};