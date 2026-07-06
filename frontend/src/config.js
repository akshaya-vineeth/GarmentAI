// API base URL resolution:
// 1) Uses VITE_BACKEND_URL in deployment (recommended)
// 2) Falls back to localhost for local development
const RAW_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

// Remove trailing slash to avoid double-slash routes
export const BACKEND_URL = RAW_BACKEND_URL.replace(/\/$/, '');
