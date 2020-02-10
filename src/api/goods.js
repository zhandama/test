import axios from '@/libs/api.request'

export const getGoodsList = (params) => {
  return axios.request({
    url: 'goodsInfo/selectByPage',
    params,
    method: 'get'
  })
}
// 商品上下架
export const goodsOnline = data => {
  return axios.request({
    url: 'goodsInfo/online',
    data,
    method: 'post'
  })
}
// 动态属性列表
export const propertyInfoList = (params) => {
  return axios.request({
    url: 'propertyInfo/selectByPage',
    params,
    method: 'get'
  })
}
// 添加动态属性
export const addProperty = data => {
  return axios.request({
    url: 'propertyInfo/addProperty',
    data,
    method: 'post'
  })
}
// 修改属性
export const modifyProperty = data => {
  return axios.request({
    url: 'propertyInfo/modifyProperty',
    data,
    method: 'post'
  })
}
// 删除属性
export const deleteProperty = data => {
  return axios.request({
    url: 'propertyInfo/delete',
    data,
    headers: { 'Content-type': 'application/json' },
    method: 'post'
  })
}
