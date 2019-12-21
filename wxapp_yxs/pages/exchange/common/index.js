// pages/exchange/index/index.js
var app = getApp();
var core = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exchange: "兑换",
    group: 0,
    colorddd: 0,
    datasta: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getinfo()
  },
  getinfo: function() {
    core.get("exchange", {
      all: 1
    }, function(data) {

    })
  },
  // 输入框
  inputexchange(e) {
    var input = e.detail.value.replace(/\s+/g, '')
    this.setData({
      input: input
    })
  },
  // 马上兑换
  fastExchange(e) {
    var that = this;
    if (!this.data.input) {
      core.alert("请输入兑换码")
    } else {
      //请求组id
      var input_key = that.data.input;
      core.get("exchange/findgroupid", { key: input_key}, function(e){
        that.setData({
          groupid: e.result.groupid
        })
      })
      core.get("exchange", {
        // codetype: 1,
        key: that.data.input,
        all: 1,
        id: that.data.groupid
      }, function(data) {
        that.setData({
          link:data
        })
        if (data.status == 0) {
          core.confirm(data.message)
        } else if (data.status == 1 || data.status == 2 || data.status == 3 || data.status == 4 || data.status == 5 || data.status == 6) {
          core.get("exchange/groupexchange", {
            key: that.data.input
          }, function (data) {
            that.setData({
              list: data
            })
          })
        
          if (data.status == 6) {
            that.setData({
              group: 1
            })
          }
        }
     
      })
    
    }
  },
  // 返回马上兑换
  fastExchange1(e) {
    this.setData({
      list: ""
    })
  },
  // 点击兑换
  exchange: function(e) {
    var that = this
    var sta = e.currentTarget.dataset.sta
    if (sta == 1) {
      this.group01(1, 'goods', sta)
    } else if (sta == 2) {
      this.group01(2, 'balance', sta)
    } else if (sta== 3) {
      this.group01(3, 'redpacket', sta)
    } else if (sta == 4) {
      this.group01(4, 'score', sta)
    } else if (sta == 5) {
      this.group01(5, 'coupon',sta)
    }
  },
  // 判断 group 1 0 
  group01: function(num,tp,sta) {
    var that = this
    if (that.data.group == 1) {
      that.postUrl1(num,sta)
    } else {
      that.postUrl0(tp, sta)
    }
  },
  // grounp=1post请求
  postUrl1: function (num, sta) {
    var that = this
    wx.showLoading({
      title: "正在加载中...",
    })
    if(num==5){
     var prame = {
        exchange: num,
        ajax: 1,
        exchange: 5,
        key: that.data.input,
        exchangeGroupId: that.data.groupid
      }
    }
    else{
    var  prame = {
        exchange: num,
        exchange:5,
      ajax: 1,
        key: that.data.input,
        exchangeGroupId: that.data.groupid
      }
    }
    core.get("exchange/group", prame, function(data) {
      wx.hideLoading()
      if (data.status == 1) {
        if(num==1){
          wx.redirectTo({
            url: '/pages/exchange/detail/index?key=' + that.data.input + '&groupid=' + that.data.groupid +  '&group=1',
          })
          that.setData({
            colorddd: 1,
            exchange: "兑换中"
          })
        }
        else {
          core.alert(data.result.message)
          that.setData({
            colorddd: 1,
            exchange: "已兑换"
          })
        }
      } else if (data.status == 0) {
        core.confirm(data.result.message)
        that.setData({
          exchange: "兑换",
          datasta: 1
        })
      }
    })
  },



  // gronp=0post请求
  postUrl0: function (tp, sta) {
    var that = this
    wx.showLoading({
      title: "正在加载中...",
    })
    var trp = "exchange/"+tp
    var trp1 = trp.replace(/\s+/g, '')
      core.get(trp1, {
        all: 1,
        exchange: 1,
        key: that.data.input,
        exchangeGroupId: that.data.groupid
      }, function (data) {
        wx.hideLoading()
       
 
          if (data.status == 1) {
            if (tp == "goods") {
            wx.redirectTo({
              url: '/pages/exchange/detail/index?key=' + that.data.input + '&groupid=' + that.data.groupid + '&sta=' + sta,
            })
            that.setData({
              colorddd: 1,
              exchange: "兑换中"
            })
          }
            else  {
              core.alert(data.result.message)
              that.setData({
                colorddd: 1,
                exchange: "已兑换"
              })
            }
        }
         else if (data.status == 0) {
          core.confirm(data.result.message)
          that.setData({
            colorddd: 0,
            exchange: "兑换",
            datasta: 1
          })
        }
      })
  },
  onShareAppMessage: function () {

  }

})