// app.js
App({
  onLaunch: function () {
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-9gm8frfcead0368e',
        traceUser: false,
      })
    } else {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    }

    this.globalData = {
      appid: '',
      openid: '',
      nickName: '',
      avatarUrl: '',
    }
    wx.cloud
      .callFunction({
        name: 'seaCloud',
        data: { type: 'getOpenId' },
      })
      .then((resp) => {
        // this.globalData.openid = resp.result.openid
        // mock
        this.globalData.openid = 'daxiao'
        this.globalData.appid = resp.result.appid
      })
  },
})
