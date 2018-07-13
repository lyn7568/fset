const common = require('../../../utils/common.js');

Page({
  data: {
    isfindSure: false//设备是否存在
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.username = wx.getStorageSync('username');
  },
  findIsSure(e) {
    var epid = e.detail.value
    var that = this;
    if (epid) {
      wx.showLoading({
        title: '设备搜索中',
        mask: true
      })
      common.post({
        url: '/cloudController/findByIp',
        data: {
          ip: epid
        },
        sh: function (res) {
          wx.hideLoading()
          if (res.data.result === 'fail') {
            wx.showToast({
              title: '该设备已被注册',
              icon: 'none'
            })
          } else {
            that.findEquipment(epid);
            that.setData({
              eqIp: epid
            });
          }
        }
      })
    }
  },
  findEquipment(ip) {
    var that = this;
    common.post({
      url: '/cloudController/findIp',
      data: {
        ip: ip
      },
      sh: function (res) {
        if (res.data.result === 'success') {
          that.setData({
            typeS: res.data.data.name_,
            typeX: res.data.data.type_,
            typeN: res.data.data.type,
            typeJW: res.data.data.jingwei,
            isfindSure: true
          });
        } else {
          wx.showToast({
            title: res.data.result,
            icon: 'none'
          })
        }
      }
    })
  },
  getEqName(e) {
    this.setData({
      eqName: e.detail.value
    })
  },
  addEquipment() {
    var that = this;
    if (!that.data.eqName) {
      wx.showToast({
        title: '设备名称不能为空',
        icon: 'none'
      })
      return
    }
    common.post({
      url: '/android/cloudController/addEquit',
      data: {
        eq_id: that.data.eqIp,
        eq_name: that.data.eqName,
        eq_type: that.data.typeN,
        jingwei: that.data.typeJW,
        username: that.username
      },
      sh: function (res) {
        console.log(res);
        if (res.data.result === 'success') {
          wx.showToast({
            title: '设备添加成功'
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
  cacelAdd() {
    wx.navigateBack({
      delta: 1
    })
  }
})
