// pages/exchange/detail/index.js
var app = getApp();
var core = app.requirejs('core');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    allnum: 0, //已选数量
    allmeney: 0.00, //已选商品的所有金额
    close: 0, //查看已选
    choose: 0, //选择
    id: 0, //不可选规格商品的id
    money: 0, //商品金额
    numarray: {}, //所有已选商品都存入改数组
    moneyarray: [],
    group: 0, //判断兑换类型
    pay: 0, //判断显示可选规格
    link: [], //如果选择了可选规格的商品则存入改数组
    alltypeid: [], //如果选择了可选规格商品的规格则把该规格的id存入改数组
    alloptionid: [] //传递选择规格商品的参数
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.group == 1) {
      this.setData({
        group: 1
      })
    }
    this.getinfo(options.key, options.groupid, options.sta)
    this.setData({
      key: options.key
    })
  },
  // 请求接口
  getinfo: function(opkey, groupid, sta) {
    var that = this
    if (sta == 1) {
      that.post('goods', opkey, groupid)
    } else if (sta == 2) {
      that.post('balance', opkey, groupid)
    } else if (sta == 3) {
      that.post('redpacket', opkey, groupid)
    } else if (sta == 4) {
      that.post('score', opkey, groupid)
    } else if (sta == 5) {
      that.post('coupon', opkey, groupid)
    } else if (that.data.group == 1) {
      wx.showLoading({
        title: "正在加载中...",
      })
      core.get("exchange/group", {
        exchange: 5,
        key: opkey,
        exchangeGroupId: groupid
      }, function(data) {
        wx.hideLoading()
        if (data.status == 1) {
          that.setData({
            list: data.result,
            oldmax: data.result.groupResult.max,
            max: data.result.groupResult.max
          })
        } else if (data.status == 0) {
          core.confirm(data.result.message)
        }
      })
    }
  },
  post: function(tp, opkey, groupid) {
    var that = this
    wx.showLoading({
      title: "正在加载中...",
    })
    var trp = "exchange/" + tp
    var trp1 = trp.replace(/\s+/g, '')
    var prams
    if (tp == 'goods') {
      prams = {
        all: 1,
        key: opkey,
        exchangeGroupId: groupid
      }
    } else {
      prams = {
        all: 1,
        exchange: 1,
        key: opkey,
        exchangeGroupId: groupid
      }
    }
    core.get(trp1, prams, function(data) {
      wx.hideLoading()
      if (data.status == 1) {
        that.setData({
          list: data.result,
          oldmax: data.result.groupResult.max,
          max: data.result.groupResult.max
        })
      } else if (data.status == 0) {
        core.confirm(data.result.message)
      }
    })
  },

  //点击选择规格、
  chooseother: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      idshop = e.currentTarget.dataset.id, // 可选规格，各规格商品的id
      pay = e.currentTarget.dataset.pay,
      optioncur = e.currentTarget.dataset.option,
      yx = e.currentTarget.dataset.optionallcid,
      arr = that.data.list,
      alltypeid = that.data.alltypeid;
    if (!alltypeid[idshop]) {
      alltypeid[idshop] = []
    }
    that.setData({
      pay: pay,
      index: index,
      idshop: idshop,
      alltypeid: alltypeid
    })
    var link = that.data.link
    if (arr.optionList[index].is_select == false) {
      core.get("exchange/modal", {
        goods: idshop,
        option: optioncur,
        yx: yx
      }, function(data) {
        link[idshop] = data.result
        that.setData({
          link: link
        })
      })
    }
  },
  // 确认规格数量
  chooseOption: function(e) {
    var that = this

    that.setData({
      pay: e.currentTarget.dataset.pay
    })
    var arr = that.data.list,
      index = that.data.index,
      idshop = that.data.idshop,
      numarray = that.data.numarray,
      alloptionid = that.data.alloptionid
    // 点击已选
    if (arr.optionList[index].is_select == true) {
      // 判断选择
      if (that.data.alltypeid[idshop].length == 0) {

        arr.optionList[index].is_select = false;
      }
    }
    // 点击选择
    else {
      // 判断选择
      if (that.data.alltypeid[idshop].length != 0) {
        arr.optionList[index].is_select = true;
      }
    }
    var allopid = ""
    for (let i in numarray) {
      if (idshop == numarray[i].idshop) {
        allopid = allopid + "_" + numarray[i].opid
      }
    }
    alloptionid.push(allopid)
    console.log(alloptionid)
    that.setData({
      list: arr,
      alloptionid: alloptionid
    })
  },
  // 点击选择规格颜色
  chooseselect: function(e) {

    var that = this
    var id = e.currentTarget.dataset.id // 商品id
      ,
      moneyshop = e.currentTarget.dataset.money // 商品金额
      ,
      index = e.currentTarget.dataset.index,
      arr = that.data.list,
      max = that.data.max, // 还可以再选数量
      idshop = that.data.idshop,
      numarray = that.data.numarray, // 所选择商品的数量还有价格
      link = that.data.link, //储存不同的可选规格商品的信息
      alltypeid = that.data.alltypeid, //储存所有的规格商品id判断是否选择了规格
      allmeney = that.data.allmeney;
    if (e.currentTarget.dataset.cid) { //接口传参
      var cid = e.currentTarget.dataset.cid
      var allcid = allcid + cid
      that.setData({
        allcid: allcid
      })
    }

    // 点击已选
    if (link[idshop].option[index].is_select == true) {

      // if (max < that.data.oldmax) {
      //   max = (arr.groupResult.max * 1) + 1
      // }
      var numshop = 0
      // 判断选择
      link[idshop].option[index].is_select = false;
      alltypeid[idshop] = alltypeid[idshop].splice(id, 1)
      // 判断数量
      let allnum = this.data.allnum
      allnum = (allnum * 1) - ((that.data.numarray[id].num) * 1)
      // 获取最贵的商品

      delete numarray[id]
      var maxmoney = 0,
        allmaxmoney = 0;
      var lenght = that.countProperties(numarray)
      if (arr.groupResult.max >= lenght) {
        allmeney = 0.00
        that.setData({
          allmeney: allmeney
        })
      } else {
        for (let i in numarray) {
          that.data.moneyarray.push(numarray[i].money)
          allmaxmoney = allmaxmoney * 1 + numarray[i].money * 1
        }
        var maxmoneyarr = that.maxarr(that.data.moneyarray, arr.groupResult.max)
        for (let i = 0; i < maxmoneyarr.length; i++) {
          maxmoney = maxmoney * 1 + maxmoneyarr[i] * 1
        }
        console.log(maxmoneyarr)
        allmeney = allmaxmoney * 1 - maxmoney * 1

      }
      that.setData({
        allnum: allnum,
        allmeney: allmeney,
        numarray: numarray
      })
      // var goods = []
      // 还可以再选的数量
      // for (let i in numarray) {
      //   for (let a = 0; a < numarray[i].num; a++) {
      //     goods.push(numarray[i].id)
      //   }
      // }
      // if (goods.length < arr.groupResult.max) {
      //   max = that.data.max * 1 + 1
      // }
    }
    // 点击选择
    else {
      // 判断选择
      link[idshop].option[index].is_select = true;
      // 再选数量
      alltypeid[idshop].push(id)

      // if (max > 0) {
      //   max = (arr.groupResult.max * 1) - 1
      // }
      // 根据id 把商品的数量金额还有id储存在numarray中
      numarray[id] = {
        num: 1,
        money: moneyshop,
        opid: that.data.link[idshop].option[index].id,
        idshop: that.data.idshop
      }
      let allnum = that.data.allnum
      allnum = (allnum * 1) + ((numarray[id].num) * 1)
      // 获取最贵的商品
      var maxmoney = 0,
        allmaxmoney = 0
      var lenght = that.countProperties(numarray)
      if (arr.groupResult.max >= lenght) {
        that.setData({
          allmeney: 0.00
        })
      } else {
        for (let i in numarray) {
          that.data.moneyarray.push(numarray[i].money)
          allmaxmoney = allmaxmoney * 1 + numarray[i].money * 1
        }
        var maxmoneyarr = that.maxarr(that.data.moneyarray, arr.groupResult.max)
        for (let i = 0; i < maxmoneyarr.length; i++) {
          maxmoney = maxmoney * 1 + maxmoneyarr[i] * 1
        }
        allmeney = allmaxmoney * 1 - maxmoney * 1

      }
      that.setData({
        allnum: allnum,
        allmeney: allmeney,
        numarray: numarray
      })
    }
    that.setData({
      id: id,
      money: moneyshop,
      list: arr,
      max: max,
      numarray: numarray,
      link: link,
      alltypeid: alltypeid
    })
  },
  // 点击选择
  choose: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id, // 商品id
      moneyshop = e.currentTarget.dataset.money, // 商品金额
      index = e.currentTarget.dataset.index,
      arr = that.data.list,
      max = that.data.max, // 还可以再选数量
      numarray = that.data.numarray, // 选择商品的数量还有价格
      allmeney = that.data.allmeney
    // 点击已选
    if (arr.goodsList[index].is_select == true) {
      var numshop = 0
      // 判断选择
      arr.goodsList[index].is_select = false;
      // 判断数量
      let allnum = this.data.allnum
      allnum = (allnum * 1) - ((that.data.numarray[id].num) * 1)
      // 获取最贵的商品
      delete numarray[id]
      var maxmoney = 0,
        allmaxmoney = 0
      var lenght = that.countProperties(numarray)

      if (arr.groupResult.max >= lenght) {
        that.setData({
          allmeney: 0.00
        })
      } else {
        for (let i in numarray) {
          that.data.moneyarray.push(numarray[i].money)
          allmaxmoney = allmaxmoney * 1 + numarray[i].money * 1
        }
        var maxmoneyarr = that.maxarr(that.data.moneyarray, arr.groupResult.max)
        for (let i = 0; i < maxmoneyarr.length; i++) {
          maxmoney = maxmoney * 1 + maxmoneyarr[i] * 1
        }
        allmeney = allmaxmoney * 1 - maxmoney * 1

      }
      that.setData({
        allnum: allnum,
        allmeney: allmeney,
        numarray: numarray
      })
      // var goods = []
      // 还可以再选数量
      // for (let i in numarray) {
      //   for (let a = 0; a < numarray[i].num; a++) {
      //     goods.push(numarray[i].id)
      //   }
      // }
      //遍历数组把数组id放入goods中  如果goods长度<最大可选 可选+1
      // if (goods.length < arr.groupResult.max) {
      //   max = that.data.max * 1 + 1
      // }
    }
    // 点击选择
    else {
      // 判断选择
      arr.goodsList[index].is_select = true;
      // 再选数量
      // if (max > 0) {
      //   max = (arr.groupResult.max * 1) - 1
      // }
      // 判断所选数量
      numarray[id] = {
        num: 1,
        money: moneyshop,
        id: that.data.list.goodsList[index].id,
        goodsid: 　that.data.list.goodsList[index].id
      }
      let allnum = that.data.allnum
      allnum = (allnum * 1) + ((numarray[id].num) * 1)
      // 获取最贵的商品
      var maxmoney = 0,
        allmaxmoney = 0,
        lenght = that.countProperties(numarray);
      if (arr.groupResult.max >= lenght) {
        that.setData({
          allmeney: 0.00
        })
      } else {
        for (let i in numarray) {
          that.data.moneyarray.push(numarray[i].money)
          allmaxmoney = allmaxmoney * 1 + numarray[i].money * 1
        }
        var maxmoneyarr = that.maxarr(that.data.moneyarray, arr.groupResult.max)
        for (let i = 0; i < maxmoneyarr.length; i++) {
          maxmoney = maxmoney * 1 + maxmoneyarr[i] * 1
        }
        console.log(maxmoneyarr)
        allmeney = allmaxmoney * 1 - maxmoney * 1

      }
      that.setData({
        allnum: allnum,
        allmeney: allmeney,
        numarray: numarray
      })
    }
    that.setData({
      id: id,
      money: moneyshop,
      list: arr,
      max: max,
      numarray: numarray,
    })
  },
  // 点击已选/关闭
  chooseok: function(e) {
    this.setData({
      close: e.currentTarget.dataset.close
    })
  },
  // 点击+
  // jia: function(e) {
  //   var that = this,
  //     index = e.currentTarget.dataset.index,
  //     numarray = that.data.numarray,
  //     allmeney = that.data.allmeney,
  //     allnum = that.data.allnum,
  //     id = e.currentTarget.dataset.id,
  //     arr = that.data.list,
  //     moneyshop = e.currentTarget.dataset.money, // 商品金额
  //     max = that.data.max;
  //   if (e.currentTarget.dataset.goodsid) {
  //     numarray[id] = {
  //       num: 1,
  //       money: moneyshop,
  //       id: that.data.list.goodsList[index].id,
  //       goodsid: that.data.list.goodsList[index].id
  //     }
  //     allnum = (allnum * 1) + ((numarray[id].num) * 1)
  //     // 获取最贵的商品
  //     var maxmoney = 0,
  //       allmaxmoney = 0,
  //       lenght = that.countProperties(numarray);
  //     if (arr.groupResult.max >= lenght) {
  //       that.setData({
  //         allmeney: 0.00
  //       })

  //     } else {
  //       for (let i in numarray) {
  //         that.data.moneyarray.push(numarray[i].money)
  //         allmaxmoney = allmaxmoney * 1 + numarray[i].money * 1
  //       }
  //       var maxmoneyarr = that.maxarr(that.data.moneyarray, arr.groupResult.max)
  //       for (let i = 0; i < maxmoneyarr.length; i++) {
  //         maxmoney = maxmoney * 1 + maxmoneyarr[i] * 1
  //       }
  //       console.log(maxmoneyarr)
  //       allmeney = allmaxmoney * 1 - maxmoney * 1

  //     }
  //   } else if (e.currentTarget.dataset.opid) {
  //     let idshop = that.data.idshop
  //     numarray[id] = {
  //       num: 1,
  //       money: moneyshop,
  //       opid: e.currentTarget.dataset.opid,
  //       idshop: idshop
  //     }
  //     let allnum = that.data.allnum
  //     allnum = (allnum * 1) + ((numarray[id].num) * 1)
  //     // 获取最贵的商品
  //     var maxmoney = 0,
  //       allmaxmoney = 0
  //     var lenght = that.countProperties(numarray)
  //     if (arr.groupResult.max >= lenght) {
  //       that.setData({
  //         allmeney: 0.00
  //       })
  //     } else {
  //       for (let i in numarray) {
  //         that.data.moneyarray.push(numarray[i].money)
  //         allmaxmoney = allmaxmoney * 1 + numarray[i].money * 1
  //       }
  //       var maxmoneyarr = that.maxarr(that.data.moneyarray, arr.groupResult.max)
  //       for (let i = 0; i < maxmoneyarr.length; i++) {
  //         maxmoney = maxmoney * 1 + maxmoneyarr[i] * 1
  //       }
  //       console.log(maxmoneyarr)
  //       allmeney = allmaxmoney * 1 - maxmoney * 1

  //     }
  //   }
  //   console.log(numarray)
  //   that.setData({
  //     numarray: numarray,
  //     allmeney: allmeney,
  //     allnum: allnum
  //   })
  // },
  // // 点击-
  // jian: function(e) {
  //   var that = this,
  //     index = e.currentTarget.dataset.index,
  //     numarray = that.data.numarray,
  //     allmeney = that.data.allmeney,
  //     allnum = that.data.allnum,
  //     arr = that.data.list,
  //     id = e.currentTarget.dataset.id,
  //     moneyshop = e.currentTarget.dataset.money, // 商品金额
  //     max = that.data.max;
  //   if (numarray[id].num==1){
  //     return
  //   }
  //   if (e.currentTarget.dataset.goodsid) {
  //     let allnum = this.data.allnum
  //     allnum = (allnum * 1) - ((that.data.numarray[id].num) * 1)
  //     // 获取最贵的商品
  //     delete numarray[id]
  //     var maxmoney = 0,
  //       allmaxmoney = 0
  //     var lenght = that.countProperties(numarray)

  //     if (arr.groupResult.max >= lenght) {
  //       that.setData({
  //         allmeney: 0.00
  //       })
  //     } else {
  //       for (let i in numarray) {
  //         that.data.moneyarray.push(numarray[i].money)
  //         allmaxmoney = allmaxmoney * 1 + numarray[i].money * 1
  //       }
  //       var maxmoneyarr = that.maxarr(that.data.moneyarray, arr.groupResult.max)
  //       for (let i = 0; i < maxmoneyarr.length; i++) {
  //         maxmoney = maxmoney * 1 + maxmoneyarr[i] * 1
  //       }
  //       allmeney = allmaxmoney * 1 - maxmoney * 1

  //     }
  //   } else if (e.currentTarget.dataset.opid) {
  //     let allnum = this.data.allnum
  //     allnum = (allnum * 1) - ((that.data.numarray[id].num) * 1)
  //     // 获取最贵的商品

  //     delete numarray[id]
  //     var maxmoney = 0,
  //       allmaxmoney = 0;
  //     var lenght = that.countProperties(numarray)
  //     if (arr.groupResult.max >= lenght) {
  //       allmeney = 0.00
  //       that.setData({
  //         allmeney: allmeney
  //       })
  //     } else {
  //       for (let i in numarray) {
  //         that.data.moneyarray.push(numarray[i].money)
  //         allmaxmoney = allmaxmoney * 1 + numarray[i].money * 1
  //       }
  //       var maxmoneyarr = that.maxarr(that.data.moneyarray, arr.groupResult.max)
  //       for (let i = 0; i < maxmoneyarr.length; i++) {
  //         maxmoney = maxmoney * 1 + maxmoneyarr[i] * 1
  //       }
  //       allmeney = allmaxmoney * 1 - maxmoney * 1
  //     }
  //   }
  //   that.setData({
  //     numarray: numarray,
  //     allmeney: allmeney,
  //     allnum: allnum
  //   })
  // },
  // 立即兑换
  exchange: function(e) {
    var that = this,
      numarray = that.data.numarray,
      goods = [],
      option = that.data.alloptionid
    console.log(option)
    for (let i in numarray) {
      for (let a = 0; a < numarray[i].num; a++) {
        goods.push(numarray[i].id)
      }
    }
    if (!numarray) {
      core.alert("请选择商品")
    } else if ((goods.length == 1 && option.length == 0) || (goods.length == 0 && option.length == 1)) {
      core.confirm("确定要兑换所选商品吗?", function() {
        core.post("exchange/calculate", {
          total: 1,
          value: 0,
          goods: goods,
          option: option,
          key: that.data.key
        }, function(data) {
          wx.navigateTo({
            url: '/pages/order/create/index?exchange=1&exchangeprice=' + data.result.exchangeprice + "&totalex=1" + "&exchangepostage=" + data.result.exchangepostage,
          })
        })
      })
    } else {
      core.confirm("确定要兑换并花费" + that.data.allmeney + "购买所选商品吗?", function() {
        core.post("exchange/calculate", {
          total: goods.length,
          value: 0,
          goods: goods,
          key: that.data.key,
          option: option
        }, function(data) {
          wx.navigateTo({
            url: '/pages/order/create/index?exchange=1&exchangeprice=' + data.result.exchangeprice + "&totalex=2" + "&exchangepostage=" + data.result.exchangepostage,
          })
        })
      })
    }
  },
  // 计算对象长度
  countProperties: function(obj) {
    var count = 0;
    for (var property in obj) {
      count++;
    }
    return count;
  },
  // 保留两位小数
  toDecimal2: function(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  },
  maxarr: function(arr, len) {
    var max = [];
    arr.sort(function(a, b) {
      return a - b;
    });
    for (var i = 0; i < len; i++) {
      max.push(arr.pop());
    }
    return max.reverse();
  },
  onShareAppMessage: function() {}
})