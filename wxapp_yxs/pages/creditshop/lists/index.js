// pages/IntegralMall/allShop/allShop.js
var app = getApp();
var a = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link:"",
    search:"",
    page1: "",
    more: 0,
    page: 1,
    link1:"",
    index:0,
    home:0,
    alllist: 1,
    my: 0
  },
// 加载更多
  moreinfo:function(e){
    var that = this
    var page1 = (that.data.page1) * 1 
    var page = ++that.data.page
    var params = {
      "page": page
    }
    if (page < page1 || page == page1) {
      wx.showLoading({
        title: '加载中...',
      })
      a.get("creditshop/lists/getlist", params, function (a) {
        wx.hideLoading();
        var concat = (that.data.link.list).concat(a.result.list)
        that.setData({
          "link.list": concat
        })
      })
    } else {
      that.setData({
        more: 1
      })

    }
  },
  // 加载page
  page: function (a, b) {
    var page = Math.floor(a * 1 / b * 1) * 1 + 1
    this.setData({
      page1: page,
      page:1
    })
    if (this.data.page > page || this.data.page == page){
      this.setData({
        more: 1
      })
    }else{
      this.setData({
        more: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 搜索内容
  searchinput:function(e){
      let  that = this;
      that.setData({
        search:e.detail.value
      })
    wx.showLoading({
      title: '加载中...',
    })
    a.get("creditshop/lists/getlist", { "keywords": that.data.search }, function (a) {
      wx.hideLoading();
      that.setData({
        link: a.result
      })
      that.page(that.data.link.total, that.data.link.pagesize)
    })
  },
  // 分类切换
  bindPickerChange:function(e){
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
        that.setData({
          index: e.detail.value
        })
    var index= (e.detail.value)*1-1
    var cate = that.data.cateId[index]
    a.get("creditshop/lists/getlist", { "cate": cate }, function (a) {
      wx.hideLoading();
      that.setData({
        link: a.result
      })
      that.page(that.data.link.total, that.data.link.pagesize)
    })
  },
  
  onLoad: function (options) {
    var that = this
    // var num 
    var id = options.id
    var index = options.index
    if(options.cate){
      var cate = options.cate
    }
    wx.showLoading({
      title: '加载中...',
    })
    a.get("creditshop/lists/getlist", { cate:cate}, function (a) {
      wx.hideLoading();
      that.setData({
        link: a.result
      })
      that.page(that.data.link.total, that.data.link.pagesize)
      if (options.index) {
        that.setData({
          index: index * 1 + 1
        })
      }
    })
    a.get("creditshop/lists", {}, function (a) {
      wx.hideLoading();
      let category = a.result.category
      let len = category.length
      let cateName = []
      var cateId = []
      for (var i = 0; i < len; i++) {
        cateName.push(category[i].name)
        cateId.push(category[i].id)
      }
      cateName.unshift("全部商品")
      that.setData({
        cateName: cateName,
        cateId: cateId
      })
    })
  },

  onShareAppMessage: function () {

  }
})