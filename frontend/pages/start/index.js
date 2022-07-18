const app = getApp()
import pockersDict from './pockers'

Page({
  data: {
    roomCode: '',
    // 当前用户
    user: {
      openid: '',
      name: '',
      avatar: '',
    },
    pockers: [{}, {}, {}],
    inited: false,
    // 所有用户
    users: [],
    // 当前牌
    pockersList: [],
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
          wx.showToast({ title: '发牌成功', icon: 'none' })
        })
        .catch(() => {
          wx.showToast({ title: '发牌失败', icon: 'none' })
        })
    }
  },
  // 开牌
  open() {
    wx.showModal({
      title: '是否要开牌？',
      content: '当所有人开牌，才能看到别人的',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
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
      // 用户信息
      this.setData({
        roomCode,
        user: {
          openid: openid,
          name: nickName,
          avatar: avatarUrl,
        },
      })
      // 设置标题
      wx.setNavigationBarTitle({
        title: `房间号：${roomCode}`,
      })
      // 房间信息
      this.initRoom(roomCode)
    } else {
      wx.navigateTo({
        url: `/pages/index/index`,
      })
    }
  },
  initRoom(roomCode) {
    wx.cloud
      .callFunction({
        name: 'seaCloud',
        data: {
          type: 'getRoom',
          roomCode,
        },
      })
      .then((res) => {
        const room = res.result
        if (room) {
          const { pockersList, users } = room
          this.setData({
            pockersList,
            users,
          })
          this.initUser(users)
        } else {
          this.setData({
            pockersList: pockersDict,
            users: [],
          })
        }
      })
      .catch(() => {
        wx.showToast({ title: '房间获取失败', icon: 'none' })
      })
  },
  initUser(users) {
    const user = users.find((u) => u.openid === this.data.user.openid)
    this.setData({
      pockers: user.pockers,
      inited: true,
    })
  },
})
