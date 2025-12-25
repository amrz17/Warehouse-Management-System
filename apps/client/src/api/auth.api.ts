import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
});

export const loginApi = (data: {
    email: string,
    password: string
}) => api.post("/api/users/login", {
    user: data
});

export const registerApi = (data: {
    name: string,
    username: string,
    email: string,
    password: string,
    role: string,
}) => api.post("/api/users", data);