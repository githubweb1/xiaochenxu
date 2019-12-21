// pages/groups/refund/index.js
var a = getApp(),e = a.requirejs("core"),s = a.requirejs("wxParse/wxParse");
Page({
  data: {
    array: ['不想要了', '卖家缺货', '拍错了/订单信息错误','其它'],
    array2: ['退款(仅退款不退货)','退货退款', '换货'],
    index:0,
    reason: 0,
    rtype:0,
    tempFilePaths: [],
    refundstate:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var a=this;
    a.setData({
      options: options
    })
    e.get('groups/refund', options,function(res){
      var r=res.result;
      if (res.status == 1) {
        var data1 = {
          order: r.order,
          orderid: r.orderid,
          refundid: r.refundid,
          show_price: r.show_price,
          refund: r.refund,
        }
        if (r.refund.images) {
          data1.tempFilePaths= r.refund.images
        }
        a.setData(data1)
      }else{
        e.confirm(r.message, function () {
          wx.redirectTo({
            url: '/pages/groups/index/index',
          })
        }, function () {
          wx.navigateBack()
        });
      }
    })
  },

  // 退款原因
  bindPickerChange: function (e) {
    this.setData({
      reason: e.detail.value
    })
  },
  bindrtypeChange:function(e){
    this.setData({
      rtype: e.detail.value
    })
  },
  
  // 上传图片
  fileimg:function(){
    var a=this;
    var imgArr = a.data.tempFilePaths;
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        res.tempFilePaths.forEach(function(o){
          imgArr.push(o)
        })
        a.setData({
          tempFilePaths: imgArr
        })
      }
    })
  },
  // 删除图片
  delimg:function(e){
    var index = e.currentTarget.dataset.index;
    var tempFilePaths = this.data.tempFilePaths;
    tempFilePaths.splice(index, 1)
    this.setData({
      tempFilePaths:tempFilePaths
    })
    
  },

  // 提交申请
  formSubmit: function (submitData) {
    var a=this,
    imageList=a.data.tempFilePaths,
    op = a.data.options,
    sb = submitData.detail.value;
    var data = {
      'orderid': op.orderid,
      'teamid': op.teamid,
      'rtype': sb.rtype,
      'reason': sb.reason,
      'price': sb.price,
      'content': sb.content
    }
    var data1 = {}, imgArr = [];//最终上传图片数组
    var arrImg = [];//上传文件数组
    imageList.forEach(function (o) {
     // console.log(o)
      if (o.indexOf('http://tmp/') != -1) {
        arrImg.push(o);
      } else {
        imgArr.push(o);
      }
    })
    if (arrImg.length != 0) {
     
      
      var allData = e.getUrl("util/uploader/upload", { file: "file" }, function (res) {
       
      });
      
      data1.arr = arrImg;
      a.myUploadimg(
        data1,
        function (res) {//成功
          imgArr.push(res.files[0].url)
        },
        function (res) {
          console.log('上传失败');
        },
        function (res) {
          data.images = imgArr;
          e.post("groups/refund/submit", data, function (res) {
            if (res.status == 1) {
              wx.redirectTo({
                url: "/pages/groups/orders/detail?orderid=" + op.orderid + "&teamid=" + op.teamid
              })
            } else {
              e.alert(r.message);
            }
          })
        },
        allData
      )
    } else {
      data.images = imgArr;
      e.post('groups/refund/submit', data, function (res) {
        var r = res.result;
        if (res.status == 1) {
          wx.navigateTo({
            url: "/pages/groups/orders/detail?orderid=" + op.orderid + "&teamid=" + op.teamid
          })
        } else {
          e.alert(r.message);
        }
      })
    }
  },

  //取消申请
  cancel:function(){
    var options = this.data.options;
    e.get('groups/refund/cancel', options, function (res) {
      wx.reLaunch({
        url: '/pages/groups/orders/detail?orderid=' + options.orderid + '&teamid=' + options.teamid,
      })
    })
  },

  back:function(){
    wx:wx.navigateBack({
      delta: 1,
    })
  },

  edit:function(){
    this.setData({
      refundstate:"1"
    })
  },

  //上传图片
  myUploadimg : function (data, _success, _fail, _complete, allData) {
    var self = this,
      success = data.success || 0,//成功次数
      i = data.i || 0,//当前文件下标
      fail = data.fail || 0,//失败次数
      invalid = data.invalid || 0,//图片格式错误
      filePath = data.arr[i];//图片路径数组
    wx.uploadFile({
      url: allData,
      filePath: filePath,
      name: 'file',
      formData: {},
      success: function (res) {

        var d = JSON.parse(res.data);
        //console.log(d)
        var isSuccess;
        i++;
        success++;
        if (i == data.arr.length) {
          isSuccess = true;
        }
        if (typeof _success === "function") _success(d, isSuccess, invalid);
      },
      fail: function (res) {
        //console.log(res);
        var d = JSON.parse(res.data);
        var isSuccess;
        i++;
        fail++;
        //console.log("fail:", fail);
        if (i == data.arr.length) {
          isSuccess = true;
        }

        if (typeof _fail === "function") _fail(d, isSuccess, invalid);
      },
      complete: function (res) {
        //console.log(res)
        var d = JSON.parse(res.data);
        if (d.error == "1") {
          e.alert(res.errMsg);
          return;
        }
        var cb = function () {
          if (i == data.arr.length) {  //当图片传完时，停止调用       
            console.log('执行完毕');
            console.log('成功：' + success + " 失败：" + fail);
            if (typeof _complete === "function") _complete(res);
          } else {
            data.i = i;
            data.success = success;
            data.fail = fail;
            self.myUploadimg(data, _success, _fail, _complete, allData);
          }
        };

        if (/ok/.test(res.errMsg)) {
          var _data = res;
          if (!invalid && _data.status == 1) {
            // 成功且违规图片
            invalid = 1;
            data.invalid = invalid;
          }
        }
        cb();

      }
    })
  }
  ,
  onShareAppMessage: function () {

  }
})