import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

// Allow env override (e.g. REACT_APP_API_BASE_URL) and fallback to constant
const resolvedBaseURL = process.env.REACT_APP_API_BASE_URL || API_BASE_URL;

// Create axios instance with default config
const useCredentials = process.env.REACT_APP_USE_CREDENTIALS === "true";
const axiosInstance = axios.create({
  baseURL: resolvedBaseURL,
  timeout: 60000, // Increased timeout to 60 seconds
  headers: {
    "Content-Type": "application/json",
  },
  // Only send cookies if explicitly enabled via env; default false for token auth
  withCredentials: useCredentials,
});

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add retry count to config
    config.retryCount = config.retryCount || 0;

    // Attach auth token if present
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.config.url}`);
    return response;
  },
  async (error) => {
    const config = error.config || {};

    // Auth / permission handling & AirTunes (macOS) port conflict detection
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.warn("🔐 Unauthorized: Token missing/expired.");
        return Promise.reject(error);
      }
      if (status === 403) {
        const serverHeader = error.response.headers?.server;
        if (serverHeader && /AirTunes/i.test(serverHeader)) {
          // Likely hitting macOS AirPlay service instead of backend -> backend not running or port conflict
          let occupiedPort = "5000";
          try {
            const parsed = new URL(resolvedBaseURL);
            occupiedPort = parsed.port || occupiedPort;
          } catch {
            /* ignore parsing issues */
          }
          const msg = `Backend unreachable on port ${occupiedPort}: macOS AirPlay (AirTunes) is responding. Change backend .env PORT (e.g. 5001) and update REACT_APP_API_URL / API_BASE_URL, then restart both servers.`;
          const airTunesError = new Error(msg);
          airTunesError.originalError = error;
          airTunesError.isAxiosError = true;
          airTunesError.config = config;
          airTunesError.response = error.response;
          console.warn("⚠️ AirTunes port conflict detected.");
          return Promise.reject(airTunesError);
        }
        console.warn(
          "🚫 Forbidden: Insufficient permissions for this resource."
        );
        return Promise.reject(error);
      }
    }

    // Check if we should retry the request (network/timeout/selected status codes)
    const shouldRetry =
      (config.retryCount ?? 0) < MAX_RETRIES &&
      (error.code === "ECONNABORTED" || // Timeout
        error.code === "ERR_NETWORK" || // Network error
        (error.response && RETRY_STATUS_CODES.includes(error.response.status)));

    if (shouldRetry) {
      config.retryCount = (config.retryCount || 0) + 1;
      const delayTime = RETRY_DELAY * Math.pow(2, config.retryCount - 1); // Exponential backoff
      console.log(
        `🔄 Retrying request (${config.retryCount}/${MAX_RETRIES}) after ${delayTime}ms: ${config.url}`
      );
      await sleep(delayTime);
      return axiosInstance(config);
    }

    // Attempt health probe for pure network errors (no response) to improve diagnostics
    let healthStatus;
    if (error.code === "ERR_NETWORK" && !error.response) {
      try {
        const healthURL = resolvedBaseURL.replace(/\/$/, "") + "/health";
        const res = await fetch(healthURL, { method: "GET" });
        if (res.ok) {
          healthStatus = "reachable";
        } else {
          healthStatus = `unreachable (status ${res.status})`;
        }
      } catch (probeErr) {
        healthStatus = "unreachable";
      }
    }

    // Final error logging
    console.error(
      `❌ API Error (${error.code || error.response?.status || "UNKNOWN"}): ${
        config.url
      }`,
      error.response?.data || error.message,
      healthStatus ? `| Health probe: ${healthStatus}` : ""
    );

    // Tailored user-facing messages
    let errorMessage;
    if (error.code === "ECONNABORTED") {
      errorMessage = "Request timed out. Please try again.";
    } else if (error.code === "ERR_NETWORK" && !error.response) {
      errorMessage =
        healthStatus === "reachable"
          ? "Network error. Backend reachable but request failed—check endpoint path."
          : "Backend appears down or unreachable. Verify server running.";
    } else if (error.response?.status === 404) {
      errorMessage = "Requested resource not found.";
    } else {
      errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred";
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.isAxiosError = true;
    enhancedError.config = config;
    enhancedError.response = error.response;

    return Promise.reject(enhancedError);
  }
);

export default axiosInstance;
