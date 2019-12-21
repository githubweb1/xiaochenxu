// pages/order/pay/peerpaydetail.js
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
    core.get("order/pay/peerpaydetail", options, function (data) {
      that.setData({
        list: data.result
      })
    })
  },
  next: function (e) {
    var that = this
    if (e.currentTarget.dataset.eno){
      that.setData({
        eno: e.currentTarget.dataset.eno
      })
    } else if (e.currentTarget.dataset.type=="buy"){
      let maxmoney = parseFloat(that.data.list.peerpay.peerpay_selfpay)
      let peerpaytype = that.data.list.peerpay.peerpay_type
      let peerprice = that.data.peerprice
      let message = that.data.message
      if (peerprice<0){
        core.alert("请填写代付金额")
      } else if (peerpaytype != 0 && peerprice > maxpeerpay && maxpeerpay>0){
        core.alert("您最多代付" + maxpeerpay+"元")
      } else if (peerprice > that.data.list.rate_price){
        core.alert("不能超付")
      }
      else {
        wx.redirectTo({
          url: '/pages/order/pay/index?id=' + that.data.list.peerpay.oid + "&peerprice" + peerprice + "&peerpaymessage" + message,
        })
      }
      
    } else if (e.currentTarget.dataset.type == "mineplay"){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  moneyinput:function(e){
      var that = this
  
    let peerprice = e.detail.value
    that.setData({
      peerprice: peerprice
    })
  },
  text: function (e) {
    var that = this
    that.setData({
      message: e.detail.value,
    })
  },
})