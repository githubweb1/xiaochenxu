var t = getApp(), e = t.requirejs("core"), i = t.requirejs("foxui"), a = t.requirejs("jquery");
Page({
  data: {
    member: {},
    binded: !1,
    endtime: 0,
    postData: {},
    submit: !1,
    subtext: "立即注册"
  },
  onLoad: function (i) {
    t.url(i),
      e.loading(),
      this.getInfo()
  },
  getInfo: function () {
    var t,
      i = this;
    e.get("member/bind", {}, function (e) {
      console.log(e);
      if (e.error) {
        wx.showModal({
          title: '提示',
          content: e.message,
          success() {
            wx.switchTab({
              url: "/pages/member/index/index"
            });
          }
        })
      } else {
        var a = {
          member: e.member,
          binded: e.binded,
          endtime: e.endtime,
          // show: !0
        };
        a.postData = {
          mobile: e.member.mobile,
          code: "",
          password: "",
          password1: "",
          recommend:""
        },
          i.setData(a),
          e.endtime > 0 && i.endTime(),
          t = e.binded ? "注册" : "注册",
          wx.setNavigationBarTitle({
            title: t
          })
      }
    }, !0, !0, !0)
  },
  endTime: function () {
    var t = this,
      e = t.data.endtime;
    if (e > 0) {
      t.setData({
        endtime: e - 1
      });
      setTimeout(function () {
        t.endTime()
      }, 1e3)
    }
  },
  inputChange: function (t) {
    var i = this.data.postData,
      s = e.pdata(t).type,
      o = t.detail.value;
    i[s] = a.trim(o),
      this.setData({
        postData: i
      })
  },
  getCode: function (t) {
    var s = this;
    if (!(s.data.endtime > 0)) {
      var o = s.data.postData.mobile;
      if (!a.isMobile(o))
        return void i.toast(s, "请填写正确的手机号");
      e.get("sms/changemobie", {
        mobile: o
      }, function (t) {
        if (0 != t.error)
          return void i.toast(s, t.message);
        i.toast(s, "短信发送成功"),
          s.setData({
            endtime: 60
          }),
          s.endTime()
      }, !0, !0, !0)
    }
  },
  submit: function (t) {
    if (!this.data.submit) {
      var s = this,
        o = this.data.postData;
      if (!a.isMobile(o.mobile))
        return void i.toast(this, "请填写正确的手机号");
      if (5 != o.code.length)
        return void i.toast(this, "请填写5位短信验证码");
      if (!o.password || "" == o.password)
        return void i.toast(this, "请填写登录密码");
      if (!o.password1 || "" == o.password1)
        return void i.toast(this, "请确认登录密码");
      if (o.password != o.password1)
        return void i.toast(this, "两次输入的密码不一致");

      this.setData({
        submit: !0,
        subtext: "正在注册..."
      }),
        e.post("member/bind/submit", o, function (t) {
          return 92001 == t.error || 92002 == t.error ? void e.confirm(t.message, function () {
            o.confirm = 1,
              e.post("member/bind/submit", o, function (t) {
                t.error > 0 ? (i.toast(s, t.message), s.setData({
                  submit: !1,
                  subtext: "立即注册",
                  "postData.confirm": 0
                })) : wx.navigateBack()
              }, !0, !0, !0)
          }) : 0 != t.error ? (i.toast(s, t.message), void s.setData({
            submit: !1,
              subtext: "立即注册"
          })) : void wx.navigateBack()
        }, !0, !0, !0)
    }
  }
})
