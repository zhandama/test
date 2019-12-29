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
