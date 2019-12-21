var a = getApp(), e = a.requirejs("core"), t = a.requirejs("foxui"), n = a.requirejs("jquery"), s = a.requirejs("wxParse/wxParse"), WxParse = require('../../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: "",
    indicatorDots: false,
    autoplay: true,
    interval:3000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var a = this;
    e.get('groups/goods', {id:options.id}, function(e){
      if (e.result.groupsset.description!=0){
        s.wxParse("wxParseData", "html", e.result.groupsset.groups_description, a, "5")
      }else{
        s.wxParse("wxParseData", "html", e.result.goods.content, a, "5")
      }
      a.setData({
        goods: e.result.goods,
        groupsset: e.result.groupsset,
      })
      
    })
  },

  // 单独购买
  btnSingle: function (event){
    var id = this.data.goods.id;
    e.get('groups/goods/goodsCheck', {'id': id, type: 'single'}, function(res){
      if(res.status==1){
        wx.navigateTo({
          url: '/pages/groups/orders/confirm?type=single&id=' + id 
        })
      }else{
        // FoxUI.toast.show(postjson.result.message)
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