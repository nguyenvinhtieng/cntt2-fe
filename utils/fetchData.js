import axios from "axios";
import { CREDENTIALS } from "~/redux/constants";
const SERVER_URL = CREDENTIALS.BACKEND_URL;
const TOKEN_NAME = CREDENTIALS.TOKEN_NAME;

export const getMethod = async (url) => {
  let token = localStorage.getItem(TOKEN_NAME);
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const res = await axios.get(`${SERVER_URL}/${url}`);
  return res;
};
export const postMethod = async (url, data) => {
  let token = localStorage.getItem(TOKEN_NAME);
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const res = await axios.post(`${SERVER_URL}/${url}`, data);
  return res;
};
export const postMethodMultipart = async (url, data) => {
  let token = localStorage.getItem(TOKEN_NAME);
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const res = await axios.post(`${SERVER_URL}/${url}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res;
};

export const putMethod = async (url, data) => {
  let token = localStorage.getItem(TOKEN_NAME);
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const res = await axios.put(`${SERVER_URL}/${url}`, data);
  return res;
};
export const deleteMethod = async (url, data) => {
  let token = localStorage.getItem(TOKEN_NAME);
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const res = await axios.delete(`${SERVER_URL}/${url}`, data);
  return res;
};