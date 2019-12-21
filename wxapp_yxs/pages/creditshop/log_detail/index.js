// pages/IntegralMall/orderDetails/orderDetails.js
var app = getApp();
var a = app.requirejs('core');
var QQMapWX = app.requirejs('qqmap-wx-jssdk');
// 实例化API核心类
var demo = new QQMapWX({
  key: 'IR5BZ-6SXLW-EXNRU-OAD64-6PL7H-35F6L' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:0,
    list: {},
    address: "",
    step: "",
    end:0,
    hidden:0
  },
  
  // 二维码
  eno:function(e){
    var that = this
    
    a.get("creditshop/verify", { logid: e.currentTarget.dataset.logid, verifycode: e.currentTarget.dataset.a }, function (data) {
      that.setData({
        url: data.result.qrcode,
      })
    })
    that.setData({
      eno: e.currentTarget.dataset.eno
    })
  },
  // 点击门店
  clickStore: function (query) {
    if (this.data.hidden == 0) {
      this.setData({
        hidden: query.currentTarget.dataset.hidden
      })
    } else {
      this.setData({
        hidden: 0
      })
    }

  },
  // 确认收货
  create:function(e){
    wx.showLoading({
      title: '确认中...',
    })
    var that = this
    let id = e.currentTarget.dataset.lodid
    a.get("creditshop/log/finish", {"id":id}, function (c) {
      wx.hideLoading()
      a.confirm("订单已完成",function(){
        that.setData({
          Receive: "已收货"
        })
        wx.navigateTo({
          url: '/pages/creditshop/index/index'
        })
      })
    })
  },
  // 领取红包
  Receivehongbao: function (e) {
    wx.showLoading({
      title: '领取中...',
    })
    var that = this
    let id = e.currentTarget.dataset.lodid
    a.get("creditshop/log/Receivepacket", { "id": id }, function (c) {
      wx.hideLoading();
      if(c.status==0){
           a.alert(c.result.message) 
      }else{
        a.confirm("红包已领取", function () {
          that.setData({
            Receive:"已领取"
          })
          wx.navigateTo({
            url: '/pages/creditshop/index/index'
          })
        })
      }
    })
  },
  // 下单支付
  tabLuck:function(e){
    let that = this
    if (!this.data.address1) {
      a.alert('请选择收货地址！')
      return
    }
    var param = {
      id: that.data.list.log.id,
      addressid: that.data.address1.id,
      paytype: 'wechat',
    }
    a.confirm('确定下单吗？', (data) => {
      a.get('creditshop/log/paydispatch', param, (data) => {
        if (data.status == 0) a.alert(data.result.message)
        else a.get('creditshop/log/payresult', { id: that.data.list.log.id } , (data) => {
          var data1 = data.result
            if ( data.status == 1) a.confirm('恭喜您，兑换成功', function () {
              wx.navigateTo({
                url: '/pages/creditshop/log_detail/index?id=' + that.data.list.log.id
              })
            })
            else{
              a.alert(data.result.message)
            }
        })
      })
    })
  },
  // 电话
  bindtel:function(e){
    a.phone(e)
  },
  // 定位
  bindtel: function (e) {

  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    var id = options.id;

    if (options.cache){
      that.setData({
        cache: options.cache
      })
    }
    wx.showLoading({
      title: '加载中...',
    })

  
    a.get("creditshop/log/detail", {"id": id}, function (q) {
      wx.hideLoading();
        // 用户经纬度
        wx.getLocation({
          success: function (res) {
            var latitude = res.latitude;
            var longitude = res.longitude
            if (q.result.stores.length != 0) {
              that.addre(latitude, longitude, q.result.stores[0].lat, q.result.stores[0].lng);
            }
          },
        })
        that.setData({
          list: q.result,
          isreply: q.result.isreply
        })
      })
  },

// 经纬度

  addre: function(mlat, mlng, slat, slng){
    // 调用接口
    var that = this
    demo.calculateDistance({
      to: [{
        latitude: mlat,
        longitude: mlng
      }, {
          latitude: slat,
          longitude: slng
      }],
      success: function (res) {
        that.setData({
          distance: (res.result.elements[1].distance)/1000
        })
      },
      fail: function (res) {
      },
      complete: function (res) {
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    if (that.data.list.expresslist){
      let q = that.data.list.expresslist[0].step
      if (q.indexOf("已签收") != -1) {
        that.setData({
          step: "已签收"
        })
      }
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var d
    d = app.getCache("orderAddress"),
    d && (this.setData({
      address1: d
    }))
  },
  onShareAppMessage: function () {

  }
})