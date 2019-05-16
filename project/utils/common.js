//common.js
// const baseUrl = 'http://poxiao58.6655.la:50096/fset';
const baseUrl = 'https://www.zzfset.com/fset';

const post = function (param) {
  var selfPage = getCurrentPages()[getCurrentPages().length - 1];
  var url = param.url,
    data = param.data || '',
    sh = param.sh,//请求成功
    eh = param.eh,//请求失败
    fh = param.fh,//网络错误
    ref = param.ref,
    pageData = param.pageData || {};
  if (ref && (ref.num === 0 || ref.num)) {
    ref.num++
  }
  wx.request({
    url: baseUrl + url,
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (res) {
      if (res.statusCode === 200) {
          sh(res);
      }else{
        if (res.statusCode === 403) {
          wx.showToast({
            title: '对不起，您没有操作权限，请联系管理员',
            icon: 'none'
          })
        } else if (res.statusCode === 500) {
          wx.showToast({
            title: '服务器响应失败，请重试',
            icon: 'none'
          })
        }else{
          if (eh) eh(res.statusCode);
        }
      }
    },
    fail: function (res) {
      wx.showToast({
        title: '服务器响应失败，请重试',
        icon: 'none'
      });
      if (fh) fh(res);
    },
    complete: function (res) {
      if (ref && (ref.num === 0 || ref.num)) {
        ref.num--;
        if (ref.num === 0) selfPage.setData(pageData);
      } else {
        selfPage.setData(pageData)
      }
    }
  })
};

var objt = {
  init: function () {
    var self = this;
    var selfPage = getCurrentPages()[getCurrentPages().length - 1];
    if (!wx.getStorageSync("username") && wx.getStorageSync("username")==='') {
      wx.redirectTo({
        url: "../../pages/login/login"
      })
    } else {
      selfPage.onShow();
    }
  }
}


module.exports = {
  baseUrl: baseUrl,
  post: post,
  firstInit: objt
};