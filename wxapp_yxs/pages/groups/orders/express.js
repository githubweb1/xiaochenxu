// pages/groups/orders/express.js
var a = getApp(), e = a.requirejs("core"), i = a.requirejs("biz/order");
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
    e.get('groups/orders/express', { id: options.id }, function (res) {
      var r=res.result;
      if (res.status==1){
        a.setData({
          expresscom: options.expresscom,
          expresssn: options.expresssn,
          expresslist: r.expresslist,
          goods: r.goods,
          count_expresslist: r.count_expresslist,
          ifstrexists: r.ifstrexists
        })
      }
      
    })
  },
  onShareAppMessage: function () {

  }
  
})