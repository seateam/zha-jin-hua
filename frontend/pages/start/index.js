const app = getApp()
import pockersDict from './pockers'
const dayjs = require('dayjs')

Page({
  data: {
    roomCode: '',
    // 当前用户
    own: {
      openid: '',
      name: '',
      avatar: '',
    },
    // init
    inited: false,
    // 所有用户
    users: [
      {
        openid: '',
        name: '',
        avatar: '',
        pockers: [{}, {}, {}],
        date: 0,
      },
    ],
    userIndex: 0,
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
      const { openid, name, avatar } = this.data.own

      const index = this.data.users.findIndex((u) => !u.openid)
      if (index === -1) {
        wx.showToast({ title: '未知错误', icon: 'none' })
        return
      }
      this.data.users[index] = {
        openid,
        name,
        avatar,
        date: dayjs().unix(),
        pockers,
        open: false,
      }
      const room = {
        _id: this.data.roomCode,
        pockersList: this.data.pockersList,
        users: this.data.users,
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
          this.setData({
            users: this.data.users,
            userIndex: index === -1 ? this.data.users.length - 1 : index,
          })
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
      success: (res) => {
        if (res.confirm) {
          this.data.users[this.data.userIndex].open = true
          const room = {
            _id: this.data.roomCode,
            pockersList: this.data.pockersList,
            users: this.data.users,
          }
          wx.cloud
            .callFunction({
              name: 'seaCloud',
              data: {
                type: 'updateRoom',
                room,
              },
            })
            .then(() => {
              this.setData({
                users: this.data.users,
              })
            })
        }
      },
    })
  },
  refresh() {
    wx.showLoading({
      title: '刷新中',
    })
    this.initRoom(this.data.roomCode)
  },
  reset() {
    const roomCode = this.data.roomCode
    wx.showModal({
      title: '再来一局？',
      content: '确定要重新洗牌',
      success: (res) => {
        if (res.confirm) {
          wx.cloud
            .callFunction({
              name: 'seaCloud',
              data: {
                type: 'deleteRoom',
                roomCode,
              },
            })
            .then((res) => {
              this.setData({
                // init
                inited: false,
                // 所有用户
                users: [
                  {
                    openid: '',
                    name: '',
                    avatar: '',
                    pockers: [{}, {}, {}],
                    date: 0,
                  },
                ],
              })
              this.initRoom(roomCode)
            })
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
        own: {
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
        wx.hideLoading()
        const room = res.result
        if (room) {
          const { pockersList, users } = room
          let index = users.findIndex((u) => u.openid === this.data.own.openid)
          if (index === -1) {
            users.push({
              openid: '',
              name: '',
              avatar: '',
              pockers: [{}, {}, {}],
              date: 0,
            })
            index = users.length - 1
          }
          this.setData({
            users,
            userIndex: index,
            pockersList,
            inited: true,
          })
        } else {
          this.setData({
            pockersList: pockersDict,
            inited: true,
          })
        }
      })
      .catch((err) => {
        wx.showToast({ title: '房间获取失败', icon: 'none' })
      })
  },
  look(event) {
    const ok = this.data.users.findIndex((u) => !u.open) === -1
    if (ok) {
      const i = event.target.dataset.i
      this.setData({
        userIndex: i,
      })
    }
  },
})
