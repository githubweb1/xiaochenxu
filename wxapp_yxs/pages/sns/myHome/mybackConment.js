// pages/board/myHome/mybackConment.js
var app = getApp();
var core = app.requirejs('core');
var footer = require('../index/footer.js');
var VM = {
	data: {
		page: 1,//第几页
		end: false,//是否加载中
		noend: true,//是否最后一页 true非最后一页
	}
};
VM.myDelete = function(e){

	 var that = this,
	 	id = e.currentTarget.dataset['id'],
		index = e.currentTarget.dataset['index'];
	//console.log(index)
	wx.showModal({
		title: '提示',
		content: '是否删除评论',
		cancelText: '取消',
		confirmText: '确定',
		mask: true,
		success: function (res) {
			if (res.confirm) {
				//console.log('用户点击确定')

				core.get("sns/user/delete_reply", { id: id }, function (res) {
					console.log(res)
					if (res.status == 1) {
						var list = that.data.list;
						list.splice(index, 1);
						that.setData({
							list: list
						})
						wx.showToast({
							title: '删除成功',
							icon: 'success',
							duration: 2000
						})
						
					}
				})
			} else if (res.cancel) {
				//console.log('用户点击取消')
				
			}
		}

	})
	//sns.user.delete_reply
	
}
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
	var data = { page: page};
	core.get("sns/user/get_replys", data, function (res) {

		console.log(res)
		if (res.status == 1) {

			var list = that.data.list || [];
			
			res.result.list.forEach(function (o) {
				list.push(o);
			})

			page++;

			if (res.result.pages < page) {
				that.setData({
					list: list,
					noend: false,
					page: page,
					end: false,
					
				});
			} else {
				that.setData({
					list: list,
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


	if (query.isMy) {
		var myData = {  };
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