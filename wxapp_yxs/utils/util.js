//作者QQ:1026770372
function t(t) { 
  var n = t.getFullYear(),
   o = t.getMonth() + 1,
    r = t.getDate(),
     u = t.getHours(),
      i = t.getMinutes(),
       g = t.getSeconds(); 
       return [ o, r].map(e).join("月") + "日" + [u, i].map(e).join(":") 
       } function e(t) { return t = t.toString(), t[1] ? t : "0" + t } module.exports = { formatTime: t }

const formatTimes = date => {
  // const year = date.getFullYear()
  // const month = date.getMonth() + 1
  // const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//数组去重
function contains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}

module.exports = {
  formatTimes: formatTimes,
  contains: contains
}


