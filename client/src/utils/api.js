import qs from 'qs';
import {
  BASE_URL,
  REGISTER_ENDPOINT,
  LOGIN_ENDPOINT,
  USER_ENDPOINT,
  LOGOUT_ENDPOINT,
  DASHBOARD_ENDPOINT,
  SESSION_COOKIE_NAME,
  SUBMIT_ENDPOINT
} from './constants';
import { getCookie } from './cookie';

const register = (username, email, password) => {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    body: qs.stringify({
      username: username,
      email: email,
      password: password
    })
  };

  return fetch(BASE_URL + REGISTER_ENDPOINT, options)
    .then(res => res.json());
};

const login = (username, password) => {
  const options = {
    method: 'post',
    credentials: 'include', // Don't forget to specify this if you need cookies
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    body: qs.stringify({
      username: username,
      password: password
    })
  };
  return fetch(BASE_URL + LOGIN_ENDPOINT, options)
    .then(res => res.json());
};

const getUser = () => {
  const options = {
    method: 'get',
    //credentials: 'include' // Don't forget to specify this if you need cookies
    headers: {
      'Authorization': `Bearer ${getCookie(SESSION_COOKIE_NAME)}`
    },
  };
  return fetch(BASE_URL + USER_ENDPOINT, options)
    .then(res => res.json());
};

const logout = () => {
  const options = {
    method: 'get',
    credentials: 'same-origin', // Don't forget to specify this if you need cookies
    headers: {
      'Authorization': `Bearer ${getCookie(SESSION_COOKIE_NAME)}`
    },
  };
  document.cookie = "_sid= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  return fetch(BASE_URL + LOGOUT_ENDPOINT, options)
    .then(res => res.json());
};

const loadDashboard = () => {
  const options = {
    method: 'get',
    //credentials: 'include' // Don't forget to specify this if you need cookies
    headers: {
      'Authorization': `Bearer ${getCookie(SESSION_COOKIE_NAME)}`
    },
  };
  return fetch(BASE_URL + DASHBOARD_ENDPOINT, options)
    .then(res => res.json());
};

const submit = (X, Y, R) => {
  const options = {
    method: 'post',
    credentials: 'same-origin', // Don't forget to specify this if you need cookies
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': `Bearer ${getCookie(SESSION_COOKIE_NAME)}`
    },
    body:qs.stringify({
      X: X,
      Y: Y,
      R: R
    })
  };
  return fetch(BASE_URL + SUBMIT_ENDPOINT, options)
      .then(res => res.json());
};

export default {
  register, login, getUser, logout, loadDashboard, submit
};
