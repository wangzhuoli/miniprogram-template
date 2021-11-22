// pages/login/login.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 隐藏首页按钮
    wx.hideHomeButton()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  // 获取手机号
  getPhoneNumber(e: WechatMiniprogram.TouchEvent) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      wx.showToast({ title: '授权成功', icon: 'none' })
    } else {
      wx.showToast({ title: '取消授权', icon: 'none' })
    }
  }
})
