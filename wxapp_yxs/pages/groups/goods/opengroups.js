var a = getApp(), e = a.requirejs("core"), t = a.requirejs("foxui"), n = a.requirejs("jquery");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: "",
    teams: "",
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
    e.get('groups/goods/openGroups', { id: options.id }, function (e) {
      a.setData({
        goods: e.result.goods,
        teams: e.result.teams,
        scrollHeight: SystemHeight + ((e.result.teams.length - 1) * 110)
      })
    })
  },
  
  //开团 
  tapopen: function (event) {
    var id = event.currentTarget.dataset.id;
    e.get('groups/goods/goodsCheck', { id: id}, function(res){
      if(res.status==1){
        //跳转
        console.log("qwe")
        wx.navigateTo({
          url: '/pages/groups/orders/confirm?heads=1&type=groups&id='+id
          })
      }else{
        wx.showToast({
          title: res.result.message,
          icon: 'success',
          duration: 1500
        })
      }
    })
  },
  onShareAppMessage: function () {

  }
})