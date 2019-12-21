// pages/board/index.js
var app = getApp();
var core = app.requirejs('core');
var footer = require('footer.js')
Page({
  /**
   * 页面的初始数据
   */
	data: {
		isFooter:'index'
	},
  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function () {
		
		var that = this;
		footer.init(that);
	
		wx.showLoading({
			title: '加载中...',
		})
		core.get("sns",{}, function (res) {
		
			//console.log(res)
			var result = res.result;
			result.recommands.forEach(function(o){
				o.logo =o.logo;
			});
			result.advs.forEach(function (o) {
				o.thumb = o.thumb;
			});
			result.category.forEach(function (o) {
				o.thumb = o.thumb;
			})
			that.setData({
				result: result
			})
			wx.hideLoading();
		})

	},
  /**
   * 生命周期函数--监听页面显示
   */

})