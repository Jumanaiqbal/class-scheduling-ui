// Base URL for API calls. Prefer environment variable override; fallback updated to port 5001.
// If you change backend PORT again, either set REACT_APP_API_URL in a .env file or update this constant.
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export const ROUTES = {
  DASHBOARD: "/",
  UPLOAD: "/upload",
  REPORTS: "/reports",
  CONFIG: "/config",
};

export const CSV_TEMPLATE = `Registration ID,Student ID,Instructor ID,Class ID,Class Start Time,Action
null,1001,2001,DRV101,10/25/2024 09:00,new
REG555001,1001,2002,DRV102,10/25/2024 14:00,update
REG333001,null,null,null,null,delete`;

export const NAV_ITEMS = [
  { path: ROUTES.DASHBOARD, label: "Dashboard", icon: "dashboard" },
  { path: ROUTES.UPLOAD, label: "Upload CSV", icon: "upload" },
  { path: ROUTES.REPORTS, label: "Reports", icon: "assessment" },
  { path: ROUTES.CONFIG, label: "Configuration", icon: "settings" },
];

export const validateCSV = (file) => {
  if (!file) return "No file selected";

  if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
    return "Invalid file type. Please upload a CSV file";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "File size too large. Maximum size is 5MB";
  }

  return null;
};

export const downloadCSV = () => {
  const element = document.createElement("a");
  const file = new Blob([CSV_TEMPLATE], { type: "text/csv" });
  element.href = URL.createObjectURL(file);
  element.download = "registration_template.csv";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
