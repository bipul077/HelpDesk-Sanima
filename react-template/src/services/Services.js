import axios from 'axios';
import { decodeToken } from "react-jwt";

export const login = async (username, password) => {
  return axios.post(process.env.REACT_APP_COMMON_API_URL + `api/central/login`, {username: username, password: password})
}

export const getBranches = async () => {
    return axios.get(process.env.REACT_APP_COMMON_API_URL + `api/central/branches`)
}

export const getProfilePhoto = () => {
  try{
    const decodedToken = decodeToken(localStorage.getItem('token'));
    const staffId = decodedToken.data.recordset[0].StaffId;

    return process.env.REACT_APP_COMMON_API_URL + 'api/central/staff/' + staffId + '/photo'
  } catch(error) {
    return 'avatars/default-user.jpg';
  }
}

export const Logout = () => {
  localStorage.clear();
  window.location.href = "#/";
}