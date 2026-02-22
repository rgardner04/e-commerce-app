import axios from "axios";

const clientAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default async function sendRequest(path, method, data) {
  const response = await clientAxiosInstance({
    url: path,
    method: method,
    data: data,
  });

  return response.data;
}
