//common.js

const baseUrl = 'http://poxiao58.6655.la:50096/fset';

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
    data: serialize(data),
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (res) {
      if (res.statusCode === 200) {
          sh(res);
      } else {
        if (eh) eh(res.statusCode);
      }
    },
    fail: function (res) {
      if (fh) fh(res);
    },
    complete: function (res) {
      if (ref && (ref.num === 0 || ref.num)) {
        ref.num--;
        if (ref.num === 0) selfPage.setData(pageData);
      } else {
        selfPage.setData(pageData)
      }

    },
  })
};


const tancuAlert=(pr,Bln,fn)=>{
  wx.showModal({
    title: '提示',
    content: pr,
    showCancel: Bln,
    success: function (res) {
      if (res.confirm) {
        if (Bln) {
          fn();
        }
      } else if (res.cancel) {
       
      }
    }
  })
}
// console.log=function () {
//
// };
var serialize = function (obj) {
  if ("string" === typeof obj) {
    return obj
  }
  var ret = [];
  if (obj) {
    for (var key in obj) {
      var val = obj[key];
      var t = (typeof val);
      if ("boolean" === t) {
        ret.push(key + "=" + (val ? "1" : "0"));
      } else if ("string" === t) {
        if (val) {
          ret.push(key + "=" + encodeURIComponent(val));
        }
      } else if ("number" === t) {
        if (!isNaN(val)) {
          ret.push(key + "=" + val);
        }
      } else if ("object" === t && Array.isArray(val) && val.length) {
        val.forEach(function (item) {
          var tt = (typeof item)
          if ("string" === tt)
            ret.push(key + "=" + encodeURIComponent(item));
          else if ("number" === tt)
            if (!isNaN(item)) {
              ret.push(key + "=" + item);
            }
            else if ("boolean" === tt)
              ret.push(key + "=" + (item ? "1" : "0"));
        });
      }
    }
  }
  return ret.join("&");
};

var objt = {
  obtainOpenId: function (res) {
    wx.setStorageSync('openId', res);
    req.post({
      url: "/ajax/oauth/openidLogin",
      'data': {
        'oauthType': 'weixinxiaochengxu',
        'openid': res
      },
      sh: objt.relevance
    });
  },
  relevance: function (res) {
    var selfPage = getCurrentPages()[getCurrentPages().length - 1];
    if (res == null) {
      for (; ;) {
        if (wx.getStorageSync("guid")) {
          break;
        }
      }
      wx.navigateTo({
        url: "../../pages/login"
      })
    } else {
      wx.setStorageSync('id', res.id);
      wx.setStorageSync('name', res.name);
      selfPage.onShow();
    }
  },
  guid: function (res) {
    console.log(res)
    wx.setStorageSync('guid', res);
  },
  loginWeiXin: function () {
    var self = this;
    wx.login({
      success: res => {
        console.log(res)
        var code1 = res.code;
        console.log(code1)
        wx.getUserInfo({
          success: res => {
            wx.setStorageSync('weChatInfo', { "nickName": res.userInfo.nickName, 'avatarUrl': res.userInfo.avatarUrl });
            req.get({
              url: "/ajax/oauth/xcx/openid",
              data: { 'code': code1 },
              sh: self.obtainOpenId
            })
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          }
        })
      }
    })
  },
  init: function () {
    var self = this;
    if (!wx.getStorageSync("guid"))
      req.get({
        url: "/ajax/guid",
        sh: self.guid
      });
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          self.loginWeiXin();
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success: function (res) {
              self.loginWeiXin();
            },
            complete: function () {
            },
            fail: function (e) {
              wx.setStorageSync('weChatInfo', "");
              wx.setStorageSync('id', "");
              wx.setStorageSync('openId', "");
            }
          })
        }
      }
    })
  },
  require: function () {
    var self = this;
    wx.openSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          self.loginWeiXin();
        }
      }
    })
  }
}


module.exports = {
  baseUrl: baseUrl,
  post: post,
  tancuAlert: tancuAlert
};