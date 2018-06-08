// pages/gatewayAdmin/gatewayList/gatewayList.js
const common = require('../../../utils/common.js');

Page({
  data: {
    casArray: [],
    casId:'',
    casIndex: 0,
    listData: {}
  },
  onLoad: function () {
    this.username = wx.getStorageSync('username');
    this.getCasArray();
    console.log(this.data);
  },
  getCasArray:function(){
    var that = this;
    common.post({
      url: '/android/equipmentManagement/getEquitNameList',
      data: {
        username: this.username
      },
      sh: function (res) {
        that.setData({
          casArray: res.data[0].name,
          casId: res.data[0].name[0].id
        })
        that.getListData(res.data[0].name[0].id);
      }
    })
  },
  bindCasPickerChange: function (e) {
    console.log(e)
    this.setData({
      casIndex: e.detail.value,
      casId: e.target.dataset.casid
    })
    this.getListData(e.target.dataset.casid);
  },
  getListData(id){
    var that = this;
    common.post({
      url: '/android/equipmentManagement/equipmentList',
      data: {
        ip:id,
        username: this.username
      },
      sh: function (res) {
        that.setData({
          listData: res.data[0]
        })
      }
    })
  },
  delSelf: function () {
    wx.showModal({
      title: '提示',
      content: '确定要删除该设备吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  updateSelf: function () {
    wx.navigateTo({
      url: '/pages/gatewayAdmin/gatewayUpdate/gatewayUpdate'
    })
  },
  getSelfMap: function () {

  },
  goToJiedian: function (e) {
    wx.navigateTo({
      url: '/pages/gatewayAdmin/gatewayManage/gatewayManage?id=' + e.target.dataset.ip
    })
  }
})