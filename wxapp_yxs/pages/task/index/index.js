// pages/task/index/index.js
var app = getApp();
var a = app.requirejs('core');
// var WxParse = app.requirejs("wxParse/wxParse");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:{}
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getinfo()
  },
  getinfo: function(e) {
    var that = this
    a.get("task", {}, function(data) {
      that.setData({
        list: data.result.list,
        info: data.result.info,
        my: data.result.my,
        set: data.result.set
      })
      });
  },
  // 点击领取任务
  dotask:function(e){
    wx.showLoading({
      title: '正在加载中...',
    })
    a.post("task/picktask", { id: e.currentTarget.dataset.id},function(data){
      if (data.status==1){
        wx.hideLoading();
        a.confirm("领取成功，请到我的任务中查看", function () {
          wx.redirectTo({
            url: '/pages/task/index/index',
          })
        })
      }
      else{
        wx.hideLoading();
        a.alert(data.result.message)
      } 
    })
  },
  onShareAppMessage: function () {

  }
})