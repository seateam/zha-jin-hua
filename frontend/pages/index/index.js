const app = getApp()

Page({
  data: {
    roomCode: '',
    focus: true,
  },
  roomCodeInput(event) {
    const v = event.detail.value.replaceAll(/\D/g, '')
    this.setData({ roomCode: v })
    return v
  },
  login() {
    const roomCode = this.data.roomCode
    if (roomCode.length !== 4) {
      this.setData({ focus: true })
      return
    }
    wx.getUserProfile({
      desc: '用于完善信息资料',
    })
      .then((res) => {
        const { avatarUrl, nickName } = res.userInfo
        app.globalData.avatarUrl = avatarUrl
        app.globalData.nickName = nickName
        // mock
        // app.globalData.nickName = '大校'
        wx.navigateTo({
          url: `/pages/start/index?roomCode=${roomCode}`,
        })
      })
      .catch(() => {
        wx.showModal({
          title: '提示',
          content: '请点击「允许」',
          showCancel: false,
        })
      })
  },
})
