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
    q.get("abonus", {}, function (data) {

      // if (data.result.member.isagent == "" || data.result.member.isagent == 0 || !data.result.member.isagent || data.result.member.status == "" || data.result.member.status == 0 ||!data.result.member.status){
      //   wx.redirectTo({
      //       url: '/pages/commission/register/index',
      //     })
      // } else if (data.result.member.isaagent == "" || !data.result.member.isaagent || data.result.member.isaagent == 0 || data.result.member.aagentstatus == "" || data.result.member.aagentstatus == 0 || !data.result.member.aagentstatus) {
      //   wx.redirectTo({
      //     url: '/pages/abonus/register/index',
      //   })
      // }
       var ok1 = i.toDecimal2(data.result.bonus.ok1)
      var ok2 = i.toDecimal2(data.result.bonus.ok2)
      var ok3 = i.toDecimal2(data.result.bonus.ok3)
      var ok = i.toDecimal2(data.result.bonus.ok)
      var lock1 = i.toDecimal2(data.result.bonus.lock1)
      var lock2 = i.toDecimal2(data.result.bonus.lock2)
      var lock3 = i.toDecimal2(data.result.bonus.lock3)
      var lock = i.toDecimal2(data.result.bonus.lock)
      var total1 = i.toDecimal2(data.result.bonus.total1)
      var total2 = i.toDecimal2(data.result.bonus.total2)
      var total3 = i.toDecimal2(data.result.bonus.total3)
      var total = i.toDecimal2(data.result.bonus.total)
      var bonus_wait1 = i.toDecimal2(data.result.bonus_wait1)
      var bonus_wait2 = i.toDecimal2(data.result.bonus_wait2)
      var bonus_wait3 = i.toDecimal2(data.result.bonus_wait3)
      wx.hideLoading()
      i.setData({
        list: data.result,
        ok1:ok1,
        ok2: ok2,
        ok3: ok3,
        ok: ok,
        lock1: lock1,
        lock2: lock2,
        lock3: lock3,
        lock: lock,
        total1: total1,
        total2: total2,
        total3: total3,
        total: total,
        bonus_wait1: bonus_wait1,
        bonus_wait2: bonus_wait2,
        bonus_wait3: bonus_wait3
    })


    })
  },
  toDecimal2: function (x) {
    var f = parseFloat(x);
    if(isNaN(f)) {
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
  } ,
  onShareAppMessage: function () {

  }
})