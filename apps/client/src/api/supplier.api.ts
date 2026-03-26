import api from "./axios"

export const fetchSuppliers = async (): Promise<any> => {
    const response = await api.get("/suppliers")
    console.log("Response dari API:", response); // Tambahkan log untuk melihat response    

    return response.data.supplier   
}
