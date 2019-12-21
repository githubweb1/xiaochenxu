// pages/groups/orders/index.js
var t = getApp(), a = t.requirejs("core"), e = t.requirejs("biz/order");
Page({
  data: {
    status: "0",
    list: [],
    scrollHeight: 0,
    cancel: e.cancelArray,
    zj:"",
    eno:0
  },


  onLoad: function (a) {
      this.get_list()
  },


  get_list: function () {
    var t = this;
    t.setData({
      loading: !0
    }),
    a.get("groups/orders/get_list", {}, function (e) {
      t.setData({
        list: e.result.list
      })
    })
  },
  // 点击显示二维码
  eno: function (e) {
    var that = this
    that.setData({
      eno: e.currentTarget.dataset.eno,
      a: e.currentTarget.dataset.a,
      id: e.currentTarget.dataset.id
    })
    a.get("groups/verify/qrcode", { id: e.currentTarget.dataset.id},function(data){
      that.setData({
        src : data.result.url
      })
    })
  },
  // 选中列表
  selected: function (t) {
    var st = a.data(t).type;
    var t = this;
    a.get("groups/orders/get_list", {status:st}, function (e) {
      t.setData({
        status: st,
        empty: !1,
        loading: !0,
        list: e.result.list
      })
    })
  },

  // 取消订单
  cancel: function (t) {
    var s = a.data(t).orderid;
    a.post("groups/orders/cancel", { id: s, remark: t.detail.value},function(res){
    })
    wx.reLaunch({
      url: '/pages/groups/orders/index',
    })
  },


  // 删除订单
  delete: function (t) {
    var id = a.data(t).orderid;
    a.post("groups/orders/delete", { id: id }, function (res) {
    })
    a.confirm("确认要删除吗?", function () {
      wx.reLaunch({
        url: '/pages/groups/orders/index',
      })
    }, function () { })
  },

  // 完成订单
  finish: function (t) {
    var id = a.data(t).orderid;
    a.get("groups/orders/finish", { id: id }, function (res) {
    })
    a.confirm("确认完成收货吗?", function () {
      wx.reLaunch({
        url: '/pages/groups/orders/index',
      })
    }, function () { })
  },
  onShareAppMessage: function () {

  }
})
