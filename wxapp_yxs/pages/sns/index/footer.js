var app = getApp();

var myGoto = {
	data: {
		
	},

	page: null,

	setData: function (opt) {
		this.page && this.page.setData(opt);
	},
	//跳转对话详情页
	oyGoTo: function (e) {
		var self = this;
		
		var key = e.currentTarget.dataset['key'];
		if (key==self.data.isFooter){
			return;
		}else{
			//console.log(key)
			if(key=='myHome'){
				key +='/'+key
			}
			wx.redirectTo({
				url:'/pages/sns/'+key
			})
		}

	},
	
	

	init: function (page) {
		var self = this;
		this.page = page;

		//配置本组件函数到页面
		page.oyGoTo = this.oyGoTo;
		
		// 配置本组件数据到页面
		this.setData(this.data);

		//console.log(page);
	},
};
module.exports = myGoto;