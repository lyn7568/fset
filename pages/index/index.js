//index.js

//获取应用实例
var start_clientX;
var end_clientX;
const app = getApp()
const util = require("../../utils/util.js")
const common = require('../../utils/common.js');

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    windowWidth: wx.getSystemInfoSync().windowWidth
  },
  onLoad: function () {
    var that = this
    common.firstInit.init(); //初始化
  },
  quitFset:function(){
    wx.removeStorageSync('username');
    wx.redirectTo({
      url: '../login/login'
    })
    wx.showToast({
      title: '您已退出登录',
      icon: 'none'
    })
  },
  // 滑动开始  
  touchstart: function (e) {
    start_clientX = e.changedTouches[0].clientX
  },
  // 滑动结束  
  touchend: function (e) {
    end_clientX = e.changedTouches[0].clientX;
    if (end_clientX - start_clientX > 120) {
      this.setData({
        display: "block",
        translate: 'transform: translateX(' + this.data.windowWidth * 0.5 + 'px);'
      })
    } else if (start_clientX - end_clientX > 0) {
      this.setData({
        display: "none",
        translate: ''
      })
    }
  },
  // 侧栏 
  showview: function () {
    this.setData({
      display: "block",
      translate: 'transform: translateX(' + this.data.windowWidth * 0.5 + 'px);'
    })
  },
  // 遮拦  
  hideview: function () {
    this.setData({
      display: "none",
      translate: '',
    })
  }
})
