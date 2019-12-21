// pages/IntegralMall/creadOrder/creadOrder.js
var app = getApp();
var c = app.requirejs('core');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    links: {},
    num: 0,
    true1:"",
    optionid:"",
    address:"",
    carrierInfo:"",
  },
  tabLuck: function(e) {
    this.setData({
      num: 1
    })
  },
  quxiao: function(e) {
    this.setData({
      num: 0
    })
  },
  // 绑定姓名
  bindname:function(e){
    var that = this
    that.setData({
      name: e.detail.cursor
    })
    console.log(e.detail.cursor);
  },
  // 绑定电话
  bindiphone:function(e){
    var that = this
        that.setData({
          cursor: e.detail.cursor,
          iphone: e.detail.value
        })
  },
  // 点击微信支付
  wechat:function(e){
    var that = this
    that.pay('wechat')
    this.setData({
      num: 0
    })
    
  },
  // 点击余额支付
  balance:function(e){
    var that = this
    that.pay('balance')
    this.setData({
      num: 0
    })
  },
  // 点击支付
  doConfirm: function() {
    var that = this
  if (that.data.links.goods.isverify == 0 && that.data.links.goods.goodstype == 0 && that.data.links.goods.type == 0&&!this.data.address) {
    c.alert('请选择收货地址！')
      return
    }
  else if (that.data.links.goods.isverify == 1 && that.data.links.goods.goodstype == 0 &&!that.data.carrierInfo) {
      c.alert('请选择店铺地址！')
    return
    }
  else if (that.data.links.goods.isverify == 1 && that.data.links.goods.goodstype == 0 && that.data.name == 0) {
      c.alert('请输入姓名/手机号')
    return
    }
  else if (that.data.links.goods.isverify == 1 && that.data.links.goods.goodstype == 0 && that.data.cursor != 11) {
      c.alert('请输入正确的手机号')
    return
    }
  else if (that.data.links.goods.isverify == 1 && that.data.links.goods.goodstype == 0 && that.data.cursor == 0) {
    c.alert('请输入正确的手机号')
    return
  }
    if (that.data.links.goods.money > 0) {
      that.setData({
        num: 1
      })
    } else {
      that.pay('wechat')
    }
  },
  pay:function(pay){
    var that = this;
    var confirm
    var param = {
      id: that.data.links.goods.id,
      addressid: that.data.address.id,
      realname: that.data.name,
      mobile: that.data.iphone,
      optionid: that.data.optionid,
      paytype: pay,
      storeid: that.data.carrierInfo.id
    }
    if (that.data.cache == "true") {
      
      confirm  = "确认要抽奖吗?"
      
    }else{
      confirm = "确认要兑换吗?"
    }
    c.confirm(confirm, (data) => {
      if (that.data.cache == "true") {
        wx.showLoading({
          title: '正在抽奖...',
        })

      } else {
        wx.showLoading({
          title: '正在兑换中...',
        })
      }
      
      setTimeout(function(){
        wx.hideLoading();
        c.get('creditshop/detail/pay', param, (data) => {
          if (data.result.wechat) {
            let wechat = data.result.wechat
            wx.requestPayment({
              'timeStamp': wechat.timeStamp,
              'nonceStr': wechat.nonceStr,
              'package': wechat.package,
              'signType': wechat.signType,
              'paySign': wechat.paySign,
              'success': (res) => {
                that.paymonet(data.result.logid, data.result.logid)
              },
              'fail': (res) => {
                c.alert(res.result.message)
              }
            })
          }
          else {
            var data1 = data
            if (data.status == 0) c.alert(data.result.message)
            else that.paymonet(data.result.logid, data1.result.logid)
          }
        })
      },2000);
      
    })
  },
  paymonet:function(q,data1){
    var that = this
    c.get('creditshop/detail/lottery', { id: that.data.links.goods.id, logid: q }, (data) => {
      if (that.data.cache == "true") {
        if (data.result.goodstype == 2 && data.result.status == 3) c.confirm('恭喜您，中奖了,余额已经发到您的账户啦', function () {
          wx.redirectTo({
            url: '/pages/creditshop/log_detail/index?id=' + data1 + "&cache=" + that.data.cache
          })
        })
        else if (data.result.goodstype == 2 && data.result.status == 1) c.confirm('很遗憾，您未中奖', function () {
          wx.redirectTo({
            url: '/pages/creditshop/log_detail/index?id=' + data1 + "&cache=" + that.data.cache
          })
        })
        else if (data.result.goodstype == 0 && data.result.status == 2) c.confirm('恭喜您，中奖了,奖品已发放', function () {
          wx.redirectTo({
            url: '/pages/creditshop/log_detail/index?id=' + data1 + "&cache=" + that.data.cache
          })
        })
      } else {
        // 微信支付
        if (data.result.status == -1) c.alert(data.result.message)
        // 红包兑换区
        if (that.data.links.goods.goodstype == 3) {
          if (data.result.goodstype == 3 && data.result.status == 2) c.confirm('恭喜您，领取成功', function () {
            wx.redirectTo({
              url: '/pages/creditshop/log_detail/index?id=' + data1
            })
          })
        }
        // 兑换商品
        if (that.data.links.goods.goodstype == 0) {
          if (data.result.goodstype == 0 && data.result.status == 2) c.confirm('恭喜您，兑换成功', function () {
            wx.redirectTo({
              url: '/pages/creditshop/log_detail/index?id=' + data1
            })
          })
        }
        // 余额兑换区
        if (that.data.links.goods.goodstype == 2) {
          if (data.result.goodstype == 2 && data.result.status == 3) c.confirm('恭喜您，领取成功', function () {
            wx.redirectTo({
              url: '/pages/creditshop/log_detail/index?id=' + data1
            })
          })
        }
        // 兑换券
        if (that.data.links.goods.goodstype == 1) {

          if (data.result.goodstype == 1 && data.result.status == 3) c.confirm('恭喜您，领取成功', function () {
            wx.redirectTo({
              url: '/pages/creditshop/log_detail/index?id=' + data1
            })
          })
        }
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.nocache){
      this.setData({
        cache: options.nocache
      })
    }
   
    var that = this
    var param = {
      timestamp: options.timestamp,
      id: options.id
      }
    if (options.optionid){
        param = {
        timestamp: options.timestamp,
        id: options.id,
        optionid : options.optionid
      }
      that.setData({
        optionid: options.optionid
      })
    }else{
        param = {
        timestamp: options.timestamp,
        id: options.id,
      }
    }
    wx.showLoading({
      title: '加载中...',
    })
    c.get("creditshop/create", param, function(a) {
      wx.hideLoading();
      console.log(a.result);
      that.setData({
        links: a.result,
        name: a.result.realname,
        cursor: a.result.mobile,
        iphone: a.result.mobile
      })
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var i = this,
      d = app.getCache("orderAddress"),
      s = app.getCache("orderShop");
    d && (this.setData({
      address: d
    }))
      s && this.setData({
       carrierInfo: s
      });
  },
  onShareAppMessage: function () {

  }
})