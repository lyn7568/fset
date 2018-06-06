// pages/gatewayAdmin/gatewayUpdate/gatewayUpdate.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    longitudeIndex:0,
    longitude: ['东经', '西经'],//经度
    latitudeIndex:0,
    latitude: ['北纬', '南纬']//纬度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  bindLongitude: function (e) {
    console.log(this.data.longitude[e.detail.value])
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      longitudeIndex: e.detail.value
    })
  },
  bindLatitude: function (e) {
    console.log(this.data.latitude[e.detail.value])
    if (e.detail.value == 4) {
      this.setData({ replyT: true })
    } else {
      this.setData({ replyT: false })
    }
    this.setData({
      latitudeIndex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})