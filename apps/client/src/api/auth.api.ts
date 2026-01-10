import api from "./axios" 

// Login User
export const loginApi = (data: {
    email: string,
    password: string
}) => api.post("/users/login", {
    user: data
});

// Register User
export const registerApi = (data: {
    name: string,
    username: string,
    email: string,
    password: string,
    role: string,
}) => api.post("/users", data);
