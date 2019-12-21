var t = getApp(), e = t.requirejs("core"), i = t.requirejs("foxui"), a = t.requirejs("jquery");
Page({
  data: {
     logindata:{
       mobile:'',
       password:'',
     }
  },
  onLoad: function (i) {
  
  },
  inputChange(e){
    var _this=this;
    for (var p in _this.data.logindata) { //遍历json对象的每个key/value对,p为key
      if (e.target.dataset.type==p){
        _this.data.logindata[p] = e.detail.value
      }
    }
    console.log(e,_this.data.logindata)

  },
  submit(){
   
    var _this=this;
    if (_this.data.logindata.mobile=='' || _this.data.logindata.password==''){
      wx.showToast({
        title: '请输入手机号和密码',
        icon:'none'
      })
      return;
    }
  }
 

  
})
