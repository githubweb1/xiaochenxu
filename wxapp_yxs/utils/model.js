module.exports = {
    ShowCountDown: function (endtime) {
    var now = new Date();
    var endDate = new Date(endtime * 1000);
    var leftTime = endDate.getTime() - now.getTime();
    if(leftTime <= 0) return '已过期';
    var leftsecond = parseInt(leftTime / 1000);
    //var day1=parseInt(leftsecond/(24*60*60*6));
    var day1 = Math.floor(leftsecond / 86400);
    var hour = Math.floor((leftsecond - day1 * 86400) / 3600);
    var minute = Math.floor((leftsecond - day1 * 86400 - hour * 3600) / 60);
    var second = Math.floor(leftsecond - day1 * 86400 - hour * 3600 - minute * 60);
    return  "剩余:" + day1 + "天" + hour + "小时" + minute + "分" + second + "秒";
  }
}