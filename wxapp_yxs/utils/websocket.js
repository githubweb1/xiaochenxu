// 聊天室

var url = 'ws://6055.iiio.top:6055';
// var utils = require('./util.js');
var openid;
function connect(user, func) {
  wx.connectSocket({
    url: url,
    header: { 'content-type': 'application/json' },
    success: function () {
      console.log('信道连接成功~')
      wx.getStorage({
        key: 'userinfowx80ca999f4cfee399',
        success(res) {
          console.log(res)
          openid = res.data.value.openId;
        }
      })

    },
    fail: function () {
      console.log('信道连接失败~')
    }
  })
  wx.onSocketOpen(function (res) {
    console.log(res, 'open')
    wx.showToast({
      title: '信道已开通~',
      icon: "success",
      duration: 2000
    })

    setTimeout(()=>{
      wx.sendSocketMessage({
        data: '{"type":"login","id":"' + "sns_wa_" + openid + '"}'
      });
    },500)
   
    //接受服务器消息
    wx.onSocketMessage(func);//func回调可以拿到服务器返回的数据
    // console.log(func, wx.onSocketMessage(func),1)
   
  });

  wx.onSocketError(function (res) {
    wx.showToast({
      title: '信道连接失败，请检查！',
      icon: "none",
      duration: 2000
    })
  })
}
wx.onSocketClose(function (res) {
  wx.navigateBack({
    delta:1    
  })
})
//发送消息
function send(msg) {
  wx.sendSocketMessage({
    data: msg
  });
}
module.exports = {
  connect: connect,
  send: send
}