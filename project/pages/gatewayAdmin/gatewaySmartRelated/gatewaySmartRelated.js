// pages/gatewayAdmin/gatewaySmartRelated/gatewaySmartRelated.js
const common = require('../../../utils/common.js');
const tempcomjs = require('../../../template/tempList.js');

Page({
  data: {
    numArray: [],
    changelist:[],
    sceneArr:{
      arr:[0,1,2,3,4,5],
      hasCfms:true
    }
  },
  onLoad: function (options) {
    this.setData({
      wgIpNow: options.wgIp,
      jdIpNow: options.jdIp,
      xhNow: options.xh
    });
    this.username = wx.getStorageSync('username');
    this.getSmartRelated()
    this.getShebeiBH()

    let changelist = this.data.changelist;
    let sceneArr = this.data.sceneArr;
    sceneArr.arr.forEach((item, index, array) => {
      if (sceneArr.hasCfms){
        changelist[item] = 'qxz,qxz,qxz,0';
      }else{
        changelist[item] = 'qxz,qxz,qxz';
      }
    });
    this.setData({
      changelist: changelist
    });
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
          if (res.data.code.length > 0) {
            var codeList=[],
              changelist = that.data.changelist
            for (let i = 0; i < res.data.code.length; i++) {
              codeList[i] = res.data.code[i];
              changelist[i] = res.data.code[i];
            }
            that.setData({
              changelist: changelist
            });
            codeList.forEach((item, index, array) => {
              that.selectComponent("#panel" + index).initdata(item)
            });
          }
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
  propChange: function (e) {
    this.data.changelist[e.detail.index] = e.detail.str;
    this.setData({
      changelist: this.data.changelist
    })
  },
  sureSetting: function (e) {
    var that = this;
    let tab = that.data.currentChannelIndex
    let wgIp = that.data.wgIpNow
    let jdIp = that.data.jdIpNow
    let xh = that.data.xhNow
    let changelist = that.data.changelist
    var setVals = []
    for (let i = 0; i < changelist.length; i++){
      var arr = changelist[i].split(',');
      if (arr.length>3){
        setVals[i] = {
          "qxz": arr[0],
          "qxzNode": arr[1],
          "qxzModel": arr[2],
          "cfms": arr[3]
        };
      }else{
        setVals[i] = {
          "qxz": arr[0],
          "qxzNode": arr[1],
          "qxzModel": arr[2]
        };
      }
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/equipmentManagement/panelSettings',
      data: {
        wgIp: wgIp,
        jdIp: jdIp,
        jdqls: xh,
        index: 2,
        value: JSON.stringify(setVals)
      },
      sh: function (res) {
        wx.hideLoading()
        if (res.data.result === 'success') {
          wx.showToast({
            title: '关联设置成功'
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