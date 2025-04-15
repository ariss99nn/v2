import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});

// Interceptor para agregar el token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function loginUsuario(username, password) {
  try {
    const response = await api.post("/token/", {
      username,
      password,
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || "Error al iniciar sesión");
    }
    throw error;
  }
}

export const registrarUsuario = async (datos) => {
  
    const response = await api.post("/register/", datos);
    return response.data;

};

export default api;