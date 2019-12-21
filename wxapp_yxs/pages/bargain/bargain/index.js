// pages/bargain/bargain/index.js
var app = getApp(),
  model = app.requirejs("model"),
  c = app.requirejs("core"),
  s = app.requirejs("wxParse/wxParse");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    hidden: 0,
    eno:0
  },
  tapwait: function(e) {
    var that = this
    this.setData({
      num: e.currentTarget.dataset.num,
      hidden: e.currentTarget.dataset.hidden
    })
  },
  // 点击显示二维码
  eno: function (e) {
    this.setData({
      eno: e.currentTarget.dataset.eno,
    })
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var url = this.getCurrentPageUrl();
    console.log(url)
    if(options.goods){
      var param = {
        id: options.goods,
        mid: options.mid
      }
    }else{
      var param = {
        id: options.id,
        mid: options.mid
      }
    }
  
    this.setData({
      mid: options.mid,
      url:url
    })

    this.init(param)
  },
  // 刷新页面
  shuxin:function(e){
    wx.redirectTo({
      url: '/pages/bargain/bargain/index?id=' + that.data.list.res.id + "&mid=" + that.data.mid,
    })
  },
  init: function(param) {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    c.get('bargain/bargain', param, function(data) {
      wx.hideLoading()
      var article = data.result.ewei_detail.content
      setTimeout(function() {
        s.wxParse('article', 'html', article, that, 5);
      }, 1)
      if (data.result.res2.rule != null && data.result.res2.rule !="") {
        that.setData({
          article1: data.result.res2.rule
        })
      } else {
        that.setData({
          article1: data.result.account_set.rule
        })
      }
      // setTimeout(function() {
      //   s.wxParse('article1', 'html', article1, that, 5);
      // }, 1)
      // if (s.wxParse("wxParseData", "html", data.result.goods.goodsdetail, that, "5"), that.setData({
      //   show: !0,
      //   option: data.result
      // }))
      that.setData({
        list: data.result,
      })
      var time = model.ShowCountDown(data.result.res.end_time_2)
      that.setData({
        endtime: time
      })
      var countTime = setInterval(function() {
        var time = model.ShowCountDown(data.result.res.end_time_2);
        if (time == '已过期')
          clearInterval(countTime)
        that.setData({
          endtime: time
        })
      }, 1000)
    }, 1, 0)
  },
  // 砍一刀
  bargain: function(e) {
    var that = this;
    console.log(that.data.mid)
    c.post("bargain/bargain", {
      mid: that.data.mid,
      id: that.data.list.res.id,
      ajax: 151
    }, function(data) {
      c.confirm(data.result.data, function(datae) {
        wx.redirectTo({
          url: '/pages/bargain/bargain/index?id=' + that.data.list.res.id + "&mid=" + that.data.mid,
        })
      })
    })
  },

  getCurrentPageUrl: function (){
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var options = currentPage.options    //如果要获取url中所带的参数可以查看options

    //拼接url的参数
    var urlWithArgs = url + '?'
    for (var key in options) {
      var value = options[key]
      urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

    return urlWithArgs

  },
  onShareAppMessage: function () {

  }
})