import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USERINFO,
  RESET_USERINFO,
  RECEIVE_RATINGS,
  RECEIVE_INFO,
  RECEIVE_GOODS
} from './mutation-types'
import {reqAddress,reqCategorys,reqShops,reqUserInfo,reqLogout,reqShopGoods,reqShopInfo,reqShopRatings} from '../api'

export default {
  async getAddress({commit,state}){
    const {latitude,longitude} = state
    const geohash = latitude + ',' + longitude
    const result = await reqAddress(geohash)
    commit(RECEIVE_ADDRESS,{address:result.data})
  },

  async getCategorys({commit}){
    const result = await reqCategorys()
    commit(RECEIVE_CATEGORYS,{categorys:result.data})
  },

  async getShops({commit,state}){
    const {latitude,longitude} = state
    const result = await reqShops(latitude,longitude)
    commit(RECEIVE_SHOPS,{shops:result.data})
  },

  recordUserInfo({commit},userInfo){
    commit(RECEIVE_USERINFO,{userInfo})
  },

  async getUserInfo({commit}){
    const result = await reqUserInfo()
    if(result.code===0){
      commit(RECEIVE_USERINFO,{userInfo: result.data})
    }
  },

  async logOut({commit}){
    const result = await reqLogout()
    if(result.code===0){
      commit(RESET_USERINFO)
    }
  },

  async getShopInfo({commit}, cb) {
    const result = await reqShopInfo()
    if(result.code===0) {
      const info = result.data
      info.score = 3.5
      commit(RECEIVE_INFO, {info})
      cb && cb()
    }
  },

  async getShopRatings({commit}, cb) {
    const result = await reqShopRatings()
    if(result.code===0) {
      const ratings = result.data
      commit(RECEIVE_RATINGS, {ratings})
      cb && cb()
    }
  },

  async getShopGoods({commit}, cb) {
    const result = await reqShopGoods()
    if(result.code===0) {
      const goods = result.data
      commit(RECEIVE_GOODS, {goods})
      cb && cb()
    }
  }
}
