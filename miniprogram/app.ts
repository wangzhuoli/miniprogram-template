import { getToken } from './storage/token'
// app.ts
App<IAppOption>({
  globalData: {},
  onLaunch() {
    // // 登录
    // const token = getToken()
    // console.log('token', token)
    // wx.showToast({ title: 'onLaunch' })
    // if (!token) {
    //   // 未登录 - 去登录
    //   wx.reLaunch({
    //     url: '/pages/login/login'
    //   })
    // }
  }
})
