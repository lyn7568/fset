// pages/getLocationMap/getLocationMap.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 'auto',
    latitude: '',
    longitude: '',
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520
    }, {
      latitude: 23.099994,
      longitude: 113.304520
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      longitude: options.jdS,
      latitude: options.wdS
    });
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
  }
})