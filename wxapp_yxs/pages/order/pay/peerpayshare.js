// pages/order/pay/peerpayshare.js
var t = getApp(), core = t.requirejs("core")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    eno: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    core.get("order/pay/peerpayshare", options,function(data){
        that.setData({
          list:data.result
        })
    })
  },
  next:function(e){
    var that = this
      that.setData({
        eno: e.currentTarget.dataset.eno
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})