// pages/globonus/index/index.js
var t = getApp(),
  q = t.requirejs("core"),
  i = t.requirejs("foxui"),
  a = t.requirejs("jquery");
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
    var i = this
    q.get("weightbonus", {}, function (data) {
     
      if (data.result.member.isagent == "" || data.result.member.isagent == 0 || !data.result.member.isagent || data.result.member.status == "" || data.result.member.status == 0 || !data.result.member.status) {
        wx.redirectTo({
          url: '/pages/commission/register/index',
        })
      } else if (data.result.member.isweight == "" || !data.result.member.isweight || data.result.member.isweight == 0 || data.result.member.weightstatus == "" || data.result.member.weightstatus == 0 || !data.result.member.weightstatus) {
        wx.redirectTo({
          url: '/pages/weightbonus/register/index',
        })
      }
      var ok = i.toDecimal2(data.result.bonus.ok)
      var lock = i.toDecimal2(data.result.bonus.lock)
      var total = i.toDecimal2(data.result.bonus.total)
      wx.hideLoading()
      i.setData({
        list: data.result,
        ok: ok,
        lock: lock,
        total: total
      })
    })
  },
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
  onShareAppMessage: function () {

  }

})