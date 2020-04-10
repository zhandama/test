import axios from '@/libs/api.request'

export const login = ({ loginAccount, password }) => {
  const data = {
    loginAccount,
    password
  }
  return axios.request({
    url: 'userInfo/login',
    data,
    method: 'post'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'userInfo/logout',
    method: 'post'
  })
}
export const addUser = data => {
  return axios.request({
    url: 'userInfo/addUser',
    data,
    method: 'post'
  })
}
// 获取管理员列表
export const getTableData = (params) => {
  return axios.request({
    url: 'userInfo/selectByPage',
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
// 修改用户
export const modifyUserForSystem = data => {
  return axios.request({
    url: 'userInfo/modifyUserForSystem',
    data,
    method: 'post'
  })
}
// 修改密码
export const modifyPwdForSystem = data => {
  return axios.request({
    url: 'userInfo/modifyPwdForSystem',
    data,
    method: 'post'
  })
}
// 获取积分列表
export const scoreList = (params) => {
  return axios.request({
    url: 'scoreInfo/selectByPage',
    params,
    method: 'get'
  })
}

// 获取前台用户列表
export const buyerInfoList = (params) => {
  return axios.request({
    url: 'buyerInfo/selectByPage',
    params,
    method: 'get'
  })
}

// 审核
export const buyerInfoAudit = data => {
  return axios.request({
    url: 'buyerInfo/audit',
    data,
    method: 'post'
  })
}
// 完善信息
export const modifyBuyerInfo = data => {
  return axios.request({
    url: 'buyerInfo/modifyBuyerInfo',
    data,
    method: 'post'
  })
}

