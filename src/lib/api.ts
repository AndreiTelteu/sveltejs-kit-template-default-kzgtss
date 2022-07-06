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

api.img = (query: string, image: string) => {
    if (!image) return '';
    let queryArray: any = {};
    query.split(';').map(item => {
        if (item.indexOf(':') === -1) return;
        let itemSplit = item.split(':');
        queryArray[itemSplit[0].trim()] = itemSplit[1].trim();
    });
    let imageWidth = null;
    if (queryArray.hasOwnProperty('width') && queryArray.width !== 'auto') {
        imageWidth = parseInt(queryArray.width);
    }
    let imageHeight = null;
    if (queryArray.hasOwnProperty('height') && queryArray.height !== 'auto') {
        imageHeight = parseInt(queryArray.height);
    }
    if (!imageWidth && !imageHeight) return image;
    
    //  CDN method - statically.io
    // let params = ['f=auto'];
    // if (imageWidth)  params.push('w=' + imageWidth);
    // if (imageHeight) params.push('h=' + imageHeight);
    // return 'https://cdn.statically.io/img/' + image
    //     .replace(/https?\:\/\//i, '')
    //     .replace('/', '/' + params.join(',') + '/');
    
    // --- CDN method - images.weserv.nl
    let cdnurl = 'https://images.weserv.nl/?l=3&q=85&';
    if (imageWidth)  cdnurl += 'w=' + imageWidth + '&';
    if (imageHeight) cdnurl += 'h=' + imageHeight + '&';
    if (imageWidth && imageHeight) cdnurl += 'fit=cover&';
    cdnurl += 'url=' + encodeURIComponent(image);
    cdnurl += '&errorredirect=' + encodeURIComponent(image);
    return cdnurl;
    
};

export default api;
