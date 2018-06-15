// pages/gatewayAdmin/gatewayAddCgq/gatewayAddCgq.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    casArray: [
      "红外传感器",
      "光照传感器"
    ],
    casIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  bindCasPickerChange: function (e) {
    this.setData({
      casIndex: e.detail.value
    })
  }
})