// pages/task/deltail/index.js
var app = getApp();
var a = app.requirejs('core');
// var WxParse = app.requirejs("wxParse/wxParse");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      poster:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      if(options.rid !="null"){
        this.setData({
          rid: options.rid
        })
      }else{
        if(options.id != "null"){
          this.setData({
            id: options.id
          })
        }
      }
  },
  getinfo: function(q) {
    var that = this;
    var stop_limit = ""
    var prams ={}
    if (that.data.rid) {
      prams.rid = that.data.rid
    } else if (that.data.id) {
      prams.id = that.data.id
    }
    a.get("task/detail", prams,function(data){
      
      if(data.status==0){
        a.confirm(data.result.message, function () {
          wx.navigateBack({
            delta: 1
          })
        })
      }else{
        if (data.result.detail.stop_limit) {
          stop_limit = (data.result.detail.stop_limit * 1) / 3600
        }
        that.setData({
          reward: data.result.reward,
          reward1: data.result.reward1,
          reward2: data.result.reward2,
          reward3: data.result.reward3,
          detail: data.result.detail,
          desc: data.result.desc,
          stop_limit: stop_limit,
          rid: data.result.rid,
          followreward: data.result.followreward,
          reward_goods: data.result.reward_goods,
          reward_goods1: data.result.reward_goods1,
          reward_goods2: data.result.reward_goods2,
          reward_goods3: data.result.reward_goods3,
          poster: data.result.poster
        })
      }
     
    })
  },
  // 海报
  poster:function(e){
      this.setData({
        poster1: e.currentTarget.dataset.poster,
      })
  },
  // 发送到微信
  sendToWechat:function(e){

  },
  // 接受任务
  getreward:function(e){
    // console.log(e)
    wx.showLoading({
      title: '正在加载中...',
    })
    a.post("task/picktask", { id: e.currentTarget.dataset.id }, function (data) {
      if (data.status == 1) {
        wx.hideLoading();
        a.confirm("领取成功，请到我的任务中查看", function () {
          wx.redirectTo({
            url: '/pages/task/index/index',
          })
        })
      }
      else {
        wx.hideLoading();
        a.alert(data.result.message)
      }
    })

  },
  onShow:function(){
    if(this.data.rid){
      this.getinfo(this.data.rid)
    } else if (this.data.id){
      this.getinfo(this.data.id)
    }
  },
  onShareAppMessage: function () {

  }
})