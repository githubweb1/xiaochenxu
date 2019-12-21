var t = getApp(), e = t.requirejs("core"), i = t.requirejs("foxui");
// pages/order/pay/peerpay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      num:0,
    subtype:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      options: e
    }),
      t.url(e)
  },
  tapwait: function (e) {
    var that = this
    that.setData({
      num: e.currentTarget.dataset.num,
      subtype: e.currentTarget.dataset.type
    })
  },
text:function(e){
  var that = this
  that.setData({
    message: e.detail.value,
  })
},
// 下一步
  next :function(q){
    var that = this
    e.post('order/pay/peerpay', { id: that.data.options.id, 'type': that.data.subtype, message: that.data.message},function(data){
      // "order/pay/peerpayshare"
            wx.redirectTo({
              url: '/pages/order/pay/peerpayshare?id=' + data.result.id,
            })
    })
  },  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_list()
  },

  get_list: function () {
    var t = this;
    e.get("order/pay/check", {id:t.options.id}, function(r){
      if(r.status!=1){
        e.alert(r.result.message);
      }
    })
    
    e.get("order/pay/peerpay",t.data.options, function (i) {
      t.setData({
        list:i.result
      })
      // if (50018 == i.error)
      //   return void wx.navigateTo({
      //     url: "/pages/order/detail/index?id=" + t.data.options.id
      //   });
      // !i.wechat.success && "0.00" != i.order.price && i.wechat.payinfo && e.alert(i.wechat.payinfo.message + "\n不能使用微信支付!"),
      //   t.setData({
      //     list: i,
      //     show: !0
      //   })
    })
  },


})