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
// 商品添加
export const goodsAdd = data => {
  return axios.request({
    url: 'goodsInfo/add',
    data,
    method: 'post'
  })
}
// 商品修改
export const goodsModify = data => {
  return axios.request({
    url: 'goodsInfo/modify',
    data,
    method: 'post'
  })
}
// 商品删除
export const goodsDelete = data => {
  return axios.request({
    url: 'goodsInfo/delete',
    data,
    headers: { 'Content-type': 'application/json' },
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
// 商品类别列表
export const categoryList = (params) => {
  return axios.request({
    url: 'category/selectByPage',
    params,
    method: 'get'
  })
}
// 商品类别添加
export const addCategory = data => {
  return axios.request({
    url: 'category/addCategory',
    data,
    method: 'post'
  })
}
// 商品类别禁用
export const enableCategory = data => {
  return axios.request({
    url: 'category/enableCategory',
    data,
    method: 'post'
  })
}
// 商品类别删除
export const deleteCategory = data => {
  return axios.request({
    url: 'category/deleteCategory',
    data,
    headers: { 'Content-type': 'application/json' },
    method: 'post'
  })
}