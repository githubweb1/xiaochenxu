// pages/globonus/register/index.js
var t = getApp(),
  e = t.requirejs("core"),
  i = t.requirejs("foxui"),
  a = t.requirejs("jquery"),
  c = t.requirejs("wxParse/wxParse")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postData: {},
    choose: "申请成为代理",
    submit: !1,
    checked: false,
    checkhide:false
  },
  inputChange: function(t) {
    var i = this.data.postData,
      s = e.pdata(t).type,
      o = t.detail.value;
    i[s] = a.trim(o),
      this.setData({
        postData: i
      })
  },
  submit: function(t) {
    var s = this,
      o = this.data.postData;
    if (!a.isMobile(o.mobile))
      return void e.alert("请填写正确的手机号");
    if (!o.realname || "" == o.realname)
      return void e.alert("请填写真实姓名");
    if (!o.weixin || "" == o.weixin)
      return void e.alert("请填写微信号");
    if (this.data.checked == false)
      return void e.alert("请阅读协议")
    let parms = {
      realname: o.realname,
      mobile: o.mobile,
      weixin: o.weixin
    }
    e.post("weightbonus/register", parms, function(data) {
      wx.showLoading({
        title: '正在处理中...',
      })
      if (data.result.check == 1){
        wx.hideLoading();
        e.confirm("恭喜您审核通过！", function() {
          wx.redirectTo({
            url: '/pages/weightbonus/index/index',
          })
        });
      }else if (data.result.check == 0) {
        wx.hideLoading();
        e.confirm("您的申请已经提交，请等待审核!", function() {
          wx.switchTab({
            url: '/pages/index/index',
          })
        });
      } else {
        wx.hideLoading();
        e.confirm(data.result.message)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var i = this
  var  parms = {
    
    }
    e.get("weightbonus/register", parms, function(data) {
      i.setData({
        list: data.result
      })
      c.wxParse("wxParseData", "html", data.result.set.applycontent, i, "5")
    })
  },
  checkChange: function(e) {
    if (this.data.checked == true) {
      this.setData({
        checked: "flase"
      });
    } else {
      this.setData({
        checked: true
      });
    }
  },
  checkView:function(){
    var that = this;
    that.setData({
      checkhide: true
    })
  },
  clickimg:function(){
    var that = this;
    that.setData({
      checkhide: false
    })
  },
  onShareAppMessage: function () {

  }
})