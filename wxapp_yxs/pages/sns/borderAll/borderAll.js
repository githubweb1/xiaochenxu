// pages/board/borderAll/borderAll.js
var app = getApp();
var core = app.requirejs('core');
var footer = require('../index/footer.js');
var template = require('../template/detailList.js');
var VM = {
	data: {

	}
};


//获取用户信息
VM.onLoad = function (query) {
	var that = this;

	footer.init(that);
	template.init(that)

};


Page(VM);