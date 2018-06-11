// pages/gatewayAdmin/gatewayDetail/gatewayDetail.js
const common = require('../../../utils/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    listData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentJdIp: options.jdIp,
      currentWgIp: options.wgIp
    });
    this.username = wx.getStorageSync('username');
    this.getListData();
  },
  getListData() {
    var that = this;
    common.post({
      url: '/android/equipmentManagement/getJdByWgIpAndJdIp',
      data: {
        wgIp: that.data.currentWgIp,
        jdIp: that.data.currentJdIp
      },
      sh: function (res) {
        console.log(res);
        if(res.data.result === 'success'){
          that.setData({
            listData: res.data
          })
        }else{
          wx.showToast({
            title: res.data.result,
            icon: 'none'
          })
        }
      }
    })
  },
  manageJD:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/gatewayAdmin/gatewayManageJd/gatewayManageJd?jdIp=' + that.data.currentJdIp
    })
  },
  updateSelf:function(){
    this.showDialogBtn()
  },
  /**
     * 弹窗
     */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  }
})