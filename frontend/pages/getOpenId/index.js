Page({
  /**
   * 页面的初始数据
   */
  data: {
    showUploadTip: false,
    haveGetOpenId: false,
    envId: '',
    openId: '',
  },

  onLoad(options) {
    this.setData({
      envId: options.envId,
    })
  },

  getOpenId() {
    wx.showLoading({
      title: '',
    })
    wx.cloud
      .callFunction({
        name: 'seaCloud',
        data: {
          type: 'getRoom',
        },
      })
      .then((resp) => {
        this.setData({
          haveGetOpenId: true,
          openId: resp.result.openid,
        })
        wx.hideLoading()
      })
      .catch((e) => {
        this.setData({
          showUploadTip: true,
        })
        wx.hideLoading()
      })
  },

  clearOpenId() {
    this.setData({
      haveGetOpenId: false,
      openId: '',
    })
  },
})
