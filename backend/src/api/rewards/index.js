import axios from 'axios';

const coupomatedClient = axios.create({
  baseURL: 'https://api.coupomated.com',
  timeout: 1000 * 60 * 2, // Abort the response after 2mins
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

export default coupomatedClient;
