import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost/career-path-api/api',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for httpOnly cookies and CSRF
  timeout: 30000, // 30 second timeout
});

// Request interceptor for security headers
api.interceptors.request.use(
  (config) => {
    // Add security headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    // Add CSRF token if available
    const csrfToken = window.csrfToken;
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
      config.data = config.data || {};
      config.data.csrf_token = csrfToken;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Store CSRF token if provided
    if (response.data?.csrf_token) {
      window.csrfToken = response.data.csrf_token;
    }
    
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    const { status, data } = error.response;
    
    // Handle different error types
    switch (status) {
      case 401:
        // Only redirect for protected endpoints
        const publicEndpoints = [
          '/courses/index.php',
          '/courses/detail.php',
          '/categories/index.php',
          '/tests/index.php',
          '/tests/detail.php',
          '/current-affairs/index.php',
          '/current-affairs/detail.php',
          '/blogs/index.php',
          '/blogs/detail.php',
          '/materials/index.php',
          '/live-classes/index.php',
          '/auth/csrf-token.php',
          '/test-cors.php'
        ];
        
        const isPublicEndpoint = publicEndpoints.some(endpoint => 
          error.config?.url?.includes(endpoint)
        );
        
        if (!isPublicEndpoint) {
          // Clear any stored auth data
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          
          // Redirect to login if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = "/login";
          }
        }
        break;
        
      case 403:
        console.error('Access forbidden:', data?.message);
        break;
        
      case 429:
        console.error('Rate limit exceeded:', data?.message);
        break;
        
      case 500:
        console.error('Server error:', data?.message);
        break;
        
      default:
        console.error(`HTTP ${status}:`, data?.message);
    }
    
    // Return structured error
    const errorMessage = data?.message || `HTTP ${status} Error`;
    const errorDetails = {
      status,
      message: errorMessage,
      errors: data?.errors,
      timestamp: data?.timestamp
    };
    
    return Promise.reject(errorDetails);
  }
);

// Utility functions for common API patterns
export const apiUtils = {
  // Handle file uploads with progress
  uploadFile: (url, formData, onProgress) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },
  
  // Retry failed requests
  retry: async (apiCall, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  },
  
  // Batch requests
  batch: (requests) => {
    return Promise.allSettled(requests.map(req => api(req)));
  }
};

export default api;
