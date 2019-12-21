// pages/groups/team/index.js
var a = getApp(), e = a.requirejs("core");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    success: "0",
    scrollHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var a = this;
    var SystemHeight = 0;
    wx.getSystemInfo({
      success: function (res) {
        SystemHeight = res.windowHeight;
      }
    });
    e.get('groups/team/get_list', {}, function(res){
      if(res.status==1){
        a.setData({
          list: res.result.list,
          pagesize: res.result.pagesize,
          total: res.result.total,
          scrollHeight: SystemHeight + ((res.result.list.length -3) * 400)
        })
      }else{
        console.log(res)
      }
    }) 
     
  },

  // 选中列表
  selected: function (t) {
    var st = e.data(t).type;
    var t = this;
    e.get("groups/team/get_list", { success: st }, function (e) {
      t.setData({
        page: 1,
        success: st,
        empty: !1,
        loading: !0,
        list: e.result.list
      })
    })
  },
  onShareAppMessage: function () {

  }

})