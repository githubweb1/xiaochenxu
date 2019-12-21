// pages/board/myHome/more.js

var app = getApp();
var core = app.requirejs('core');
var footer = require('../index/footer.js');
var template = require('../template/detailList.js');
var WxParse = app.requirejs("wxParse/wxParse");
var VM = {
	data: {
		isMore:1,
		page: 1,//第几页
		end: false,//是否加载中
		noend: true,//是否最后一页 true非最后一页
	}
};

//加载数据
VM.getList = function () {
	//console.log('开始分页加载');
	var that = this, page = that.data.page, myEnd = that.data.end;
	if (myEnd || !that.data.noend) { return };//判断是否在加载中或者已经到最后一个
	that.setData({
		end: true
	});

	wx.showLoading({
		title: '加载中...',
	})
	var data = { page: page, id: that.data.id};
	core.get("sns/user/get_posts", data, function (res) {

		console.log(res)
		if (res.status == 1) {

			var list = that.data.list || [];
			var arr = that.data.arr || [];
			res.result.list.forEach(function (o) {
				//console.log(o.content)
				o.isOpen = 1;
				arr.push(o.content_new);
				//wxP.wxParseTemArray("wxParseData", "html", res.result.list.length, that, "5")
				list.push(o);
			})

			for (let i = 0; i < arr.length; i++) {
				WxParse.wxParse('reply' + i, 'html', arr[i], that);
				if (i === arr.length - 1) {
					WxParse.wxParseTemArray("replyTemArray", 'reply', arr.length, that)
				}
			}
			page++;

			if (res.result.pages < page) {
				that.setData({
					list: list,
					noend: false,
					page: page,
					end: false,
					arr: arr
				});
			} else {
				that.setData({
					list: list,
					arr: arr,
					page: page,
					end: false
				});
			}
		}


		wx.hideLoading();
	})
};
//获取用户信息
VM.onLoad = function (query) {
	var that = this;

	footer.init(that);
	template.init(that);
	
	if (query.id) {
		var myData = { id: query.id };
		if (query.isMy) { myData.isMy = query.isMy }
		that.setData(myData);
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
	that.getList();
};

Page(VM);