const key = 'token'

// 获取token
export const getToken = () => {
  return wx.getStorageSync(key)
}

// 设置token
export const setToken = (token: string) => {
  wx.setStorageSync(key, token)
}

// 删除token
export const removeToken = () => {
  wx.removeStorageSync(key)
}

removeToken()
// setToken('miniapp.rating.66b5b1b532364326c6358d926451fbe0d9e487c4afeb8986021bfa467623fae45d890402nFzi4cMAj7mqVBeTuHhY4is2lUAkMV')
