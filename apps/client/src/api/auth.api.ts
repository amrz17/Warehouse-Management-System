import api from "./axios" 

// Login User
export const loginApi = (data: {
    email: string,
    password: string
}) => api.post("/user/login", {
    user: data
});

// Logout User
export const logoutApi = (token: string) => 
    api.post("/user/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
});

// Register User
export const registerApi = (data: {
    full_name: string,
    username: string,
    email: string,
    password: string,
    role: string,
}) => api.post("/users", data);

// get current user
export const getCurrentUserApi = (token: string) => 
    api.get("/user", {
        headers: { Authorization: `Bearer ${token}` }
    });

// update user profile
export const updateProfileApi = async (formData: FormData) => {
    const response = await api.put("/user", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data.user;
};
