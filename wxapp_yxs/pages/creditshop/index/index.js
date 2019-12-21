// pages/IntegralMall/home/home.js
var app = getApp();
var a = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      link:{},
    cache:true,
    home:1,
    alllist:0,
    my:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that = this
    wx.showLoading({
      title: '加载中...',
    })
    a.get("creditshop", {},function (a) {
      wx.hideLoading();
      that.setData({
          link:a
      })
    })
  },
  onShareAppMessage: function () {

  }

  
})