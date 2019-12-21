var a = getApp(), e = a.requirejs("core"), t = a.requirejs("foxui"), n = a.requirejs("jquery"), d = a.requirejs("biz/diyform"); var QQMapWX = a.requirejs('qqmap-wx-jssdk');
// 实例化API核心类
var demo = new QQMapWX({
  key: 'IR5BZ-6SXLW-EXNRU-OAD64-6PL7H-35F6L' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: "",
    is_team: "",
    heads: "",
    set: "",
    price: "",
    number_format_arr: "",
    isverify: "",
    address: "",
    diyshow: {},
    show: true,
    hidden:0,
    isdeduct:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    }),
      a.url(e)
    this.getList()
  },
  
  onShow: function (e) {
  },

  // 提交订单
  formSubmit: function (submitData) {
    var t = this.data, 
    op = this.data.options,
    sb = submitData.detail.value;
    var data = {
      'id': op.id,
      'type': op.type,
      'heads': op.heads,
      'aid': sb.aid,
      'realname': sb.realname,
      'mobile': sb.mobile,
      'message': sb.message,
      'weight': sb.weight,
      'token': sb.token,
      'creditmoney': t.number_format_arr.deductprice,
      'credit': t.credit.credit,
      "isdeduct": t.isdeduct
    }
    e.post('groups/orders/confirm', data, function (res) {
      var r = res.result;
      if (res.status == 1) {
        if (t.options.type == "groups"){
          wx.redirectTo({
            url: "/pages/groups/pay/index?orderid=" + r.orderid + "&teamid=" + r.teamid + "&type=groups"
          })
        }
        else{
          wx.redirectTo({
            url: "/pages/groups/pay/index?orderid=" + r.orderid + "&teamid=" + r.teamid
          })
        }
      } else {
        e.alert(r.message);
      }

    })
  },

  formReset: function () {
    console.log('form发生了reset事件')
  },
// 点击门店
  clickStore:function(query){
    if(this.data.hidden==0){
      this.setData({
        hidden: query.currentTarget.dataset.hidden
      })
    }else{
      this.setData({
        hidden: 0
      })
    }
      
  },
  // 经纬度

  addre: function (mlat, mlng, slat, slng) {
    // 调用接口
    var that = this
    demo.calculateDistance({
      to: [{
        latitude: mlat,
        longitude: mlng
      }, {
        latitude: slat,
        longitude: slng
      }],
      success: function (res) {
        that.setData({
          distance: (res.result.elements[1].distance) / 1000
        })
      },
      fail: function (res) {
      },
      complete: function (res) {
      }
    })
  },
  // 积分抵扣
  switch1Change: function (res) {
    console.log(res)
    var that = this
    var number_format_arr = that.data.number_format_arr
    if (res.detail.value) {
      number_format_arr.preferential = (number_format_arr.preferential) * 1 - (number_format_arr.deductprice)*1
      that.setData({
        number_format_arr: number_format_arr,
        isdeduct:1
      })
    }
    else{
      number_format_arr.preferential = (number_format_arr.preferential) * 1 + (number_format_arr.deductprice) * 1
      that.setData({
        number_format_arr: number_format_arr,
        isdeduct:0
      })
    }
  },

  getList: function () {
    var a = this;
    e.get('groups/orders/confirm', a.data.options, function (res) {
     
      // 用户经纬度
      if(res.result.stores){
        wx.getLocation({
          success: function (data) {
            var latitude = data.latitude;
            var longitude = data.longitude
            if (res.result.stores.length != 0) {
              a.addre(latitude, longitude, res.result.stores[0].lat, res.result.stores[0].lng);
            }
          },
        })
      }
      if (res.status == 1) {
        if (res.result.goods.deduct > 0 && res.result.creditdeduct.creditdeduct > 0 && res.result.credit1 > 0 && res.result.credit.credit > 0 && res.result.price > 0){
          res.result.number_format_arr.preferential = (res.result.number_format_arr.preferential) * 1 - (res.result.number_format_arr.deductprice)*1
        }
        else {
          res.result.number_format_arr.preferential = res.result.number_format_arr.preferential
        }
        a.setData({
          goods: res.result.goods,
          is_team: res.result.is_team,
          heads: res.result.heads,
          set: res.result.set,
          price: res.result.price,
          number_format_arr: res.result.number_format_arr,
          isverify: res.result.isverify,
          stores: res.result.stores,
          credit: res.result.credit,
          credit1: res.result.credit1,
          creditdeduct: res.result.creditdeduct,
          mobile: res.result.mobile,
          realname: res.result.realname,
        })
      } else {
        e.confirm(res.result.message, function () {
          wx.redirectTo({
            url: '/pages/groups/orders/index',
          })
        }, function () {
          wx.navigateBack()
        });
      }
    })
    //address
    e.get('groups/address/selector', {}, function (reslist) {
      if (reslist.result.list.length > 0) {
        for (var index in reslist.result.list) {
          if (reslist.result.list[index].isdefault > 0) {
            a.setData({
              address: reslist.result.list[index]
            })
          }
        }
      }


    })
  },


  diyshow: function (t) {
    var i = this.data.diyshow,
      a = e.data(t).id;
    i[a] = !i[a],
      this.setData({
        diyshow: i
      })
  },
  onShareAppMessage: function () {

  }
})