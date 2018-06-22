// pages/gatewayAdmin/gatewaySmart/gatewaySmart.js
const common = require('../../../utils/common.js');
const tempcomjs = require('../../../template/tempList.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [{
      cl01: "按键1",
      cl02: "1",
      cl03: "按键1"
    }],
    startX: 0, //开始坐标
    startY: 0,
    showModal: false,
    nameS: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  contactSelf:function(e){
      // let jdIp = e.target.dataset.ip
      wx.navigateTo({
        url: '../gatewaySmartRelated/gatewaySmartRelated'
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
  },
  tapName: function (e) {
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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // common.post({
    //   url: '/android/equipmentManagement/editName',
    //   data: {
    //     type: 'jd',
    //     name: that.data.nameS,
    //     ip: that.data.currentJdIp,
    //     pid: that.data.currentWgIp,
    //     username: that.username
    //   },
    //   sh: function (res) {
    //     console.log(res)
    //     wx.hideLoading()
    //     if (res.data.result === 'success') {
    //       that.hideModal();
    //       wx.showToast({
    //         title: '信息修改成功',
    //         icon: 'success'
    //       })
    //       that.getListData();
    //     } else {
    //       wx.showToast({
    //         title: res.data.result,
    //         icon: 'none'
    //       })
    //     }
    //   }
    // })
  }
})