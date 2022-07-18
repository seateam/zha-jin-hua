// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database/init.html

const cloud = require('wx-server-sdk')
cloud.init({
  // env: cloud.DYNAMIC_CURRENT_ENV,
  env: 'cloud1-9gm8frfcead0368e',
})
const db = cloud.database()

const api = {
  async getMiniProgramCode(event, context) {
    // 获取小程序二维码的buffer
    const resp = await cloud.openapi.wxacode.get({
      path: 'pages/index/index',
    })
    const { buffer } = resp
    // 将图片上传云存储空间
    const upload = await cloud.uploadFile({
      cloudPath: 'code.png',
      fileContent: buffer,
    })
    return upload.fileID
  },
  async getOpenId(event, context) {
    // 创建集合
    // try {
    //   await db.createCollection('rooms')
    // } catch (err) {}
    // 获取基础信息
    const wxContext = cloud.getWXContext()
    return {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
  },
  async getRoom(event, context) {
    if (!event.roomCode) return null
    const rooms = db.collection('rooms')
    const where = rooms.where({ _id: event.roomCode })
    const res = await where.get()
    if (res && res.data) {
      const list = res.data
      if (list.length === 1) {
        return list[0]
      }
    }
    return null
  },
  async updateRoom(event, context) {
    const rooms = db.collection('rooms')
    const where = rooms.where({ _id: event.room._id })
    // 添加
    const res = await where.get()
    if (res.data.length) {
      delete event.room._id
      where.update({ data: event.room })
    } else {
      rooms.add({ data: event.room })
    }
  },
  async deleteRoom(event, context) {
    const rooms = db.collection('rooms')
    const where = rooms.where({ _id: event.roomCode })
    where.remove()
  },
}

// 云函数入口函数
exports.main = async (event, context) => {
  if (api[event.type]) {
    return await api[event.type](event, context)
  } else {
    return null
  }
}
