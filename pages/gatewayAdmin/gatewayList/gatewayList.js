// pages/gatewayAdmin/gatewayList/gatewayList.js
const common = require('../../../utils/common.js');

Page({
  data: {
    casArray: [],
    casIndex: 0,
    listData: ''
  },
  onLoad: function () {
    this.username = wx.getStorageSync('username');
    this.getCasArray();
    console.log(this.data);
  },
  onShow: function () {
    this.getCasArray();
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
          listData:'',
          casArray: res.data[0].name
        })
        that.getListData(res.data[0].name[0].id);
      }
    })
  },
  bindCasPickerChange: function (e) {
    this.setData({
      casIndex: e.detail.value
    })
    let selectId = this.data.casArray[e.detail.value].id;
    this.getListData(selectId);
  },
  getListData(id){
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/android/equipmentManagement/equipmentList',
      data: {
        ip:id,
        username: this.username
      },
      sh: function (res) {
        wx.hideLoading()
        that.setData({
          listData: res.data[0]
        })
      }
    })
  },
  delSelf: function (e) {
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
  updateSelf: function (e) {
    wx.navigateTo({
      url: '/pages/gatewayAdmin/gatewayUpdate/gatewayUpdate?id=' + e.target.dataset.ip
    })
  },
  getSelfMap: function () {
    var that = this;
    if (that.data.listData.cl06){
      let jwd = that.data.listData.cl06.split(',');
      let jdS = '', wdS = '';
      if (jwd[0] >= 0) {
        jdS = jwd[0];
      } else {
        jdS = jwd[0].substring(1, jwd[0].length())
      }
      if (jwd[1] >= 0) {
        wdS = jwd[1]
      } else {
        wdS = jwd[1].substring(1, jwd[1].length())
      }
      wx.navigateTo({
        url: '/pages/getLocationMap/getLocationMap?jdS=' + jdS + '&wdS=' + wdS
      })
    }
  },
  goToJiedian: function (e) {
    let jieDianIp = e.target.dataset.ip
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // common.post({
    //   url: '/equipmentManagement/getCheckEsn',
    //   data: {
    //     ip: jieDianIp
    //   },
    //   sh: function (res) {
    //     console.log(res)
    //     wx.hideLoading()
    //     if (res.data.result === 'success') {
          wx.navigateTo({
            url: '/pages/gatewayAdmin/gatewayManage/gatewayManage?id=' + jieDianIp
          })
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