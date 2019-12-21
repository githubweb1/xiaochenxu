// pages/abonus/index/index.js
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
    choose: "申请成为区域代理",
    submit: !1,
    checked: false,
    aagenttype: 0,
    dress:{},
    num:0
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
    let q = this.data.dress
    var pro = "", city1 = "", city2 = "", area1 = "", area2 = "", area3 = ""
    if (q.province){
      pro = q.province[0]
    }
    else if (q.city){
      city1 = q.city[0]
      city2 = q.city[1]
    }
    else if (q.area){
      area1 = q.area[0]
      area2 = q.area[1]
      area3 = q.area[2]
    }
    if (!a.isMobile(o.mobile))
      return void e.alert("请填写正确的手机号");
    if (!o.realname || "" == o.realname)
      return void e.alert("请填写真实姓名");
    if (!o.weixin || "" == o.weixin)
      return void e.alert("请填写微信号");
    if (this.data.checked == false)
      return void e.alert("请阅读协议");
    if (this.data.aagenttype == 0)
      return void e.alert("请选择区域代理");
   
    let parms = {
      realname: o.realname,
      mobile: o.mobile,
      weixin: o.weixin,
      province: pro,
      city: city1 + city2,
      area: area1 + area2 + area3,
      aagenttype: s.data.aagenttype
    }
    e.post("abonus/register", parms, function(data) {
      wx.showLoading({
        title: '正在处理中...',
      })
      if (data.result.check == 1){
        wx.hideLoading();
        e.confirm("恭喜您审核通过！", function() {
          wx.redirectTo({
            url: '/pages/abonus/index/index',
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
    var parms = {

    }
    e.get("abonus/register", parms, function(data) {
      i.setData({
        list: data.result
      })
      c.wxParse("wxParseData", "html", data.result.set.applycontent, i, "5")
    })
  },
// 勾选阅读
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
  // 选择区域
  checkboxChange: function(e) {
    var that = this
    if (e.detail.value == "province") {
      that.setData({
        aagenttype: 1
      })
    } else if (e.detail.value == "city") {
      that.setData({
        aagenttype: 2
      })
    } else if (e.detail.value == "area") {
      that.setData({
        aagenttype: 3
      })
    }
  },
  // 代理省份
  bindRegionChange: function(e) {
    console.log(e)
    var that = this
    var d = that.data.dress,
      z = e.currentTarget.dataset.type,
      q = e.detail.value;
      d[z] = q;
    that.setData({
      dress: d
    })
  },
  // 点击协议
  content: function(e){
    if(this.data.num==1){
      this.setData({
        num:0
      })
    }else{
      this.setData({
        num:1
      })
    }
  },
 
})