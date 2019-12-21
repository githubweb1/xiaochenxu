// pages/board/aboutBoard/aboutBoard.js
var app = getApp();
var core = app.requirejs('core');
var footer = require('../index/footer.js');
var VM = {
	data: {
		
	}
};

//加载数据
VM.getList = function () {
	//console.log('开始分页加载');
	var that = this, page = that.data.page;

	wx.showLoading({
		title: '加载中...',
	})
	var data = {  id: that.data.id };
	core.get("sns/board/relate", data, function (res) {

		//console.log(res)
		if (res.status == 1) {
				that.setData({
					list: res.result.list
				})
		}else{
			wx.showModal({
				title: '提示',
				content: '页面加载失败',
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/sns/index/index',
            })
          } else if (res.cancel) {
            wx.navigateBack()
          }
        }
			})
		}
		wx.hideLoading();
	})
};
//获取用户信息
VM.onLoad = function (query) {
	var that = this;

	footer.init(that);
	if (query.id) {
		that.setData({
			id: query.id
		});
		that.getList()

	} else {
		wx.showModal({
			title: '提示',
			content: '页面参数错误',
		})
	}


};
VM.onReachBottom = function () {
	var that = this;
	
};


Page(VM);