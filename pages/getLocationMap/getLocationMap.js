// pages/getLocationMap/getLocationMap.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 'auto'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      latitude: options.wdS,
      longitude: options.jdS,
      markers: [{
        id: options.wgip,
        latitude: options.wdS,
        longitude: options.jdS
      }]
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