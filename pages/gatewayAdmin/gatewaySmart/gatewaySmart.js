// pages/gatewayAdmin/gatewaySmart/gatewaySmart.js
const common = require('../../../utils/common.js');
const tempcomjs = require('../../../template/tempList.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    startX: 0, //开始坐标
    startY: 0,
    showModal: false,
    nameS: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wgIpNow: options.wgIp,
      jdIpNow: options.jdIp
    });
    this.username = wx.getStorageSync('username');
    this.getSmartinfo()
  },
  onShow: function () {
    this.getSmartinfo()
  },
  onPullDownRefresh: function (event) {
    var self = this;
    setTimeout(function () {
      wx.stopPullDownRefresh()
      self.getSmartinfo()
    }, 1000)
  },
  getSmartinfo:function(){
    var that = this;
    let wgIp = that.data.wgIpNow
    let jdIp = that.data.jdIpNow
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/equipmentManagement/getPanelKeyList',
      data: {
        wgIp: wgIp,
        jdIp: jdIp
      },
      sh: function (res) {
        wx.hideLoading()
        that.setData({
          listData: res.data
        });
      }
    })
  },
  configSelf: function (e) {
    var that = this;
    let wgIp = that.data.wgIpNow
    let jdIp = that.data.jdIpNow
    let xh = e.target.dataset.id
    common.post({
      url: '/equipmentManagement/panelKeyCf',
      data: {
        wgIp: wgIp,
        jdIp: jdIp,
        xh: xh
      },
      sh: function (res) {
        if (res.data.result === 'success') {
          wx.showToast({
            title: '操作成功'
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
  contactSelf:function(e){
    var that = this;
    let wgIp = that.data.wgIpNow
    let jdIp = that.data.jdIpNow
    let xh = e.target.dataset.id
    wx.navigateTo({
      url: '../gatewaySmartRelated/gatewaySmartRelated?xh=' + xh +'&wgIp=' + wgIp + '&jdIp=' + jdIp
    })
  },
  touchstart: function (e) {
    tempcomjs.touchstart(this,e);
  },
  touchmove: function (e) {
    tempcomjs.touchmove(this, e);
  },

  updateSelf: function (e) {
    this.showDialogBtn()
    this.setData({
      updateId: e.currentTarget.dataset.id,
      updateName: e.currentTarget.dataset.name,
      updateState: true,
      nameS: e.currentTarget.dataset.name
    })
  },
  tapName: function (e) {
    if (e.detail.value !== this.data.updateName) {
      this.setData({
        updateState: false
      })
    } else {
      this.setData({
        updateState: true
      })
    }
    this.setData({
      nameS: e.detail.value
    })
  },
  showDialogBtn: function () {
    tempcomjs.showDialogBtn(this)
  },
  hideModal: function () {
    tempcomjs.hideModal(this)
  },
  onConfirm: function () {
    var that = this;
    let wgIp = that.data.wgIpNow
    let jdIp = that.data.jdIpNow
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/android/equipmentManagement/editName',
      data: {
        wgIp: wgIp,
        jdIp: jdIp,
        ip: that.data.updateId,
        type: 'key',
        name: that.data.nameS,
        username: that.username
      },
      sh: function (res) {
        wx.hideLoading()
        if (res.data.result === 'success') {
          that.hideModal();
          wx.showToast({
            title: '信息修改成功',
            icon: 'success'
          })
          that.getSmartinfo();
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