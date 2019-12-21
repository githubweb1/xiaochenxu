var a = getApp(),
  e = a.requirejs("core"),
  i = a.requirejs("foxui"),
  n = a.requirejs("jquery");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back_bt: '<',
    success: !1,
    successData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options
    })
    var a = this;
    e.get('groups/pay', options, function(res) {
      var i = res.result;
      if (50018 == i.error)
        return void wx.navigateTo({
          url: "/pages/groups/orders/detail?orderid=" + t.data.options.id
        });
      !i.wechat.success && "0.00" != i.order.price && i.wechat.payinfo && e.alert(i.wechat.payinfo.message + "\n不能使用微信支付!"),
        a.setData({
          list: i,
          show: !0
      })
    })
  },

  pay: function(t) {
    var i = e.pdata(t).type,
      o = this,
      a = this.data.list.wechat;
    "wechat" == i ? e.pay(a.payinfo, function(t) {
      "requestPayment:ok" == t.errMsg && o.complete(i)
    }) : "credit" == i ? e.confirm("确认要支付吗?", function() {
      o.complete(i)
    }, function() {}) : "cash" == i ? e.confirm("确认要使用货到付款吗?", function() {
      o.complete(i)
    }, function() {}) : o.complete(i)
  },

  complete: function(t) {
    var o = this;
    e.get("groups/pay/complete", {
      orderid: o.data.options.orderid,
      teamid: o.data.options.teamid,
      type: t
    }, function(t) {
      if (t.status == 1) {
        void o.setData({
          success: !0,
          successData: t
        })
        wx.navigateTo({
          url: '/pages/groups/team/detail?teamid=' + o.data.list.order.id + '&orderid=' + o.data.list.order.id
        })
      } else {
        e.alert(t.result.message)
      }
    }, !0, !0)

  },
  shop: function(t) {
    0 == e.pdata(t).id ? this.setData({
      shop: 1
    }) : this.setData({
      shop: 0
    })
  },
  phone: function(t) {
    e.phone(t)
  },
  //cc_zhong 全付通支付
  swiftpay: function(t) {
    var t = this;
    e.get("changce/swift/dopay", t.data.options, function(a) {
      if (!a.token) {
        return void e.alert(a.message);
      } else {
        var result = JSON.parse(a.pay_info);
        wx.requestPayment({
          'timeStamp': result.timeStamp,
          'nonceStr': result.nonceStr,
          'package': result.package,
          'signType': 'MD5',
          'paySign': result.paySign,
          'success': function(res) {
            wx.showModal({
              title: '支付成功',
              content: '如订单状态未变更，可耐心等待片刻！',
              showCancel: false,
              confirmText: '确定',
              success: function(res) {
                return void wx.navigateTo({
                  url: "/pages/groups/orders/detail/index?orderid=" + t.data.options.id + '&teamid' + t.data.options.teamid
                });
              }
            })
          },
          'fail': function(res) {
            e.alert('支付失败！');
          }
        })
      }
    })
  },
  onShareAppMessage: function () {

  }
})