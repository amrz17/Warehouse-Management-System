import api from "./axios" 


export const loginApi = (data: {
    email: string,
    password: string
}) => api.post("/users/login", {
    user: data
});

export const registerApi = (data: {
    name: string,
    username: string,
    email: string,
    password: string,
    role: string,
}) => api.post("/users", data);