// pages/IntegralMall/Record/Record.js
var app = getApp();
var a = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  link:"",
    link1: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let page = options.page
    
    wx.showLoading({
      title: '加载中...',

    })
    a.get("creditshop/creditlog", {}, function (a) {
      wx.hideLoading();
      that.setData({
        link: a.result
      })
    })
    a.get("creditshop/creditlog/getlist", {"page":1}, function (a) {
      wx.hideLoading();
      that.setData({
        link1: a.result
      })
    })
  },
  onShareAppMessage: function () {

  }
  
})