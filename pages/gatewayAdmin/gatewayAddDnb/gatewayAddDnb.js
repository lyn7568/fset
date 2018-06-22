// pages/gatewayAdmin/gatewayAddDnb/gatewayAddDnb.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    casArray: [
      "二相电能表",
      "三相电能表"
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