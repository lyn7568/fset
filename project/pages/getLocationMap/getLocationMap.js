const common = require('../../utils/common.js');

Page({
  data: {
    height: 'auto'
  },
  onLoad: function (options) {
    var that = this
    that.username = wx.getStorageSync('username');
    that.setData({
      currentWgIp: options.wgip,
      latitude: options.wdS,
      longitude: options.jdS
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
    that.setMapmarkers();
  },
  setMapmarkers:function(){
    var that = this
    common.post({
      url: '/android/equipmentManagement/equipmentList',
      data: {
        ip: that.data.currentWgIp,
        username: this.username
      },
      sh: function (res) {
        let $info = res.data[0];
        that.setData({
          markers: [{
            id: 0,
            latitude: that.data.latitude,
            longitude: that.data.longitude,
            callout: {
              content: "名称：" + $info.cl01 + "\n地址：" + $info.cl02 + "\n设备类型：" + $info.cl03 + "\n设备型号：" + $info.cl04 + "\n状态：" + $info.cl05 + "\n位置：" + $info.cl07,
              color: "#333333",
              fontSize: 15,
              borderRadius: 10,
              bgColor: "#ffffff",
              padding: 10,
              textAlign: "left",
              display: "BYCLICK"
            }
          }]
        })
      }
    })
    
    
  },
  onShareAppMessage: function () {
    return {
      path: 'pages/index/index'
    };
  }
})