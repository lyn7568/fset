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
    this.setData({
      jdIpNow: options.ykIp
    })
    this.username = wx.getStorageSync('username');
  },
  bindCasPickerChange: function (e) {
    this.setData({
      casIndex: e.detail.value
    })
  },
  getEqName(e) {
    this.setData({
      eqName: e.detail.value
    })
  },
  cacelAdd() {
    wx.navigateBack({
      delta: 1
    })
  },
  addEquipment: function () {
    var that = this;
    let jdIp = that.data.jdIpNow
    if (!that.data.eqName) {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none'
      })
      return
    }
    // common.post({
    //   url: '/sensor/addDnt',
    //   data: {
    //     jdIp: jdIp,
    //     type: parseInt(that.data.casIndex) + 1,
    //     dntIp: that.data.eqName
    //   },
    //   sh: function (res) {
    //     console.log(res);
    //     if (res.data.result === 'success') {
    //       wx.showToast({
    //         title: '添加成功'
    //       })
    //       wx.navigateBack({
    //         delta: 1
    //       })
    //     } else {
    //       wx.showToast({
    //         title: res.data.result,
    //         icon: 'none'
    //       })
    //     }
    //   }
    })
  }
})