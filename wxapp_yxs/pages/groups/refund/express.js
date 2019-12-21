// pages/groups/refund/express.js
var a = getApp(), e = a.requirejs("core");
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
    var a = this;
    e.get('groups/refund/express', { id: options.id }, function (res) {
      var r = res.result;
      a.setData({
        expresslist: r.expresslist,
        expresscom: r.expresscom,
        expresssn: r.expresssn
      })
    })
  },
  onShareAppMessage: function () {

  }
 
})