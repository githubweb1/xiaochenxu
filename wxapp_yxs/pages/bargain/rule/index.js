// pages/bargain/rule/index.js
var app = getApp(),
  c = app.requirejs("core")
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getinfo(options.id)
  },
  getinfo: function (id) {
    var that = this
    wx.showLoading({
      title: '正在加载，请等待',
    })
    var mid = app.getCache("userinfo").id
    c.get("bargain/rule", {id:id,mid: mid }, function (data) {
      var article = data.result.rule
      wx.hideLoading()
      that.setData({
        list: data.result
      })
    })
  },
  onShareAppMessage: function () {

  }
})