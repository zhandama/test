import {
  login,
  logout
} from '@/api/user'
import { setToken } from '@/libs/util'

export default {
  state: {
    loginAccount: '',
    access: ''
  },
  mutations: {
    setUserName (state, name) {
      state.loginAccount = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { loginAccount, password }) {
      loginAccount = loginAccount.trim()
      return new Promise((resolve, reject) => {
        login({
          loginAccount,
          password
        }).then(res => {
          if (res.data.success) {
            commit('setUserName', loginAccount)
            commit('setAccess', true)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    }
  }
}
