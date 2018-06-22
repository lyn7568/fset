// pages/gatewayAdmin/gatewayAddCgq/gatewayAddCgq.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    casArray: [],
    casOptions:{
      a:[
        "红外传感器",
        "光照传感器"
      ],
      b:[
        "红外传感器",
        "光照传感器",
        "自定义传感器1",
        "自定义传感器2",
        "自定义传感器3",
        "自定义传感器4"
      ]
    },
    casIndex: 0,
    casFlag:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      casFlag: options.flag
    })
    if (options.flag==='1'){
      this.setData({
        casArray: this.data.casOptions.a
      })
    } else if(options.flag === '2'){
      this.setData({
        casArray: this.data.casOptions.b
      })
    }
  },
  bindCasPickerChange: function (e) {
    this.setData({
      casIndex: e.detail.value
    })
  }
})