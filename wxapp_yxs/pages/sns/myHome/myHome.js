
// pages/board/myHome/myHome.js
var app = getApp();
var core = app.requirejs('core');
var footer = require('../index/footer.js');
var VM = {
	data: {
	
		content: '',
		isHome:1
	}
};
VM.saveSign = function(){
	var that = this;
	core.get("sns/user/submit_sign", { sign:that.data.content}, function (res) {
		console.log(res)
		if (res.status == 1) {
			var ret = that.data.ret;
			ret.member.sns_sign = that.data.content;
			that.setData({
				ret:ret,
				isHome: 1
			})
		} else {
			wx.showModal({
				title: '提示',
				content: '页面加载失败',
			})
		}
	})
}
//切换签名页面
VM.myChose = function(){
	var that = this,
		isHome = that.data.isHome;
	if (that.data.isFooter!='myHome'){return}
	isHome == 1 ? isHome = 2:isHome = 1;
	that.setData({
		isHome:isHome
	})

	
}
//输入
VM.myInput = function (e) {
	var key = e.currentTarget.dataset['key'],
		that = this,
		value = e.detail.value,
		data = {};
	value = value.replace(/ /ig, '');
	data[key] = value;
	that.setData(data);
};
//获取用户信息
VM.onLoad = function (query) {
	var that = this;

	footer.init(that);
	
	var data ={};
	if(query.id){
		data.id = query.id;
		data.bid = query.bid;
		that.setData({
			id: query.id,
			bid:query.bid,
			isFooter:''
		})
		
	}else{
		
		that.setData({
			isFooter: 'myHome'
		})
	}
	core.post("sns/user", data, function (res) {
		//console.log(res)
		if (res.status == 1) {
			var imgUrl = res.result.url +'addons/ewei_shopv2/plugin/sns/template/mobile/default/images/userbg.png';
		
			var data1 ={}; 
			data1.ret = res.result;
			data1.imgUrl = imgUrl;
			if(res.result.isMe==1){
				data1.isFooter ='myHome';
				data1.isMy = 1;
				
			} 
			that.setData(data1);
			wx.setNavigationBarTitle({
				title: '社区中心'
			})
		} else {
			wx.showModal({
				title: '提示',
				content: '页面加载失败',
			})
			wx.setNavigationBarTitle({
				title: '社区中心'
			})
		}
	})
};


Page(VM);