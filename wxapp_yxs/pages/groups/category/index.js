var a = getApp(), e = a.requirejs("core"), t = a.requirejs("foxui"), n = a.requirejs("jquery");
Page({
  data: {
    route: "groups",
    category: "",
    recgoods: "",
    count_recgoods: "",
    scrollHeight: 0,
    keyword:'',
    page: 1,
    pageSize: 30,
    hasMoreData: true,
  },
  onLoad: function (r) {
    var a = this;
    var SystemHeight = 0;
    wx.getSystemInfo({
      success: function (res) {
        SystemHeight = res.windowHeight;
      }
    });
    if (r.category){
      e.get("groups/category/get_list", { category: r.category}, function (e) {
        a.setData({
          recgoods: e.result.list,
          scrollHeight: SystemHeight + ((e.result.list.length - 3) * 110)
        })
      })
    }else{
      if (r.keyword){
        e.get("groups/category/get_list", { keyword: r.keyword}, function (e) {
          a.setData({
            recgoods: e.result.list,
            scrollHeight: SystemHeight + ((e.result.list.length-1) * 110)
          })
        })
      }else{
        e.get("groups/category/get_list", {}, function (e) {
          a.setData({
            recgoods: e.result.list,
            scrollHeight: SystemHeight + ((e.result.list.length - 5) * 150)
          })
        })
      }
    }
  },

  //实时获取keyword数据
  bindKeyInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  back:function(){
    wx:wx.navigateBack({
      delta: 1,
    })
  },
  onShareAppMessage: function () {

  }

})
