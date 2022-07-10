const app = getApp()
import pockersDict from './pockers'

Page({
  data: {
    roomCode: '',
    user: null,
    pockersList: [],
    pockers: [{}, {}, {}],
  },
  random(a, b) {
    return parseInt(Math.random() * (b - a) + a)
  },
  licensing() {
    const pockers = []
    for (let i = 0; i < 3; i++) {
      const i = this.random(0, this.data.pockersList.length)
      const e = this.data.pockersList.splice(i, 1)
      const suit = e[0][0]
      const point = e[0][1]
      pockers.push({
        suit,
        point,
        formatSuit: this.formatSuit(suit),
        color: this.formatColor(suit),
      })
    }
    this.setData({
      pockers,
    })
  },
  start() {
    this.licensing()
  },
  formatColor(suit) {
    const dict = {
      Black: '',
      Red: 'red',
      Square: 'red',
      Plum: '',
    }
    return dict[suit]
  },
  formatSuit(suit) {
    const dict = {
      Black: '♥',
      Red: '♥',
      Square: '♦',
      Plum: '♣',
    }
    return dict[suit]
  },
  onLoad(options) {
    const roomCode = options.roomCode
    const { appid, openid, nickName, avatarUrl } = app.globalData
    if (appid && openid && nickName && avatarUrl && roomCode) {
      this.setData({
        roomCode,
        pockersList: pockersDict,
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
