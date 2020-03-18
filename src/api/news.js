import axios from '@/libs/api.request'

export const addNews = data => {
  return axios.request({
    url: 'content/addNews',
    data,
    method: 'post'
  })
}
export const modifyNews = data => {
  return axios.request({
    url: 'content/modifyNews',
    data,
    method: 'post'
  })
}
// 列表
export const contentId = (params) => {
  return axios.request({
    url: 'content/selectById',
    params,
    method: 'get'
  })
}
// 列表
export const contentList = (params) => {
  return axios.request({
    url: 'content/selectByPage',
    params,
    method: 'get'
  })
}
// 删除
export const deleteNews = data => {
  return axios.request({
    url: 'content/deleteNews',
    data,
    headers: { 'Content-type': 'application/json' },
    method: 'post'
  })
}

