import axios from "axios";

// Determine base URL based on environment
const getBaseURL = () => {
  if (import.meta.env.PROD) {
    // Production: Use relative path or your production domain
    return "/career-path-api/api";
  } else {
    // Development: Use proxy path
    return "/career-path-api/api";
  }
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- REQUEST INTERCEPTOR ----------------
api.interceptors.request.use(
  (config) => {
    // Security headers
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    config.headers["Accept"] = "application/json";

    // CSRF token handling
    const csrfToken = window.csrfToken;
    if (
      csrfToken &&
      ["post", "put", "patch", "delete"].includes(config.method)
    ) {
      config.data = config.data || {};
      config.data.csrf_token = csrfToken;
    }

    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error("Request interceptor error:", error);
    }
    return Promise.reject(error);
  }
);

// ---------------- RESPONSE INTERCEPTOR ----------------
api.interceptors.response.use(
  (response) => {
    // Store CSRF token if backend sends new token
    if (response.data?.csrf_token) {
      window.csrfToken = response.data.csrf_token;
    }
    return response;
  },

  (error) => {
    if (!error.response) {
      if (import.meta.env.DEV) {
        console.error("Network error:", error.message);
      }
      return Promise.reject({
        status: 0,
        message: "Network error - Please check your connection",
      });
    }

    const { status, data } = error.response;

    // Public endpoints that should not redirect on 401
    const publicEndpoints = [
      "/courses/index.php",
      "/courses/detail.php",
      "/categories/index.php",
      "/tests/index.php",
      "/tests/detail.php",
      "/current-affairs/index.php",
      "/current-affairs/detail.php",
      "/blogs/index.php",
      "/blogs/detail.php",
      "/materials/index.php",
      "/live-classes/index.php",
      "/auth/csrf-token.php",
      "/public/stats.php"
    ];

    if (status === 401) {
      const isPublic = publicEndpoints.some((e) =>
        error.config?.url?.includes(e)
      );
      if (!isPublic) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    const err = {
      status,
      message: data?.message || `HTTP ${status} Error`,
      errors: data?.errors || null,
      timestamp: data?.timestamp || null,
    };

    return Promise.reject(err);
  }
);

// ---------------- EXPORT UTILITY FUNCTIONS ----------------
export const apiUtils = {
  uploadFile: (url, formData, onProgress) => {
    return api.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      },
    });
  },

  retry: async (apiCall, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall();
      } catch (err) {
        if (i === maxRetries - 1) throw err;
        await new Promise((r) => setTimeout(r, delay * (i + 1)));
      }
    }
  },

  batch: (requests) => {
    return Promise.allSettled(requests.map((req) => api(req)));
  },
};

export default api;