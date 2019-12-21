// pages/IntegralMall/my/my.js
var app = getApp();
var a = app.requirejs('core');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    links: {},
    hidden:0,
    complete:"",
    page1:"",
    more:0,
    page:1,
    eno:0,
    home: 0,
    alllist: 0,
    my: 1
  },
  // 确认收货
  create:function(e){
    wx.showLoading({
      title: '确认中...',
    })
    var that = this
    let id = e.currentTarget.dataset.lodid
    a.get("creditshop/log/finish", { "id": id}, function (c) {
      wx.hideLoading();
      a.alert("订单完成")
      that.setData({
        complete:"已收货"
      })
    })
  },
  Receivehongbao: function (e) {
    wx.showLoading({
      title: '领取中...',
    })
    var that = this
    let id = e.currentTarget.dataset.lodid
    a.get("creditshop/log/Receivepacket", { "id": id }, function (c) {
      wx.hideLoading();
      if (c.status == 0) {
        a.alert(c.result.message)
      } else {
        a.confirm("红包已领取", function () {
          that.setData({
            Receive: "已领取"
          })
          wx.navigateTo({
            url: '/pages/creditshop/index/index'
          })
        })
      }
    })
  },
  // 点击显示二维码
  eno:function(e){
    var that = this
    a.get("creditshop/verify", { logid: e.currentTarget.dataset.logid,verifycode: e.currentTarget.dataset.a},function(data){
      that.setData({
        url: data.result.qrcode,
      })
    })
    that.setData({
        eno: e.currentTarget.dataset.eno,
        a: e.currentTarget.dataset.a
      })
  },
  // 领取红包
  Receivehongbao:function(e){
    wx.showLoading({
      title: '领取中...',
    })
    var that = this
    let id = e.currentTarget.dataset.lodid
    a.get("creditshop/log/Receivepacket", { "id": id }, function (c) {
      if(c.result.message){
        a.alert(c.result.message)
      }else{
        a.alert("红包已领取")
        that.setData({
          complete: "已领取"
        })
      }
      wx.hideLoading();
    })
  },
  tapwait: function (e) {
    var that = this
    this.setData({
      num: e.currentTarget.dataset.num,
      hidden: e.currentTarget.dataset.hidden
    })
    wx.showLoading({
      title: '加载中...',
    })
    a.get("creditshop/log/getlist", { "status": "0", "page": "1" }, function (a) {
      wx.hideLoading();
      that.setData({
        links: a.result,
      })
      var page = Math.floor(that.data.links.total * 1 / that.data.links.pagesize * 1) + 1
      that.setData({
        page1: page,
        page: 2
      })
    })
  },
  tapgo: function (e) {
    var that = this
    this.setData({
      num: e.currentTarget.dataset.num,
      hidden: e.currentTarget.dataset.hidden
    })
    wx.showLoading({
      title: '加载中...',
    })
    a.get("creditshop/log/getlist", { "status": "1", "page": "1" }, function (a) {
      wx.hideLoading();
      that.setData({
        links: a.result,
      })
      that.page(that.data.links.total, that.data.links.pagesize)
    })
  },
  tapleave: function (e) {
    var that = this
    this.setData({
      num: e.currentTarget.dataset.num,
      hidden: e.currentTarget.dataset.hidden
    })
      wx.showLoading({
        title: '加载中...',
      })
      a.get("creditshop/log/getlist", { "status": "2", "page": "1" }, function (a) {
        wx.hideLoading();
        that.setData({
          links: a.result,
        })
        that.page(that.data.links.total, that.data.links.pagesize)
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
    a.get("creditshop/log/getlist", {"status":"0","page":"1"}, function (a) {
        wx.hideLoading();
        that.setData({
          links: a.result,
        })
      that.page(that.data.links.total, that.data.links.pagesize)
    })
  }, 
  // 点击刷新
  moreinfo: function (e){
    var that = this
    var page1 = (that.data.page1)*1+1
    var page = that.data.page++
    var params = {
      "status": that.data.hidden,
      "page": page
    }
    if (page < page1){
      wx.showLoading({
        title: '加载中...',
      })
      a.get("creditshop/log/getlist", params, function (a) {
        wx.hideLoading();
        var concat = (that.data.links.list).concat(a.result.list)
        that.data.links.list == concat
        that.setData({
          "links.list": concat
        })
      })
    }else{
      that.setData({
        more:1
      })
    }
  },
  // 加载page
  page: function (a, b) {
    var page = Math.floor(a * 1 / b * 1) * 1 + 1
    this.setData({
      page1: page,
      page: 1
    })
    if (this.data.page > page || this.data.page == page) {
      this.setData({
        more: 1
      })
    } else {
      this.setData({
        more: 0
      })
    }
  },
  onShareAppMessage: function () {

  }
})