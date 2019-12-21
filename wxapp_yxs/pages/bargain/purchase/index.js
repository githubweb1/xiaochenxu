// pages/bargain/purchase/index.js
var app = getApp();
var a = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buy:1,
    bargain:0,
    allbargain:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getinfo()
  },
  getinfo:function(e){
    var that=this
    wx.showLoading({
      title: '正在加载，请等待',
    })
    var mid = app.getCache("userinfo").id
    a.get("bargain/purchase",{mid:mid},function(data){
      wx.hideLoading()
      that.setData({
        list:data.result.goods,
        mid:mid
      })
    })
  },
  onShareAppMessage: function () {

  }
})