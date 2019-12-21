// pages/groups/team/detail.js
var a = getApp(),
  e = a.requirejs("core"),
  s = a.requirejs("wxParse/wxParse"),
  WxParse = require('../../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: "team",
    endtime: 0, 
    share :true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var a = this;
    console.log(options)
    a.setData({
      options: options
    })

    e.get('groups/team/detail', options, function(res) {
      if (res.result.groupsset.groups_description!='') {
        s.wxParse("wxParseData", "html", res.result.groupsset.groups_description, a, "5")
      } else {
        s.wxParse("wxParseData", "html", res.result.goods.content, a, "5")
      }
      a.setData({
        goods: res.result.goods,
        lasttime2: res.result.lasttime2,
        n: res.result.n,
        arr: res.result.arr,
        orders: res.result.orders,
        tuan_first_order: res.result.tuan_first_order,
        thumb: res.result.thumb,
        groupsset: res.result.groupsset,
        myorder: res.result.myorder
      })
      
      a.counttime(res.result.tuan_first_order.endtime);
      
    });
   
  },

  onShow: function (){
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  // 选中列表
  selected: function(t) {
    var select = "team";
    var st = e.data(t).tab;
    if (select == st) {
      this.setData({
        select: st
      })
    } else {
      this.setData({
        select: "basic"
      })
    }
  },
  

  //带天数的倒计时
  counttime: function(endtime) {
    var that = this;
    //获取当前时间  
    var date = new Date();
    var now = date.getTime();
    //设置截止时间  
    var endDate = new Date(endtime);
    var end = endDate.getTime();
    //时间差  
    var leftTime = end - now;
    that.setData({
      leftTime: leftTime
    })
    
    if (leftTime<=0){return;}
    var timer = setInterval(function(){
     
      var leftTime1 = that.data.leftTime-1000;
      //定义变量 d,h,m,s保存倒计时的时间 
      var d, h, m, se;
      if (leftTime1 >= 0) {
        d = Math.floor(leftTime1 / 1000 / 60 / 60 / 24);
        h = Math.floor(leftTime1 / 1000 / 60 / 60 % 24);
        m = Math.floor(leftTime1 / 1000 / 60 % 60);
        se = Math.floor(leftTime1 / 1000 % 60);
      }else{
       
        clearInterval(timer);
        timer = null;
       
        var options = that.data.options;
        e.get('groups/team/detail', options, function (res) {
        
          if (res.result.groupsset) {
            s.wxParse("wxParseData", "html", res.result.groupsset.groups_description, that, "5")
          } else {
            s.wxParse("wxParseData", "html", res.result.goods.content, that, "5")
          }
          that.setData({
            goods: res.result.goods,
            lasttime2: res.result.lasttime2,
            n: res.result.n,
            arr: res.result.arr,
            orders: res.result.orders,
            tuan_first_order: res.result.tuan_first_order,
            thumb: res.result.thumb,
            groupsset: res.result.groupsset,
          })

          that.counttime(res.result.tuan_first_order.endtime);

        });

      }
      //将倒计时赋值到页面中  
      that.setData({
        day: d,
        hour: h,
        minute: m,
        second: se,
        now: now,
        leftTime: leftTime1
      })
    }, 1000);
  },

  // 分享
  share:function(){
    var that = this;
    that.setData({
      share: false
    })
  },
  hideshare:function(){
    var that = this;
    that.setData({
      share: true
    })
  },
  onShareAppMessage: function () {

  }

})