import axios from 'axios';

const api: any = {};

api.getProducts = async (filters = {}) => {
    let { data } = await axios.get("https://dummyjson.com/products?limit=100");
    let produse = data.products;
    
    let categorii: string[] = [];
    produse.forEach((item: any) => {
        if (categorii.indexOf(item.category) === -1) {
            categorii.push(item.category);
        }
    });
    
    return {
        produse,
        categorii,
    }
}

export default api;
