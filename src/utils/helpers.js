export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const downloadCSV = (content, filename = 'template.csv') => {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const validateCSV = (file) => {
  if (!file) return 'Please select a file';
  if (!file.name.endsWith('.csv')) return 'Please upload a CSV file';
  if (file.size > 5 * 1024 * 1024) return 'File size must be less than 5MB';
  return null;
};