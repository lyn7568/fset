// pages/login/login.js
const common = require('../../utils/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountName:'',
    accountPwd:'',
    bdDisabled: true,
    scrollHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          scrollHeight: res.windowHeight
        });

      }
    })
  },
  setCss: function () {
    if (this.data.accountName.trim().length != 0 && this.data.accountPwd.trim().length != 0) {
      this.setData({
        bdDisabled: false
      })
    } else {
      this.setData({
        bdDisabled: true
      })
    }
  },
  getAccountName: function (e) {
    this.data.accountName = e.detail.value;
  },
  getAccountPwd: function (e) {
    this.data.accountPwd = e.detail.value;
    this.setCss();
  },
  binding: function () {
    var that=this;
    common.post({
      url: '/android/login',
      data: {
        username: that.data.accountName,
        password: that.data.accountPwd
      },
      sh: function (res) {
        if (res.result = "success"){
          wx.setStorageSync('username', that.data.accountName);
          wx.redirectTo({
            url: '../index/index',
          })
        } else {
          wx.showToast({
            title: '用户名或密码错误',
            icon: 'none'
          })
        }
        
      }
    })

  }
})