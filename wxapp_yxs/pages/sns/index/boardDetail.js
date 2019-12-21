// pages/board/boardDetail.js
var app = getApp();
var core = app.requirejs('core');
var footer = require('footer.js');
var template = require('../template/detailList.js');
var WxParse = app.requirejs("wxParse/wxParse")
var VM = {
	data: {
		page: 1,//第几页
		end: false,//是否加载中
		noend: true,//是否最后一页 true非最后一页
	}
};
//关注
VM.myFllow = function(e){
	var that = this;
	wx.showLoading()
	core.get("sns/board/follow", {bid:that.data.id}, function (res) {
			console.log(res)
			if(res.status==1){
				var result = that.data.result;
				result.isfollow = res.result.isfollow
				that.setData({
					result: result
				})
			}else{
				wx.showModal({
					title: '提示',
          content: '页面加载失败', 
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({})
            }
          } 
				})
			}
		wx.hideLoading();
	})
}
//导航跳转页面
VM.goToDetal = function(e){
	var that = this;
	var key = e.currentTarget.dataset['key'];
	if(that.data.isMy==1){
		wx.navigateTo({
			url: '/pages/sns/' + key + '/' + key + '?isMy=1&id=' + that.data.id
		})
		
	}else{
		wx.navigateTo({
			url: '/pages/sns/' + key + '/' + key + '?id=' + that.data.id
		})
	}
	
}
//加载数据
VM.getList = function(){
	//console.log('开始分页加载');
	var that = this, page = that.data.page, myEnd = that.data.end;
	if (myEnd || !that.data.noend) { return };//判断是否在加载中或者已经到最后一个
	that.setData({
		end: true
	});
	
	wx.showLoading({
		title: '加载中...',
	})
	var data = { page: page,id:that.data.id };
	core.get("sns/board/getlist", data, function (res) {

		//console.log(res)
		if (res.status == 1) {

			var list = that.data.list || [];
			var arrLenth = list.length;
			var len = res.result.list.length + arrLenth;
			/*res.result.list.forEach(function (o,i) {
				console.log(i)
				o.isOpen = 1;
				
				list.push(o);
			})*/
			for (var i = 0; i < len; i++) {
				if (i >= arrLenth){
					//console.log(i - arrLenth);
					var length1 = i - arrLenth;
					if (!that.data['reply'+i]){
						WxParse.wxParse('reply' + i, 'html', res.result.list[i - arrLenth].content_new, that,5);
					}
					res.result.list[i - arrLenth]['isOpen'] = 1;
					list.push(res.result.list[i - arrLenth]);
				}
				if (i === len - 1) {
					WxParse.wxParseTemArray("replyTemArray", 'reply', len, that)
				}
			}
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
	template.init(that);
	footer.init(that);
	if (query.id) {
		var myData = { id: query.id };
		if (query.isMy) { myData.isMy = query.isMy }
		that.setData(myData);

		core.get("sns/board", { id: query.id }, function (res) {
			//console.log(res)
			if (res.status == 1) {
				res.result.board.logo = res.result.url + 'attachment/' + res.result.board.logo;
				res.result.board.banner = res.result.board.banner;

				that.setData({
					result: res.result
				})
				that.getList()
			} else {
				wx.showModal({
					title: '提示',
          content: res.result.error,
          showCancel:false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({})
            }
          } 
				})
			}
		})
	} else {
		wx.showModal({
			title: '提示',
			content: '页面参数错误',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.navigateBack({})
        }
      }
		})
	}
};
VM.onReachBottom = function () {
	var that =this;
	that.getList();
};

VM.onShow = function (query) {
	var that = this;
};



Page(VM);