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

export function getSchoolName(data) {
  return postRequest('getSchoolName', data)
}

export function getListOfClasses(data) {
  return postRequest('getListOfClasses', data)
}

export function getAttendanceList(data) {
  return postRequest('getAttendanceList', data)
}

export function notifyParents(data) {
  return postRequest('notifyParents', data)
}

export function updateAttendanceRecord(data) {
  return postRequest('updateAttendanceRecord', data)
}

export function addParent(data) {
  return postRequest('addParent', data)
}

export function removeParent(data) {
  return postRequest('removeParent', data)
}

export function addTeacher(data) {
  return postRequest('addTeacher', data)
}

export function removeTeacher(data) {
  return postRequest('removeTeacher', data)
}

export function getStudentRecords(data) {
  return postRequest('getStudentRecords', data)
}

export function getTeacherClasses(data) {
  return postRequest('getTeacherClasses', data)
}

export function getClassData(data) {
  return postRequest('getClassData', data)
}

export function getAttendanceStatus(data) {
  return postRequest('getAttendanceStatus', data)
}

export function getChildren(data) {
  return postRequest('getChildren', data)
}

export function getChildClasses(data) {
  return postRequest('getChildClasses', data)
}

export function getNotifications(data) {
  return postRequest('getNotifications', data)
}

export function reportChild(data) {
  return postRequest('reportChild', data)
}

export function getTeacherHistoricalAttendanceList(data) {
  return postRequest('getTeacherHistoricalAttendanceList', data)
}

export function addRecords(data) {
  return postRequest('addRecords', data)
}