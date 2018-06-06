// pages/gatewayAdmin/gatewayDetail/gatewayDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
delSelf:function(){
  wx.showModal({
    title: '提示',
    content: '确定要删除该设备吗?',
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
},
  updateSelf:function(){
    wx.navigateTo({
      url: '/pages/gatewayAdmin/gatewayUpdate/gatewayUpdate'
    })
  },
  getSelfMap:function(){

  }
})