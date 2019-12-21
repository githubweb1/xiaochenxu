var t = getApp(), e = t.requirejs("core"), i = t.requirejs("biz/order");
Page({
  data: {
    code: !1,
    consume: !1,
    store: !1,
    cancel: i.cancelArray,
    cancelindex: 0,
    diyshow: {},
    address:""
  },
  onLoad: function (options) {
    var a = this;
    e.get('groups/orders/detail', options, function (e) {
      if (e.result.address == null){
        a.setData({
          order: e.result.order,
          good: e.result.good,
          xj: e.result.merchandise_subtotal,
          zj: e.result.order_amount_including_freight
        })
      }else{
        a.setData({
          order: e.result.order,
          address: e.result.address,
          good: e.result.good,
          xj: e.result.merchandise_subtotal,
          zj: e.result.order_amount_including_freight
        })
      }
     
    })
  },


  diyshow: function (t) {
    var i = this.data.diyshow,
      a = e.data(t).id;
    i[a] = !i[a],
      this.setData({
        diyshow: i
      })
  },


  // 取消订单
  cancel: function (t) {
    var s = e.data(t).orderid;
    e.post("groups/orders/cancel", { id: s, remark: t.detail.value }, function (res) {
    })
    wx.reLaunch({
      url: '/pages/groups/orders/index',
    })
  },


  // 删除订单
  delete: function (t) {
    var id = e.data(t).orderid;
    e.post("groups/orders/delete", { id: id }, function (res) {
    })
    e.confirm("确认要删除吗?", function () {
      wx.reLaunch({
        url: '/pages/groups/orders/index',
      })
    }, function () { })
  },

  // 完成订单
  finish: function (t) {
    var id = e.data(t).orderid;
    e.get("groups/orders/finish", { id: id }, function (res) {
    })
    e.confirm("确认完成收货吗?", function () {
      wx.reLaunch({
        url: '/pages/groups/orders/index',
      })
    }, function () { })
  },

  //取消申请
  btncancle: function (t) {
    var id = e.data(t).orderid;
    var teamid = e.data(t).teamid;
    e.post("groups/refund/cancel", { orderid: id }, function (res) {
    })
    e.confirm("确定要取消申请吗?", function () {
      wx.reLaunch({
        url: '/pages/groups/orders/detail?orderid='+id+'&teamid='+teamid,
      })
    }, function () { })
  }, 
  onShareAppMessage: function () {

  }
})