const app = getApp()
import pockersDict from './pockers'

Page({
  data: {
    roomCode: '',
    user: {
      openid: '',
      name: '',
      avatar: '',
    },
    pockersList: [],
    pockers: [{}, {}, {}],
  },
  random(a, b) {
    return parseInt(Math.random() * (b - a) + a)
  },
  licensing() {
    if (this.data.pockersList.length < 3) {
      wx.showToast({ title: '牌已发完', icon: 'none' })
      return
    }
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

    return pockers
  },
  // 发牌
  start() {
    const pockers = this.licensing()
    if (pockers) {
      this.setData({
        pockers,
      })
      const { openid, name, avatar } = this.data.user
      const room = {
        _id: this.data.roomCode,
        pockersList: this.data.pockersList,
        users: [
          {
            openid,
            name,
            avatar,
            pockers,
          },
        ],
      }
      wx.cloud
        .callFunction({
          name: 'seaCloud',
          data: {
            type: 'updateRoom',
            room,
          },
        })
        .then((res) => {
          console.log('🌊', res)
        })
        .catch((err) => {
          console.log('🌊', err)
        })
    }
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
          openid: openid,
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
