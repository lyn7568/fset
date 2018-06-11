// pages/gatewayAdmin/gatewayUpdate/gatewayUpdate.js
const common = require('../../../utils/common.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    longitudeIndex:0,
    longitude: ['东经', '西经'],//经度
    latitudeIndex:0,
    latitude: ['北纬', '南纬'],//纬度
    listData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currendId: options.id
    });
    this.username = wx.getStorageSync('username');
    if (options.id && wx.getStorageSync('username')){
      this.getListData(options.id)
    }
    console.log(this.data)
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
  getListData(id) {
    var that = this;
    common.post({
      url: '/android/equipmentManagement/equipmentList',
      data: {
        ip: id,
        username: this.username
      },
      sh: function (res) {
        console.log(res)
        var jwd = res.data[0].cl06.split(',')
        if (jwd[0]>=0){
          that.setData({
            longitudeIndex:0,
            jdS: jwd[0]
          })
        }else{
          that.setData({
            longitudeIndex: 1,
            jdS: jwd[0].substring(1, jwd[0].length())
          })
        }
        if (jwd[1] >= 0) {
          that.setData({
            latitudeIndex: 0,
            wdS: jwd[1]
          })
        }else{
          that.setData({
            latitudeIndex: 1,
            wdS: jwd[1].substring(1, jwd[1].length())
          })
        }
        that.setData({
          listData: res.data[0],
          nameS: res.data[0].cl01
        })
      }
    })
  },
  updateInfo(){
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    common.post({
      url: '/android/equipmentManagement/editName',
      data: {
        type:'wg',
        name: that.data.nameS,
        ip: that.data.currendId,
        pid: that.data.currendId,
        jd: (that.data.longitudeIndex === 0 ? '+' : '-') + that.data.jdS,
        wd: (that.data.latitudeIndex === 0 ? '+' : '-') + that.data.wdS,
        username: that.username
      },
      sh: function (res) {
        console.log(res)
        if (res.data.relust === 'success') {
          wx.hideLoading()
          wx.showToast({
            title: '设备信息修改成功'
          })
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.result,
            icon: 'none'
          })
        }
      }
    })
  },
  cancelUpdateInfo() {
    wx.navigateBack({
      delta: 1
    })
  }
})