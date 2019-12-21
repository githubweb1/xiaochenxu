// pages/IntegralMall/commodityDetails/commodityDetails.js
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
    pay: 0,
  },
  tapwait: function(e) {
    this.setData({
      num: e.currentTarget.dataset.num,
      hidden: e.currentTarget.dataset.hidden
    })
  },
  tabLuck:function(e){
    this.setData({
      pay: e.currentTarget.dataset.pay,
    })
  },
  init: function(id) {
    var that = this
    c.get('creditshop/detail', {
      'id': id
    }, function(data) {
      var article = data.result.goods.goodsdetail;
       var article1,article2;
      if (data.result.goods.detailshow==1){
         article1 = data.result.goods.detail
      } else if (data.result.set.isdetail){
        article1 = data.result.set.detail
      }
      
      if (data.result.goods.noticedetailshow == 1) {
        article2 = data.result.goods.noticedetail
      } else if (data.result.set.isnoticedetail) {
        article2 = data.result.set.noticedetail
      }

      setTimeout(function () {
        s.wxParse('article', 'html', article, that, 5);
        s.wxParse('article1', 'html', article1, that, 5);
        s.wxParse('article2', 'html', article2, that, 5);
      }, 1)
      // if (s.wxParse("wxParseData", "html", data.result.goods.goodsdetail, that, "5"), that.setData({
      //   show: !0,
      //   option: data.result
      // }))
      console.log(data.result);
      that.setData({
        goods: data.result.goods,
        goodsrec: data.result.goodsrec,
        log: data.result.log,
        logtotal: data.result.logtotal,
        replytotal: data.result.replytotal,
        replys: data.result.replys,
        url: data.result.url,
        set:data.result.set
      })
      var time = model.ShowCountDown(data.result.goods.timeend)
      that.setData({
        endtime: time
      })
      var countTime = setInterval(function() {
        var time = model.ShowCountDown(data.result.goods.timeend);
        if (time == '已过期')
          clearInterval(countTime)
        that.setData({
          endtime: time
        })
      }, 1000)
    }, 1, 0)
  },
  //选择规格
  chooseOption: function(e) { 
    if (this.data.option) {
      this.data.select && e.currentTarget.dataset.order ? this.createOrder(this.data.select.id) : this.setData({
        pay: e.currentTarget.dataset.pay
      })
      return;
    }
    var that = this
    c.get('creditshop/detail/option', {
      goodsid: this.data.goods.id
    }, function(data) {
      if (!data.status) {
        that.createOrder()
        return
      }
      that.setData({
        pay: e.currentTarget.dataset.pay,
        option: data.result,
      })
    })
  },

  optionActive: function(e) {
    var id = e.currentTarget.dataset.id
    var iindex = e.currentTarget.dataset.iindex
    var option = this.data.option
    option.specs[iindex]['select'] = id
    var len = option.specs.length;
    var specs = '';
    var select = !1;
    for (var i = 0; i < len; i++) {
      if (option.specs[i].select) specs += option.specs[i].select + '_'
      else break
    }
    specs = specs.slice(0, -1)
    len = option.options.length
    for (var i = 0; i < len; i++) {
      if (option.options[i].specs.split('_').sort().join(',') == specs.split('_').sort().join(',')) {
        select = option.options[i]
        this.setData({
          select: select
        })
        break
      }
    }
    this.setData({
      option: option
    })
  },
  moreLog: function() {
    var that = this
    var page = this.data.logPage ? this.data.logPage : 1;
    var log = this.data.log;
    c.get('creditshop/detail/getlistlog', {
      page: page,
      goodsid: that.data.goods.id
    }, function(data) {
      log = log.concat(data.result.list)
      that.setData({
        log: log,
        logPage: ++page
      })
    })
  },
  replymore:function(){
    var that = this;
    var page = this.data.replypage ? this.data.replypage : 1;
    var replys = this.data.replys;
    c.get('creditshop/detail/getlistreply', {
      page: page,
      goodsid: that.data.goods.id
    }, function (data) {
      replys = replys.concat(data.result.list)
      that.setData({
        replys: replys,
        replypage: ++page
      })
    })
  },
  createOrder: function(Option = false) {
    var optionStr = Option ? '&optionid=' + Option : '';
    wx.navigateTo({
      url: '/pages/creditshop/createorder/index?id=' + this.data.goods.id + optionStr + '&nocache='+this.data.cache
    })
  },

  onLoad: function(o) {
    this.init(o.id)
    if(o.nocache){
      this.setData({
        cache: o.nocache
      })
    }
  },
  onShareAppMessage: function () {

  }
})