// pages/creditshop/comment/index.js
var app = getApp();
var core = app.requirejs('core');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    key: 0,
    imagesUrl: "/static/images/icon/favor.png",
    allimagesUrl: "/static/images/icon-red/favor_fill.png",
    imageList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getinfo(options)
  },

  getinfo: function(options) {
    var that = this
    core.get("creditshop/comment", options, function(data) {
      if (data.status == 0) {
        core.confirm(data.result.message)
      }

      if (data.result.log.iscomment > 0) {
        wx.setNavigationBarTitle({
          title: '追加评论',
        })
      }
      that.setData({
        list: data.result
      })
    })
  },
  // 点击星星
  clickStar: function(res) {
    var that = this;
    that.setData({
      key: res.currentTarget.dataset.imgnum
    })
  },
  // 点击删除
  delete: function(res) {
    this.setData({
      key: 0
    })
  },
  // 输入评论
  comment: function(res) {
    this.setData({
      comment: res.detail.value
    })
  },
  // 提交评论
  postComment: function(res) {
    var that = this
    var comments = {};
    console.log(comments);
    if (that.data.list.log.iscomment == 0) {
      if (that.data.key == 0) {
        wx.showLoading({
          title: '打个分吧?',
        })
        setTimeout(function (e) {
          wx.hideLoading()
        }, 1000)
        return
      } else {
        comments.level = that.data.key;
      }
    }
    if (that.data.comment == "" || that.data.comment == undefined || that.data.comment == {}) {
      wx.showLoading({
        title: '说点东西吧?',
      })
      setTimeout(function (e) {
        wx.hideLoading()
      }, 1000)
      return
    } else {
      comments.content = that.data.comment;
    }
    

    comments.goodsid = that.data.list.log.goodsid;

    if (that.data.imageList.length != 0) {
      comments.images = that.data.imageList
    }
    core.post("creditshop/comment/submit", {
      logid: that.data.list.log.id,
      comments: comments
    }, function(data) {
      if (data.result.status == 0) {
        core.confirm(data.result.message)
      } else {
        wx.redirectTo({
          url: '/pages/creditshop/log/index',
        })
      }
    })
  },
  //添加图片
  addImg: function(e) {
    var self = this;
    var imageList = self.data.imageList;
    if (imageList.length == 3) {
      wx.showModal({
        title: '提示',
        content: '图片不能超过3张',
      })
      return;
    }
    wx.chooseImage({
      count: 3,
      success: function(res) {
        var length = res.tempFilePaths.length + imageList.length;
        if (length > 3) {
          wx.showModal({
            title: '提示',
            content: '图片不能超过3张',
          })
          return;
        }
        res.tempFilePaths.forEach(function(o) {
          imageList.push(o)
        })

        self.setData({
          imageList: imageList
        })
      },
      fail: function() {

      }
    })
  },
  //删除图片
  myDel: function(e) {
    var self = this,
      index = e.currentTarget.dataset['key'],
      imageList = self.data.imageList;
    imageList.splice(index, 1);
    self.setData({
      imageList: imageList
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})