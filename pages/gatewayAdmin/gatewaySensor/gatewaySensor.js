// pages/gatewayAdmin/gatewaySensor/gatewaySensor.js
const common = require('../../../utils/common.js');
const tempcomjs = require('../../../template/tempList.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarArray: [{
      text: '传感器管理',
      active: 'nav-active'
    }, {
      text: '电能表管理'
    }],
    array: [0, 1],
    currentChannelIndex: 0,
    listData: [{
      cl01: "继电器1继电器1",
      cl02: "继电器1"
    }],
    listData3: [{
      cl01: "红外",
      cl02: "红外传感器",
      cl03: "正常",
      cl04: "空闲模式",
    }],
    startX: 0, //开始坐标
    startY: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onTapNavbar: function (e) {
    this.switchChannel(parseInt(e.currentTarget.id));
  },
  switchChannel: function (targetChannelIndex) {
    let navbarArray = this.data.navbarArray;
    navbarArray.forEach((item, index, array) => {
      item.active = '';
      if (index == targetChannelIndex) {
        item.active = 'nav-active';
      }
    });
    this.setData({
      navbarArray: navbarArray,
      currentChannelIndex: targetChannelIndex
    });
    // this.search(targetChannelIndex);
  },
  touchstart: function (e) {
    tempcomjs.touchstart(this, e);
  },
  touchmove: function (e) {
    tempcomjs.touchmove(this, e);
  },
  addCgq: function () {
    wx.navigateTo({
      url: '../gatewayAddCgq/gatewayAddCgq?flag=2'
    })
  },
  addDnb: function () {
    wx.navigateTo({
      url: '../gatewayAddDnb/gatewayAddDnb'
    })
  }
})