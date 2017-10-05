export const STORAGE_KEY = 'isLogin'

// for testing
if (navigator.userAgent.indexOf('PhantomJS') > -1) {
  window.sessionStorage.clear()
}

export const state = {
  isLogin: window.sessionStorage.getItem(STORAGE_KEY)
}

export const mutations = {
  login (state) {
    state.isLogin = 'login'
  },
  logout (state) {
    state.isLogin = 'logout'
  }
}
