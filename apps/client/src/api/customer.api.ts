import api from "./axios"

export const fetchCust = async (): Promise<any> => {
    const response = await api.get("/customer")
    console.log("Response dari API:", response); // Tambahkan log untuk melihat response    

    return response.data.customers   
}
