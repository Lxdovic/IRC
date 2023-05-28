import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",

  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  async (config) => {
    let accessToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    if (accessToken) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${accessToken}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const refreshToken = localStorage.getItem("refreshToken");

//     const config = error?.config;

//     if (error?.response?.status === 403 && !config?.sent) {
//       config.sent = true;

//       const result = await axios.get("http://localhost:3000/refresh", {
//         headers: { authorization: `Bearer ${refreshToken}` },
//       });

//       if (result?.data.accessToken) {
//         config.headers = {
//           ...config.headers,
//           authorization: `Bearer ${result?.data.accessToken}`,
//         };

//         let accessToken = result?.data.accessToken;

//         localStorage.setItem("accessToken", accessToken);
//       }

//       return axios(config);
//     }
//     return Promise.reject(error);
//   }
// );

// API.interceptors.request.use((req) => {
//     // const token = JSON.parse(localStorage.getItem("accessToken"));
//     const token = localStorage.getItem("accessToken")
//     if (token) {
//         console.log("yes token", token);
//         req.headers.Authorization = `Bearer ${token}`
//     };
//     return req;
// });

export const post = (url, formData) => API.post(url, formData);
export const patch = (url, formData) => API.patch(url, formData);
export const del = (url, formData) => API.delete(url, formData);
export const get = (url) => API.get(url);
// export const getOne = (url,id) => API.get(`${url}/${id}`);

export default API;
