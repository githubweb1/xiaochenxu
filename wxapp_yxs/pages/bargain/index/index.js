// pages/bargain/index/index.js
var app = getApp();
var a = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buy: 0,
    bargain: 0,
    allbargain: 1
  },
  // 搜索内容
  searchinput: function(e) {
    let that = this;
    that.setData({
      search: e.detail.value
    })
    wx.showLoading({
      title: '加载中...',
    })
    a.get("bargain", {
      "keyword": e.detail.value
    }, function(data) {
      wx.hideLoading();
      that.setData({
        list: data.result
      })

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.getinfo()

  },
  getinfo: function(e) {
    var that = this
    wx.showLoading({
      title: '正在加载，请等待',
    })
    var mid = app.getCache("userinfo").id
    console.log(mid)
    a.get("bargain", {
      mid: mid
    }, function(data) {
      wx.hideLoading();
      if (data.status == 0) {
        a.confirm(data.result.message, function(res) {
          wx.switchTab({
            url: '/pages/index/index',
          })
        })
      } else {
        that.setData({
          list: data.result[0]
        })
      }
    })

  },
  onShareAppMessage: function() {

  }
})