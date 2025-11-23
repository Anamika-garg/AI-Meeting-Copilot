// API service for authentication
const API_BASE_URL = "http://localhost:5000/api/auth";

// Helper function to handle API responses
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (e) {
    // If response is not JSON, throw a generic error
    throw new Error("Server error: Invalid response format");
  }
  
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

// Signup API call
export const signup = async (name, email, password, confirmPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword,
      }),
    });
    return handleResponse(response);
  } catch (error) {
    // Handle network errors
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      throw new Error("Cannot connect to server. Please make sure the backend server is running on port 5000.");
    }
    throw error;
  }
};

// Login API call
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    return handleResponse(response);
  } catch (error) {
    // Handle network errors
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      throw new Error("Cannot connect to server. Please make sure the backend server is running on port 5000.");
    }
    throw error;
  }
};

// Token management
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem("user");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Logout function
export const logout = () => {
  removeToken();
  removeUser();
};

