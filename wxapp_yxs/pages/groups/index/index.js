var a = getApp(), e = a.requirejs("core"), t = a.requirejs("foxui"), n = a.requirejs("jquery");
Page({
  data: {
    route: "groups",
    category: "",
    recgoods: "",
    count_recgoods: "",
    scrollHeight: 0,
  },
  onLoad: function (r) {
    var a = this;
    this.getindex();
  },
  getindex: function(){
    var a = this;
    var SystemHeight = 0;
    wx.getSystemInfo({
      success: function (res) {
        SystemHeight = res.windowHeight;
      }
    });
    e.get("groups/index", {}, function (e) {
      a.setData({
        category: e.result.category,
        recgoods: e.result.recgoods,
        count_recgoods: e.result.count_recgoods,
        count_category: e.result.count_category,
        scrollHeight: SystemHeight + ( (e.result.recgoods.length -3) * 110)
      })

    })
  },
  onShareAppMessage: function () {

  }

})
