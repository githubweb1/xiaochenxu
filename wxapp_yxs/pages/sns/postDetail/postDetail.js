// pages/board/postDetail/postDetail.js
var app = getApp();
var core = app.requirejs('core');
var WxParse = app.requirejs("wxParse/wxParse")
var VM = {
	data: {
		isShow:3,//3首页面，2回复话题评论，1评论话题
		page: 1,//第几页
		end: false,//是否加载中
		noend: true,//是否最后一页 true非最后一页
	}
};

//点击回复
VM.myConment = function(e){
	var that = this,
	key = e.currentTarget.dataset['key'];
		
		if(key=='conment'){
			wx.navigateTo({
				url: key + '?bid=' + that.data.bid + '&pid=' + that.data.id
			})

		}
		if (key == 'backComent') {
			var idx = e.currentTarget.dataset['idx'],
				rpid = e.currentTarget.dataset['rpid'],
				name = e.currentTarget.dataset['name'];
			
			wx.navigateTo({
				url: key + '?bid=' + that.data.bid + '&pid=' + that.data.id + '&name=' + name + '&rpid=' + rpid
			})

		}
	if (key =='feekback'){
		var idx = e.currentTarget.dataset['idx'],
			
			name = e.currentTarget.dataset['name'];

		wx.navigateTo({
			url: key + '?bid=' + that.data.bid + '&pid=' + that.data.id+ '&name=' + name + '&id=' + idx
		})
	}

};
//取消
VM.myColse = function (e) {
	var that = this,
	 	isShow = that.data.isShow;
	var data = {};
	if (isShow==2){
		wx.showModal({
			title: '提示',
			content: '是否保留回复内容',
			cancelText:'不保留',
			confirmText:'保留',
			mask:true,
			success: function (res) {
				if (res.confirm) {
					//console.log('用户点击确定')

					data.isShow = 3;
					that.setData(data);
				} else if (res.cancel) {
					//console.log('用户点击取消')
					data.isShow = 3;
					data['content' + isShow] = '';
					data['pic' + isShow] = '';
					data['imageList' + isShow] = [];
					that.setData(data);
				}
			}

		})
	}else{
		data.isShow = 3;
		data['content' + isShow] = '';
		data['pic' + isShow] = '';
		data['imageList' + isShow] = [];
		that.setData(data);
	}
	

};
//点赞
VM.getGoods1 = function(e){
	var that = this,
		pid = e.currentTarget.dataset['id'],
		index = e.currentTarget.dataset['index'],
		bid = e.currentTarget.dataset['bid'];

	var data = {
		pid: pid,
		bid: bid
	}
	
	wx.showLoading();
	core.get("sns/post/like", data, function (res) {
		if (res.status == 1) {
			var list = that.data.list 
			list[index].isgood = res.result.isgood;
			list[index].goodcount = res.result.good;
			that.setData({
				list: list
			

			})
		}
		//console.log(res)
		wx.hideLoading();
	})
}
VM.getGoods = function (e) {
	var that = this,
		pid = that.data.id,
		bid = that.data.bid;

	var data = {
		pid: pid,
		bid: bid
	}
	wx.showLoading();
	core.get("sns/post/like", data, function (res) {
		if (res.status == 1) {
			var ret = that.data.ret
			ret.isgood = res.result.isgood;
			ret.goodcount = res.result.good;
			that.setData({
				ret: ret


			})
		}
		//console.log(res)
		wx.hideLoading();
	})
}
//重新加载
VM.reset = function (isFirst) {
  var that = this;
  that.setData({
    page: 1,//第几页
    end: false,//是否加载中
    noend: true,//是否最后一页 true非最后一页
    list: [],
    replyTemArray: [],
    arr: []
  })
  that.getList(isFirst);
}
//加载数据
VM.getList = function (isFirst) {
	//console.log('开始分页加载');
	var that = this, page = that.data.page, myEnd = that.data.end;
	if (myEnd || !that.data.noend||that.data.isShow!=3) { return };//判断是否在加载中或者已经到最后一个
	that.setData({
		end: true
	});

	wx.showLoading({
		title: '加载中...',
	})
	var data = { page: page, pid: that.data.id, bid: that.data.bid };
	core.get("sns/post/getlist", data, function (res) {

		if (res.status == 1) {

			var list = that.data.list || [];
			var arr = that.data.arr || [];
			var arrLenth = list.length;//现有的列表长度
			var len = res.result.list.length + arrLenth;
			for (var i = 0; i < len; i++) {
				if (i >= arrLenth) {
					//console.log(i - arrLenth);
					var length1 = i - arrLenth;
          if (!that.data['reply' + i] || isFirst == 1) {
            WxParse.wxParse('reply' + i, 'html', res.result.list[i - arrLenth].content_new, that);
					}
					res.result.list[i - arrLenth].arr = [];
					if (res.result.list[i - arrLenth].parent!=false){
						
						res.result.list[i - arrLenth].parentNew = [res.result.list[i - arrLenth].parent];
						
					
						res.result.list[i - arrLenth].parentNew.forEach(function(P,Index){
							WxParse.wxParse(i + 'article' +Index, 'html', P.content, that, 5);
							
							res.result.list[i - arrLenth].arr.push({
								i:i,
								article: that.data[i + 'article' + Index]
							})
						})
						
					}
					
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
					arr: arr

				});
			} else {
				that.setData({
					list: list,
					page: page,
					end: false,
					arr: arr
				});
			}
		}
		wx.hideLoading();
	});


		
};
//获取用户信息
VM.onLoad = function (query) {
	var that = this;
	if (query.id) {
		var myData = { id: query.id, bid:query.bid };
		if (query.isMy) { myData.isMy = query.isMy }
		that.setData(myData);
		core.get("sns/post", {id:query.id}, function (res) {
			if (res.status==1){
				WxParse.wxParse('article', 'html', res.result.posts.content_new, that,5);
				that.setData({
					ret:res.result,
					bid: res.result.board.id
				})
				// that.getList();
				
			}else{
        wx.showModal({
          title: '提示',
          content: res.result.message,
          showCancel: false,
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
		})
	}


};
VM.onReachBottom = function () {
	var that = this;
	that.getList();
};
VM.onReady = function () {

};

VM.onShow = function () {
  var that = this;
  that.reset(1);
};

VM.onHide = function () { };

VM.onUnload = function () { };

VM.onShareAppMessage = function () {

};

Page(VM);