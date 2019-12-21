// pages/chat/chat.js
const app = getApp()
var websocket = require('../../utils/websocket.js');
var utils = require('../../utils/util.js');
 var t = app.requirejs("core")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    newslist: [],
    userInfo: {},
    scrollTop: 0,
    increase: false,//图片添加区域隐藏
    aniStyle: true,//动画效果
    message: "",
    previewImgList: [],
    merchobj:{},
    merchlist:[],
    openids:'',
    hy_id:'',
    addicon:"+",
    istrue:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.name,
    })
    var that = this
    that.setData({
      hy_id: options.id
    })
    that.login()
    wx.getStorage({
      key: 'userinfowx80ca999f4cfee399',
      success(res) {
        that.setData({
          openids:'sns_wa_'+res.data.value.openId
        })
       
      }
    })
    setTimeout(()=>{
      t.get('merch/list/lt',
      {
        mid: that.data.openids,
        s_id: options.id,
        },
      function(res){
       console.log(res)
       if(res.status==1){
          that.setData({
            newslist:res.result.xinxi,
            merchobj: res.result.xinxi[0].shangjia,
          })
         that.bottom();
       }else{
         wx.showToast({
           title:res.result.message,
           icon: 'none',
           duration: 2000
         })
       }
       
    })
    },500)
    //调通接口
    websocket.connect(this.data.userInfo, function (res) {
      console.log(JSON.parse(res.data))
      var mechdata = JSON.parse(res.data);
      if (mechdata.type=='say'){
         that.data.merchlist.push(mechdata);
        that.setData({
          merchlist: that.data.merchlist
        })
        that.bottom()
      }
    });

   
  },
  // 页面卸载
  onUnload() {
    wx.closeSocket();
    // wx.showToast({
    //   title: '连接已断开~',
    //   icon: "none",
    //   duration: 2000
    // })
  },
  //事件处理函数
  send: function () {
    var flag = this
    if (this.data.message == "") {
      wx.showToast({
        title: '消息不能为空哦~',
        icon: "none",
        duration: 2000
      })
    } else {
      setTimeout(function () {
        flag.setData({
          increase: false
        })
      }, 500)

      //传数据到后台
      t.post('merch/list/xinxi',
      {
        s_id: flag.data.hy_id,
        mid: flag.data.openids,
        images:'',
        text:flag.data.message,
        text_type:'1'
      },
      function(res){
        if(res.status=='0'){
         
        }else{
          websocket.send('{ "text": "' + flag.data.message + '", "text_type": "' + "1" + '","type":"say", "images": "'+"" + '", "id": "' + flag.data.openids + '", "hy_id": "' + flag.data.hy_id + '" }')
          // flag.bottom()
        }
        
      })
      
    }
  },
  //监听input值的改变
  bindChange(res) {
    // console.log(res)
    this.setData({
      message: res.detail.value
    })
  },
  cleanInput() {
    //button会自动清空，所以不能再次清空而是应该给他设置目前的input值
    this.setData({
      message: this.data.message
    })
  },
  increase() {

    this.setData({
      increase: true,
      aniStyle: true,
      addicon:"-"
    })
  },
  //点击空白隐藏message下选框
  outbtn() {
    this.setData({
      increase: false,
      aniStyle: true
    })
  },
  chooseImage(d) {
    var that = this
    t.upload(function (d) {
       console.log(d)
       t.post('merch/list/xinxi',
      {
        s_id: that.data.hy_id,
        mid: that.data.openids,
        images:d.filename,
        text:'',
        text_type:'2'
      },function(res){
         console.log(res)
         if(res.status==1){
 websocket.send('{ "images": "' +res.result.ars.images + '", "text_type": "' + "2" + '","type":"say", "text": "' + " " + '", "id": "' + that.data.openids + '", "hy_id": "' + that.data.hy_id + '" }')
         }
      })
      
        that.setData({
          increase: false
        })
        // that.bottom()
    })
   
  },
  //图片预览
  previewImg(e) {
    var that = this
    //必须给对应的wxml的image标签设置data-set=“图片路径”，否则接收不到
    var res = e.target.dataset.src
    var list = this.data.previewImgList //页面的图片集合数组

    //判断res在数组中是否存在，不存在则push到数组中, -1表示res不存在
    if (list.indexOf(res) == -1) {
      this.data.previewImgList.push(res)
    }
    wx.previewImage({
      current: res, // 当前显示图片的http链接
      urls: that.data.previewImgList // 需要预览的图片http链接列表
    })

  },
  //聊天消息始终显示最底端
  bottom: function () {
    var query = wx.createSelectorQuery()
    query.select('#flag').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res)
      wx.pageScrollTo({
        scrollTop: res[0].bottom + res[1].scrollTop,  // #the-id节点的下边界坐标      
        duration:0
      })

    })
  },
//是否授权
  login(){
    // 获取用户信息
    var that = this;
    wx.getSetting({
        
      success: res => {

        //判断是否授权，如果授权成功

        if (res.authSetting['scope.userInfo']) {

          //获取用户信息

          wx.getUserInfo({

            success: res => {

              console.log(res);
              that.setData({
                userInfo: res.userInfo
              })
             

            }

          })
        } 

      }

    })

  },

  inputfocus(){
    var _this=this;
    _this.bottom();
    _this.setData({
      increase:false
    })
  }
  
})