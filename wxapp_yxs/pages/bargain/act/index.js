// pages/bargain/act/index.js
var app = getApp();
var a = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buy: 0,
    bargain: 1,
    allbargain: 0
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getinfo()
  },
  getinfo(){
    var that = this;
    var mid = app.getCache("userinfo").id
    wx.showLoading({
      title: '加载中...',
    })
    a.get("bargain/act", { mid: mid},function(data){
      wx.hideLoading()
        that.setData({
          list:data.result,
          mid:mid
        })
    })
  },
  onShareAppMessage: function () {

  }
})