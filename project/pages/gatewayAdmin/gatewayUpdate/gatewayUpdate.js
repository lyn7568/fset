const common = require('../../../utils/common.js');

Page({
  data: {
    longitudeIndex:0,
    longitude: ['东经', '西经'],//经度
    latitudeIndex:0,
    latitude: ['北纬', '南纬'],//纬度
    listData:[]
  },
  onLoad: function (options) {
    this.setData({
      nameS: options.name,
      currendjw: options.jw,
      currendflag: options.flag
    });
    this.username = wx.getStorageSync('username');
    var jwd = options.jw.split(',')
    if (jwd[0] >= 0) {
      this.setData({
        longitudeIndex: 0,
        jdS: jwd[0]
      })
    } else {
      this.setData({
        longitudeIndex: 1,
        jdS: jwd[0].substring(1, jwd[0].length)
      })
    }
    if (jwd[1] >= 0) {
      this.setData({
        latitudeIndex: 0,
        wdS: jwd[1]
      })
    } else {
      this.setData({
        latitudeIndex: 1,
        wdS: jwd[1].substring(1, jwd[1].length)
      })
    }
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
    if (e.detail.value == 4) {
      this.setData({ replyT: true })
    } else {
      this.setData({ replyT: false })
    }
    this.setData({
      latitudeIndex: e.detail.value
    })
  },
  tapName: function (e) {
    this.setData({
      nameS: e.detail.value
    })
  },
  tapJds: function (e) {
    this.setData({
      jdS: e.detail.value
    })
  },
  tapWds: function (e) {
    this.setData({
      wdS: e.detail.value
    })
  },
  updateInfo(){
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var currendflag = that.data.currendflag
    var url='',type=''
    if (currendflag==='1'){
      url = '/android/equipmentManagement/editName'
      type = 'wg'
    } else if (currendflag === '2') {
      url = '/android/cloudController/editName'
      type = 'jd'
    }
    common.post({
      url: url,
      data: {
        type: type,
        name: that.data.nameS,
        ip: that.data.currendId,
        pid: that.data.currendId,
        jd: (that.data.longitudeIndex === 0 ? '+' : '-') + that.data.jdS,
        wd: (that.data.latitudeIndex === 0 ? '+' : '-') + that.data.wdS,
        username: that.username
      },
      sh: function (res) {
        wx.hideLoading()
        if (res.data.result === 'success') {
          wx.navigateBack({
            delta: 1
          })
          wx.showToast({
            title: '信息修改成功',
            icon: 'success'
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
  cancelUpdateInfo() {
    wx.navigateBack({
      delta: 1
    })
  },
  onShareAppMessage: function () {
    return {
      path: 'pages/index/index'
    };
  }
})