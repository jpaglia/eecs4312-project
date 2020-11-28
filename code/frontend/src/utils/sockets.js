import axios from 'axios';
const baseUrl = "http://localhost:5000/";

export function getRequest(path) {
  let url = `${baseUrl}${path}`;
  return axios.get(`${url}`);
}

export function postRequest(path, data) {
  let url = `${baseUrl}${path}`;
  return axios.post(`${url}`, data);
}


export function login(data) {
  return postRequest('login', data)
}

export function getAttendanceList(data) {
  return postRequest('getAttendanceList', data)
}

export function getStudentRecords(data) {
  return postRequest('getStudentRecords', data)
}

export function getTeacherClasses(data) {
  return postRequest('getTeacherClasses', data)
}