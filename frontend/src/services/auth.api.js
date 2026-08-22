import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

export const registerUser = async (userData) => {
  const response = await API.post("/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await API.post("/login", userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post("/logout");
  return response.data;
};

export const getUserProfile = async () => {
  const response = await API.get("/profile");
  return response.data;
};