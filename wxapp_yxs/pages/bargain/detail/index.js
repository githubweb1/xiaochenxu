// pages/bargain/detail/index.js
var app = getApp(),
  model = app.requirejs("model"),
  c = app.requirejs("core"),
  s = app.requirejs("wxParse/wxParse");
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
    this.init(options.id)
  },
  // 点击砍价
  bargain:function(e){
    var that = this
    if (!that.data.list.act_swi){
      c.get("bargain/join", { goods: that.data.list.res.id},function(data){
        wx.redirectTo({
          url: '/pages/bargain/bargain/index?goods=' + data.result.id + "&mid=" + that.data.mid,
        })
      })
    //  wx.redirectTo({
    //   url: '/pages/bargain/bargain/index?goods='+this.data.list.res.id+"&mid="+this.data.mid,
    // })
    }
    else c.confirm("您已经发起过一次本商品的砍价活动,是否立即查看？",function(e){
      wx.redirectTo({
        url: '/pages/bargain/bargain/index?id=' + that.data.list.act_swi.id + "&mid=" + that.data.mid,
      })
    })
  },
  init: function (id) {
    var that = this
    var mid = app.getCache("userinfo").id
    wx.showLoading({
      title: '加载中...',
    })
    c.get('bargain/detail', {
      'id': id,
      mid:mid
    }, function (data) {
      wx.hideLoading()
      var article = data.result.res.content
      setTimeout(function(){
        s.wxParse('article', 'html', article, that, 5);
      },1)
      // if (s.wxParse("wxParseData", "html", data.result.goods.goodsdetail, that, "5"), that.setData({
      //   show: !0,
      //   option: data.result
      // }))
      that.setData({
        list: data.result,
        mid:mid
      })
      var time = model.ShowCountDown(data.result.res.end_time_2)
      that.setData({
        endtime: time
      })
      var countTime = setInterval(function () {
        var time = model.ShowCountDown(data.result.res.end_time_2);
        if (time == '已过期')
          clearInterval(countTime)
        that.setData({
          endtime: time
        })
      }, 1000)
    }, 1, 0)
  },
  onShareAppMessage: function () {

  }
})