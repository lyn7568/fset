// pages/gatewayAdmin/gatewayDetail/gatewayDetail.js
const common = require('../../../utils/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    listData:[],
    nameS:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentJdIp: options.jdIp,//节点ip
      currentWgIp: options.wgIp//网关ip
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
            listData: res.data,
            nameS: res.data.cl01
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
  updateSelf:function(){
    this.showDialogBtn()
  },
  tapName: function (e) {
    this.setData({
      nameS: e.detail.value
    })
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
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/android/equipmentManagement/editName',
      data: {
        type: 'jd',
        name: that.data.nameS,
        ip: that.data.currentJdIp,
        pid: that.data.currentWgIp,
        username: that.username
      },
      sh: function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.data.result === 'success') {
          that.hideModal();
          wx.showToast({
            title: '信息修改成功',
            icon: 'success'
          })
          that.getListData();
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