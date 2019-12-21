// pages/task/mine/index.js
var app = getApp();
var a = app.requirejs('core');
Page({
  /**
   * 页面的初始数据
   */
  data: {
  num:1,
  hidden:0,
  },

  tapleave: function (e) {
    var that = this
    this.setData({
      num: e.currentTarget.dataset.num,
      hidden: e.currentTarget.dataset.hidden
    })
    that.getinfo(e.currentTarget.dataset.num);
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  getinfo: function (num){
    var that =this
    a.get("task/mine", { status:num},function(data){
      that.setData({
          list:data.result.list,
        status: data.result.status
      })
    })
  },
  onShareAppMessage: function () {

  },
  onShow:function(){
    this.getinfo(1);
  }
})