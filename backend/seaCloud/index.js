const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

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
    // 获取基础信息
    const wxContext = cloud.getWXContext()

    return {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
  },
  async getRoom(event, context) {
    // 获取基础信息
    const wxContext = cloud.getWXContext()

    return {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
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
