var app = getApp();
var core = app.requirejs('core');
var borderAll = {
	data: {
		
	},

	page: null,

	setData: function (opt) {
		this.page && this.page.setData(opt);
	},
	//点赞
	getGoods: function (e) {
		var that = this,
			pid = e.currentTarget.dataset['id'],
			index = e.currentTarget.dataset['index'],
			list = that.data.list,
			bid = that.data.id;
		var data = {
			pid:pid,
			bid:bid
		}
		wx.showLoading();
		core.get("sns/post/like", data, function (res) {
			if (res.status==1){
				list[index].isgood = res.result.isgood;
				list[index].goodcount = res.result.good;
				that.setData({
					list:list
				})
			}
			console.log(res)
			wx.hideLoading();
		})

	},
	//跳转到投诉页面
	gotoDetail: function (e) {
		var that = this,
			pid = e.currentTarget.dataset['id'],
			name = e.currentTarget.dataset['name'],
			bid = that.data.id;
		wx.navigateTo({
			url: '/pages/sns/postDetail/feekback'+ '?bid=' + bid + '&pid=' + pid + '&name=' + name + '&id=' + pid
		})
	},
	openAll:function(e){
		var self = this,
			index = e.currentTarget.dataset['index'],
			open = e.currentTarget.dataset['open'],
			list = self.data.list;
		open == 1 ? open = 2: open=1;

		list[index].isOpen = open;
		self.setData({
			list:list
		})
		//console.log(index + "展开" + open)
	},

	init: function (page) {
		var self = this;
		this.page = page;

		//配置本组件函数到页面
		page.getGoods = this.getGoods;
		page.gotoDetail = this.gotoDetail;
		page.openAll = this.openAll;
		// 配置本组件数据到页面
		this.setData(this.data);

		//console.log(page);
	},
};
module.exports = borderAll;