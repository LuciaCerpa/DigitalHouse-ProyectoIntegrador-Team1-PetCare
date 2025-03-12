import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
    baseURL: `${API_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the token in every request
instance.interceptors.request.use(
    (config) => {
        // Get the token from localStorage before each request
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('No token found in localStorage');
        }

        console.log("Request:", {
            url: config.url,
            headers: config.headers,
        });

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 (Unauthorized) or 403 (Forbidden) errors
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.error('Authentication error:', error.response.status);
            localStorage.removeItem('token'); // Clear invalid token
            //window.location.href = '/'; // Redirect to home/login
        }

        console.error("Error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });

        return Promise.reject(error);
    }
);

export default instance;