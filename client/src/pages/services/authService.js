import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth";

function setToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

function removeToken() {
  localStorage.removeItem("token");
}

function setUserRole(role) {
  sessionStorage.setItem("userRole", role);
}

function getUserRole() {
  return sessionStorage.getItem("userRole");
}

function removeUserRole() {
  sessionStorage.removeItem("userRole");
}

function authHeader() {
  const token = getToken();
  return token ? { Authorization: "Bearer " + token } : {};
}

async function login(email, password) {
  try {
    const response = await axios.post(API_BASE_URL + "/login", {
      email,
      password,
    });

    if (response.data.token) {
      setToken(response.data.token);

      if (response.data.user && response.data.user.role) {
        setUserRole(response.data.user.role);
      } else {
      }
    } else {
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error in login:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    } else {
    }
    throw error;
  }
}

async function logout() {
  try {
    await axios.post(
      API_BASE_URL + "/logout",
      {},
      {
        headers: authHeader(),
      }
    );
  } catch (error) {
  } finally {
    removeToken();
    removeUserRole();
  }
}

async function getCurrentUser() {
  try {
    const response = await axios.get(API_BASE_URL + "/me", {
      headers: authHeader(),
    });

    if (response.data && response.data.role) {
      setUserRole(response.data.role);
    } else {
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error in getCurrentUser:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 401) {
        removeToken();
        removeUserRole();
      }
    } else {
    }
    throw error;
  }
}

function isAdmin() {
  const role = getUserRole();
  return role === "admin";
}

function isAuthenticated() {
  const token = getToken();
  return !!token;
}

const authService = {
  login,
  logout,
  getCurrentUser,
  getToken,
  setToken,
  authHeader,
  isAdmin,
  getUserRole,
  isAuthenticated,
};

export default authService;
