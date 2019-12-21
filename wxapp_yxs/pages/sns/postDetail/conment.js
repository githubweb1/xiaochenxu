// pages/board/postDetail/conment.js

var app = getApp();
var core = app.requirejs('core');
var VM = {
	data: {
		imageList:[]
		
	}
};
//输入
VM.myInput = function (e) {
	var that = this,
		value = e.detail.value,
		data = {};
	value = value.replace(/ /ig, '');
	data.content= value;
	that.setData(data);
};
VM.chosePic = function (e) {
	var key = e.currentTarget.dataset['key'],
		that = this,
		pic = that.data.pic;
	if (pic == key) {
		key = '';
	}
	that.setData({ pic: key });
}
//选择表情
VM.choseFace = function (e) {
	var that = this,
	
		content = that.data.content|| '',
		key = e.currentTarget.dataset['face'],
		data = {};
	content = content + '[EM' + key + ']';
	data.pic= '';
	data.content= content;
	that.setData(data)

};
//添加图片
VM.addImg = function (e) {
	var self = this;
	var index = self.data.isShow;
	var imageList = self.data.imageList;
	//console.log(imageList)
	if (imageList.length == 3) {

		wx.showModal({
			title: '提示',
			content: '图片不能超过3张',
		})
		return;
	}
	wx.chooseImage({
		count: 3,
		success: function (res) {
			//console.log(res)
			var length = res.tempFilePaths.length + imageList.length;
			if (length > 3) {
				wx.showModal({
					title: '提示',
					content: '图片不能超过3张',
				})
				return;
			}
			res.tempFilePaths.forEach(function (o) {
				imageList.push(o)
			})
			var data = {};
			data.imageList = imageList;
			self.setData(data)
		},
		fail: function () {

		}
	})
}
//删除图片
VM.myDel = function (e) {
	var self = this,
		index = e.currentTarget.dataset['key'],
		imageList = self.data.imageList;
	imageList.splice(index, 1);
	var data = {};
	data.imageList = imageList
	self.setData(data);
}

//取消
VM.myColse = function (e) {
	var that = this;
	wx.navigateBack({
		delta: 1
	})
	

};
//提交回复话题
VM.save = function (e) {
	var that = this,
		imageList = that.data.imageList,
		content = that.data.content||'';
	if (content.length < 10 || content.length > 1000) {
		wx.showModal({
			title: '提示',
			content: '内容 10-1000个字',
		})
		return
	}
	var data = { content: content, bid: that.data.bid, pid: that.data.pid };
	if (imageList.length != 0) {
		var allData = core.getUrl("util/uploader/upload", { file: "file" }, function (res) {

		});
		var data1 = {}, imgArr = [];

		data1.arr = imageList;
		that.myUploadimg(
			data1,
			function (res) {//成功
				//console.log(res.files[0].url)
				imgArr.push(res.files[0].url)
			},
			function (res) {
				console.log('上传失败');

			},
			function (res) {
				console.log('完成');
				data.images = imgArr;
				//console.log(data);

				core.get("sns/post/reply", data, function (res) {
					console.log(res)
					if (res.status == 1) {
						/*wx.redirectTo({
							url: '/pages/sns/postDetail/postDetail?id=' + that.data.pid + '&bid=' + that.data.bid
						})*/
            wx.navigateBack({
              
            })
					} else {
						wx.showModal({
							title: '提示',
							content: '提交失败',
						})
					}


				})

			},
			allData
		)

		wx.hideLoading()
	} else {
		core.get("sns/post/reply", data, function (res) {
			//console.log(res)
			if (res.status == 1) {
       /* wx.redirectTo({
            url: '/pages/sns/postDetail/postDetail?id=' + that.data.pid + '&bid=' + that.data.bid
					})*/
        wx.navigateBack({

        })
				
			} else {
				wx.showModal({
					title: '提示',
					content: '页面加载失败',
				})
			}


		})
		wx.hideLoading()
	}
}
//上传图片
VM.myUploadimg = function (data, _success, _fail, _complete, allData) {
	var self = this,
		success = data.success || 0,//成功次数
		i = data.i || 0,//当前文件下标
		fail = data.fail || 0,//失败次数
		invalid = data.invalid || 0,//图片格式错误
		filePath = data.arr[i];//图片路径数组
	wx.uploadFile({
		url: allData,
		filePath: filePath,
		name: 'file',
		formData: {},
		success: function (res) {

			var d = JSON.parse(res.data);
			//console.log(d)
			var isSuccess;
			i++;
			success++;
			if (i == data.arr.length) {
				isSuccess = true;
			}
			if (typeof _success === "function") _success(d, isSuccess, invalid);
		},
		fail: function (res) {
			//console.log(res);
			var d = JSON.parse(res.data);
			var isSuccess;
			i++;
			fail++;
			//console.log("fail:", fail);
			if (i == data.arr.length) {
				isSuccess = true;
			}

			if (typeof _fail === "function") _fail(d, isSuccess, invalid);
		},
		complete: function (res) {
			//console.log(res)
			var d = JSON.parse(res.data);
			if (d.error == "1") {
				core.alert(res.errMsg);
				return;
			}
			var cb = function () {
				if (i == data.arr.length) {  //当图片传完时，停止调用       
					console.log('执行完毕');
					console.log('成功：' + success + " 失败：" + fail);
					if (typeof _complete === "function") _complete(res);
				} else {
					data.i = i;
					data.success = success;
					data.fail = fail;
					self.myUploadimg(data, _success, _fail, _complete, allData);
				}
			};

			if (/ok/.test(res.errMsg)) {
				var _data = res;
				if (!invalid && _data.status == 1) {
					// 成功且违规图片
					invalid = 1;
					data.invalid = invalid;
				}
			}
			cb();

		}
	})
}

//获取用户信息
VM.onLoad = function (query) {
	var that = this;


	if (query.pid && query.bid) {
		var myData = { pid: query.pid, bid: query.bid };
		that.setData(myData)

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
VM.onReady = function () {

};

VM.onShow = function () {

};

VM.onHide = function () { };

VM.onUnload = function () { };

VM.onShareAppMessage = function () {

};

Page(VM);