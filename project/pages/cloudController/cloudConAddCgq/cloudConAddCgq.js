const common = require('../../../utils/common.js');

Page({
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
      casFlag: options.flag,
      jdIpNow: options.jdIp
    })
    this.username = wx.getStorageSync('username');
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
  addEquipment:function(){
    var that = this;
    let jdIp = that.data.jdIpNow
    let casFlag = that.data.casFlag
    if (!that.data.eqName) {
      wx.showToast({
        title: '名称不能为空',
        icon: 'none'
      })
      return
    }
    var url='',dataS={}
    if (casFlag==='1'){
      url = '/android/crelay/addCgq';
      dataS = {
        jdIp: jdIp,
        name: that.data.eqName,
        type: parseInt(that.data.casIndex) + 1,
        username: that.username
      }
    }
    common.post({
      url: url,
      data: dataS,
      sh: function (res) {
        console.log(res);
        if (res.data.result === 'success') {
          wx.showToast({
            title: '添加成功'
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
  }
})