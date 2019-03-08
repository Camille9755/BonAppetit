import ajax from './ajax'
const BASE_URL = '/api'
export const reqAddress = (geohash)=>ajax(`${BASE_URL}/position/${geohash}`)
export const reqCategorys = ()=>ajax(BASE_URL+'/index_category')
export const reqShops = (latitude,longitude)=>ajax(BASE_URL+'/shops',{latitude,longitude})
