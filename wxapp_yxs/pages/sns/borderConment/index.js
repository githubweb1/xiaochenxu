// pages/board/borderConment/index.js
var app = getApp();
var core = app.requirejs('core');
var footer = require('../index/footer.js')

var VM = {
	data: {
		content:'',
		title: '',
		imageList: [],
		pic:''
	}
};
//输入
VM.myInput = function (e) {
	var key = e.currentTarget.dataset['key'],
		that = this,
		value = e.detail.value,
		data={};
		value = value.replace(/ /ig,'');
	data[key] = value;
	that.setData(data);
};
//选择表情
VM.choseFace = function (e) {
	var that = this,
		content = that.data.content,
		key = e.currentTarget.dataset['face'];
	content = content + '[EM' + key + ']';
	that.setData({
		content: content,
		pic:''
	})

};
//添加图片
VM.addImg = function(e){
	var self = this;
	var imageList = self.data.imageList;
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

			self.setData({
				imageList: imageList
			})
		},
		fail: function () {

		}
	})
}
//删除图片
VM.myDel = function(e){
	var self = this,
		index = e.currentTarget.dataset['key'],
		imageList = self.data.imageList;
		imageList.splice(index, 1);
	self.setData({ imageList: imageList });
}
//切换
VM.chosePic = function(e){
	var key = e.currentTarget.dataset['key'],
		that = this,
		pic = that.data.pic;
		if(pic==key){
			key = '';
		}
		that.setData({pic:key});
}
//发表
VM.save = function (e) {
	var that = this,
		title = that.data.title,
		content = that.data.content;
	if (title.length < 3 || title.length > 25){
			wx.showModal({
				title: '提示',
				content: '标题 3-25字',
			})
			return
	}
	if (content.length < 10 || content.length > 1000) {
		wx.showModal({
			title: '提示',
			content: '内容 10-1000个字',
		})
		return
	}
	var data = { content: content,title:title,bid:that.data.id};
	
	wx.showLoading('加载中...')
	if (that.data.imageList.length!=0){
		
		var allData = core.getUrl("util/uploader/upload", { file: "file"}, function (res) {
				
		});
		var data1={},imgArr = [];

		data1.arr = that.data.imageList;
		that.myUploadimg(
			data1,
			function(res){//成功
				//console.log(res.files[0].url)
				imgArr.push(res.files[0].url)
			},
			function(res){
				console.log('上传失败');
				
			},
			function (res) {
				console.log('完成');
				data.images = imgArr;
				//console.log(data);
				
				core.get("sns/post/submit", data, function (res) {
					console.log(res)
					if (res.status == 1) {
            wx.redirectTo({
              url: '/pages/sns/index/boardDetail?id='+that.data.id
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
		
	}else{
		core.get("sns/post/submit", data, function (res) {
			console.log(res)
			if (res.status == 1) {
        wx.redirectTo({
          url: '/pages/sns/index/boardDetail?id=' + that.data.id
				})
			} else {
				wx.showModal({
					title: '提示',
          content: '页面加载失败',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack()
            } 
          }
				})
			}


		})
		wx.hideLoading()
	}
	
	
};
//上传图片
VM.myUploadimg = function (data, _success, _fail, _complete, allData){
	var self = this,
		success = data.success||0,//成功次数
		i = data.i||0,//当前文件下标
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
				if (i ==data.arr.length) {
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

	footer.init(that);
	if (query.id){
		that.setData({id:query.id})
	}else{
		wx.showModal({
			title: '提示',
			content: '页面参数错误',
		})
	}


};


Page(VM);