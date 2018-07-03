// pages/gatewayAdmin/gatewaySmartRelated/gatewaySmartRelated.js
const common = require('../../../utils/common.js');
const tempcomjs = require('../../../template/tempList.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    casArray: { //模式
      scene: ['反转', '吸合', '释放', '点动']
    },
    casIndex: { //模式index
      scene: [0, 0, 0, 0, 0, 0]
    },
    numPlaceh: '请选择',
    numArray: [ //编号
      "请选择",
      "1",
      "2"
    ],
    jiedianArr: {},//节点
    jiedianArrIndex: 0,
    anjianArr: {},//按键
    anjianArrIndex: 0,
    numIndex: { //编号index
      scene: [
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wgIpNow: options.wgIp,
      jdIpNow: options.jdIp,
      xhNow: options.xh
    });
    this.username = wx.getStorageSync('username');
    this.getSmartRelated()
  },
  getSmartRelated: function () {
    var that = this;
    let wgIp = that.data.wgIpNow
    let jdIp = that.data.jdIpNow
    let xh = that.data.xhNow
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/equipmentManagement/readPanelSettings',
      data: {
        wgIp: wgIp,
        jdIp: jdIp,
        index: xh
      },
      sh: function (res) {
        wx.hideLoading()
        if (res.data.result === 'success') {
          
        } else {
          wx.showToast({
            title: res.data.result,
            icon: 'none'
          })
        }
      }
    })
  },
  getShebeiBH: function () {
    tempcomjs.getShebeiBH(this)
  },
  bindSnum: function (e) { //选择设备
    tempcomjs.bindSnum(this, e)
  },
  bindJiedian: function (e) {
    tempcomjs.bindJiedian(this, e)
  },
  bindAnjian: function (e) {
    tempcomjs.bindAnjian(this, e)
  },
  bindCmodel: function (e) {
    tempcomjs.bindCmodel(this, e)
  }
})