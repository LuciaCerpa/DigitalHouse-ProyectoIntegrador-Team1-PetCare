import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error en el registro:", error.response?.data || error.message);
    // throw error;
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Error en el login:", error.response?.data || error.message);
    // throw error;
  }
};
