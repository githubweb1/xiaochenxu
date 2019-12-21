// pages/board/allList.js
var app = getApp();
var core = app.requirejs('core');
var footer = require('footer.js');
var VM = {
	data: {
		cid:'all',
		isFooter:'allList',
		isFocus:1,
		value:'',
		page: 1,//第几页
		end: false,//是否加载中
		noend: true,//是否最后一页 true非最后一页
	}
};
//点击搜索
VM.mySearch = function (e) {
	var self = this;
	self.reset();
}
//切换导航
VM.choseNav = function(e){
	var self = this;

	var id = e.currentTarget.dataset['id'];
	self.setData({
		cid:id
	});
	self.reset();
}
//重置页面
VM.reset = function () {//
	var that = this;
	that.setData({
		page: 1,
		end: false,
		noend: true,
		list: []
	});
	that.getRightList('val')
};
//加载版块
VM.getList = function(){
	var that = this;
	core.get("sns/board/lists", {}, function (res) {
	
		that.setData({
			result:res.result
		})
		that.getRightList()
		wx.hideLoading();
	})
}
//加载列表数据
VM.getRightList = function(val){
	//console.log('开始分页加载');
	var that = this, page = that.data.page, myEnd = that.data.end;
	if (myEnd || !that.data.noend) { return };//判断是否在加载中或者已经到最后一个
	that.setData({
		end: true
	});
	wx.showLoading({
		title: '加载中...',
	})
	var cid = that.data.cid,data,
			data = {page: page};
	if(cid=='all'){
		 cid= "";
	}
	if (val == 'val' &&that.data.value!=''){

		data.keywords = that.data.value;
	}
	data.cid = cid;
	//console.log(data);
	core.get("sns/board/get_boardlist", data, function (res) {

			if(res.status==1){
			
				var list = that.data.list || [];
				res.result.list.forEach(function(o){
					list.push(o);
				})
				page++;

				if (res.result.total < page) {
					that.setData({
						list: list,
						noend: false,
						page: page,
						end: false
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
	
}
//输入关键字
VM.myInput = function(e){
	var self = this, value = e.detail.value;
	if (value!=''){
		value = value.replace(/ /ig,'')
		self.setData({
			value: value,
			isFocus: 2
		})
	}else{
		self.setData({
			value: '',
			isFocus: 1
		})
	}
};
VM.clearInput = function(e){
	var self = this;
	self.setData({
		value: '',
		isFocus: 1
	})
}
//获取用户信息
VM.onLoad = function (query) {
	var that = this;

	footer.init(that);
	wx.showLoading({
		title: '加载中...',
	})
	if (query.id){
		that.setData({
			cid: query.id
		})
		
	}
	that.getList();

	
};


Page(VM);