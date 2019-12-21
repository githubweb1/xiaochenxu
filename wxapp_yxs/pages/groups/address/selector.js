// pages/groups/address/selector.js
var t = getApp(),
  e = t.requirejs("core");
Page({
  data: {
    loaded: !1,
    list: [],
    bt: '<'
  },
  onLoad: function(e) {
    t.url(e)
  },
  onShow: function() {
    this.getList()
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  back: function(){
    wx.navigateBack()
  },
  getList: function() {
    var t = this;
    e.get("groups/address/selector", {}, function(e) {
      t.setData({
        loaded: !0,
        list: e.result.list,
        show: !0
      })
    })
  },
  select: function(s) {
    var i = e.pdata(s).index;
    e.post('groups/address/setdefault', { id: this.data.list[i].id}, function(res){
    });
    t.setCache("orderAddress", this.data.list[i], 30), wx.navigateBack()
  },
  onShareAppMessage: function () {

  }
})