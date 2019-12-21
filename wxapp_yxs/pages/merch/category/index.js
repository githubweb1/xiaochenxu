// pages/merch/category/index.js
var app = getApp();
var a = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      
  },
  // 搜索内容
  searchinput: function (e) {
    console.log(e)
    let that = this;
    that.setData({
      search: e.detail.value
    })
    wx.showLoading({
      title: '加载中...',
    })
    a.get("merch/list/category", { "keyword": e.detail.value }, function (a) {
      wx.hideLoading();
      that.setData({
        list: a.result
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    a.get("merch/list/category", {}, function (data) {
      console.log(data)
      wx.hideLoading();
      that.setData({
        list: data.result
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  onShareAppMessage: function () {

  }
})