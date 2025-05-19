import Cookies from "js-cookie";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:5173',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    // Attach token if available (for protected routes)
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Make sure error.response exists before accessing properties
    if (!error.response) {
      console.error("Network error or CORS issue:", error.message);
      return Promise.reject(error);
    }
    
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await AuthService.getRefreshToken();
        return api(originalRequest);
      } catch (err) {
        console.error("Error refreshing token", err);
        return Promise.reject(err);
      }
    }
    
    // Log error information to help with debugging
    if (error.response.status === 403) {
      console.error("CORS or authorization error:", error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Direct service methods without React hooks
export const AuthService = {
  register: async (userData) => {
    try {
      const response = await api.post("/user/register", userData);
      return {
        success: true,
        accessToken: response.data.accessToken,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },
  login: async (email, password) => {
    const res = await api.post("/user/login", { email, password })
    return res.data
  },
  logout: async () => {
    try {
      await api.post("/user/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },
  getRefreshToken: async () => {
    try {
      const response = await api.post("/user/get-accessToken", {
        refreshToken: Cookies.get("refreshToken"),
      });
      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        Cookies.set("accessToken", response.data.data.accessToken);
      }
      return response.data;
    } catch (error) {
      console.error("Error refreshing token", error);
      throw error;
    }
  },
  loginWithGoogle: async (accessToken) => {
    try {
      const response = await api.get(`/user/google?code=${accessToken}`);
      console.log("Google auth response:", response?.data);
      
      // Make sure we have a valid response with the necessary data
      if (response && response.data && response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return {
          success: true,
          accessToken: response.data.accessToken,
          data: { user: response.data.user },
        };
      } else if (response && response.data && response.data.data) {
        // Handle nested response structure
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        return {
          success: true,
          accessToken: response.data.data.accessToken,
          data: { user: response.data.data.user },
        };
      }
      
      return {
        success: false,
        message: "Login failed: Invalid response format",
      };
    } catch (error) {
      console.error("Google login error:", error);
      // Properly handle network errors and CORS issues
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Network error during login",
      };
    }
  },
};



