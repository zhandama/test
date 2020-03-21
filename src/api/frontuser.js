import axios from '@/libs/api.request'

export const logout = (token) => {
  return axios.request({
    url: 'userInfo/logout',
    method: 'post'
  })
}
// 获取收货地址
export const addressInfoList = (params) => {
  return axios.request({
    url: 'addressInfo/selectByPage',
    params,
    method: 'get'
  })
}
// 删除用户
export const deleteUserForSystem = data => {
  return axios.request({
    url: 'userInfo/deleteUserForSystem',
    data,
    headers: { 'Content-type': 'application/json' },
    method: 'post'
  })
}
