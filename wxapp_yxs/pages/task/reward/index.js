// pages/task/reward/index.js
var app = getApp();
var core = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  getinfo: function (e) {
    var that = this
    core.get("task/reward", {}, function (data) {
      that.setData({
        list: data.result.list,
      })
    });
  },
  // 领取
  getshop:function(e){
    core.post("task/getred", { id: e.currentTarget.dataset.id},function(data){
            if(data.status==1){
              core.confirm("领取成功,请到微信查收红包",function(res){
                  wx.redirectTo({
                    url: '/pages/task/reward/index',
                  })
              })
            }else{
              core.alert(data.result.message)
            }
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
    this.getinfo()
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