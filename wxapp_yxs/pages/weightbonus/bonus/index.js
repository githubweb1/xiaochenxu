// pages/globonus/bonus/index.js
var t = getApp(),
  q = t.requirejs("core"),
  i = t.requirejs("foxui"),
  a = t.requirejs("jquery");
Page({


  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    list: "",
    page1: "",
    more: 0,
    page: 1
  },
  tapwait: function(e) {
    console.log(e.currentTarget.dataset.status)
    var that = this
    this.setData({
      status: e.currentTarget.dataset.status,
    })
    let status = e.currentTarget.dataset.status
    that.http1(status)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (options.status) {
      this.http1(options.status)
      that.setData({
        status:options.status
      })
    
    } else {
      that.http1(that.data.status)
    }
  },
  // 网络请求
  http1: function (status2){
    var that = this
  var  parms = {
      status: status2,
      page:1
    }
    wx.showLoading({
      title: '加载中...',
    })
    q.get("weightbonus/bonus", parms, function (data) {
      var ok = that.toDecimal2(data.result.bonus.ok)
      var lock = that.toDecimal2(data.result.bonus.lock)
      var total = that.toDecimal2(data.result.bonus.total)
      wx.hideLoading()
      that.setData({
        list: data.result,
        ok: ok,
        lock: lock,
        total: total
      })
    })
    q.get("weightbonus/bonus/get_list", parms, function (data) {
        wx.hideLoading()
        that.setData({
          list1: data.result,
        })
      var page = Math.floor(data.result.total * 1 / data.result.pagesize * 1) + 1
      that.setData({
        page1: page,
        page: 2
      })
      })
  },
  // 保留两位小数
  toDecimal2: function (x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  },
  // 点击刷新
  moreinfo: function (e) {
    var that = this
    var page1 = (that.data.page1) * 1 + 1
    var page = that.data.page++
    var params = {
      "status": that.data.status,
      "page": page
    }
    if (page < page1) {
      wx.showLoading({
        title: '加载中...',
      })
      a.get("weightbonus/bonus/get_list", params, function (a) {
        wx.hideLoading();
        var concat = (that.data.list1.list).concat(a.result.list)
        that.data.links.list == concat
        that.setData({
          "list1.list": concat
        })
      })
    } else {
      that.setData({
        more: 1
      })
    }
  },
  onShareAppMessage: function () {

  }
})