const app = getApp()

Page({
  data: {
    roomCode: '',
    user: null,
  },
  onLoad(options) {
    const roomCode = options.roomCode
    const { appid, openid, nickName, avatarUrl } = app.globalData
    if (appid && openid && nickName && avatarUrl && roomCode) {
      this.setData({
        user: {
          name: nickName,
          avatar: avatarUrl,
        },
      })
    } else {
      wx.navigateTo({
        url: `/pages/index/index`,
      })
    }
  },
})
