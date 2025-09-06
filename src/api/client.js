import axios from 'axios';
const API=import.meta.env.VITE_API_URL;
const client=axios.create({baseURL:API,timeout:3000});
client.interceptors.request.use(cfg => {
    const token=localStorage.getItem('token');
    if(token) cfg.headers.Authorization=`Bearer ${token}`;
    return cfg;
});
export default client;