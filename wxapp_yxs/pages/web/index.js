// pages/web/index.js //作者www.cheryon.club
var t = getApp(), a = t.requirejs("core");
Page({
  data: {
  },
  onLoad: function (options) {
    this.setData({
      url: decodeURIComponent(options.url)
    })
  },

})