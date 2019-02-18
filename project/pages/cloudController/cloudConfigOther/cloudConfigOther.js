const common = require('../../../utils/common.js');
Page({
  data: {
    casArray: [
      "重复触发",
      "不重复触发"
    ],
    casIndex: 0
  },
  onLoad: function (options) {
    this.setData({
      casType: options.ty,
      jdIpNow: options.ykIp
    })
    this.username = wx.getStorageSync('username');
    if (options.ty === 'gz') {
      wx.setNavigationBarTitle({
        title: '光照传感器管理'
      });
      this.getGZinfo();
    } else if (options.ty === 'hw') {
      wx.setNavigationBarTitle({
        title: '红外传感器管理'
      });
      this.getHWinfo()
    }
  },
  bindCasPickerChange: function (e) {
    this.setData({
      casIndex: e.detail.value
    })
  },
  getTimeDelay: function (e) {
    this.setData({
      timeDelay: e.detail.value
    })
  },
  getLowNum(e) {
    this.setData({
      lowNum: e.detail.value
    })
  },
  getHighNum(e) {
    this.setData({
      highNum: e.detail.value
    })
  },
  cacelAdd() {
    wx.navigateBack({
      delta: 1
    })
  },
  getHWinfo: function () {
    var that = this;
    let jdIp = that.data.jdIpNow
    common.post({
      url: '/crelay/showHwSetting',
      data: {
        jdIp: jdIp
      },
      sh: function (res) {
        if (res.data.result === 'success') {
          that.setData({
            casIndex: res.data.ct,
            timeDelay: res.data.tm
          })
        } else {
          wx.showToast({
            title: res.data.result,
            icon: 'none'
          })
        }
      }
    })
  },
  getGZinfo: function () {
    var that = this;
    let jdIp = that.data.jdIpNow
    common.post({
      url: '/crelay/showCgqSetting',
      data: {
        jdIp: jdIp
      },
      sh: function (res) {
        if (res.data.result === 'success') {
          that.setData({
            highNum: res.data.gyz,
            lowNum: res.data.dyz
          })
        } else {
          wx.showToast({
            title: res.data.result,
            icon: 'none'
          })
        }
      }
    })
  },
  sureButtonHw: function () {
    var that = this;
    let jdIp = that.data.jdIpNow
    common.post({
      url: '/android/crelay/hwSetting',
      data: {
        jdIp: jdIp,
        time: that.data.timeDelay,
        cffs: parseInt(that.data.casIndex),
        username: that.username
      },
      sh: function (res) {
        if (res.data.result === 'success') {
          wx.showToast({
            title: '设置成功'
          })
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: res.data.result,
            icon: 'none'
          })
        }
      }
    })
  },
  sureButtonGz: function () {
    var that = this;
    let jdIp = that.data.jdIpNow
    common.post({
      url: '/android/crelay/cgqSetting',
      data: {
        jdIp: jdIp,
        gyz: that.data.highNum,
        dyz: that.data.lowNum
      },
      sh: function (res) {
        if (res.data.result === 'success') {
          wx.showToast({
            title: '设置成功'
          })
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: res.data.result,
            icon: 'none'
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      path: 'pages/index/index'
    };
  }
})