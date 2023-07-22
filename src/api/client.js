import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

export default client;
