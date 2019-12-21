// pages/creditshop/log_express/index.js
var app = getApp();
var a = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    var that = this
    let id = options.id
    wx.showLoading({
      title: '正在加载中...',
    })
    a.get("creditshop/log/express",{"id":id},function (e) {
      wx.hideLoading();
      that.setData({
        list: e.result
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    if (that.data.list){
      let q = that.data.list.expresslist[0].step
    if (q.indexOf("已签收")!= -1){
          that.setData({
            step:"已签收"
          })
    }
    }
  },
  onShareAppMessage: function () {

  }

})