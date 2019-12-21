var a = getApp(), e = a.requirejs("core"), t = a.requirejs("foxui"), n = a.requirejs("jquery");
// pages/groups/goods/fightgroups.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: "",
    teams: "",
    hour:'00',
    minite:'00',
    second:'00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    e.get('groups/goods/fightGroups', { id: options.id }, function (data) {
      let timer;
     let teams = data.result.teams;
      for (let i = 0; i < teams.length ; i++){
        if (teams[i].minite < 10) {
          teams[i].minite = "0" + teams[i].minite;
          that.setData({
            teams: teams,
          })
        } else if (teams[i].hour < 10) {
          teams[i].hour = "0" + teams[i].hour;
          that.setData({
            teams: teams,
          })
        } else if (teams[i].second < 10) {
          teams[i].second = "0" + teams[i].second;
          that.setData({
            teams: teams,
          })
        }
        timer = setInterval(function () {
          teams[i].second = teams[i].second * 1 - 1
          if (teams[i].second == 0) {
            teams[i].second = 60;
            if (teams[i].hour == 0 && teams[i].minite == 0){
              teams[i].minite = 0
            }else{
              teams[i].minite = teams[i].minite * 1 - 1
            }
            if (teams[i].minite < 10){
              teams[i].minite = "0" + teams[i].minite;
              that.setData({
                teams: teams,
              })
            }
            that.setData({
              teams: teams,
            })
            if (teams[i].minite < 0) {
              teams[i].minite = 59;
              if (teams[i].hour != 0 ){
                teams[i].hour = teams[i].hour * 1 - 1
              }
              if (teams[i].hour < 10) {
                teams[i].hour = "0" + teams[i].hour;
                that.setData({
                  teams: teams,
                })
              }
              that.setData({
                teams: teams,
              })
            }
          } else if (teams[i].second<10){
            teams[i].second = "0" + teams[i].second;
            that.setData({
              teams: teams,
            })
          }
      
          that.setData({
            teams: teams,
          })
        }, 1000)
      
      }
       
      that.setData({
        goods: data.result.goods,
        teams: data.result.teams,
      })
    })
  },
  //开团 
  tapopen: function (event) {
    var id = event.currentTarget.dataset.id;
    var teamid = event.currentTarget.dataset.teamid;
    
    e.get('groups/goods/goodsCheck', { id: id }, function (res) {
      if (res.status == 1) {
        //跳转
        wx.navigateTo({
          url: '/pages/groups/orders/confirm?heads=1&type=groups&id=' + id + "&teamid=" + teamid
        })
      } else {
        wx.showToast({
          title: res.result.message,
          icon: 'success',
          duration: 1500
        })
      }
    })
  },
  onShareAppMessage: function () {

  },
  onReady:function(){
 
  }
})