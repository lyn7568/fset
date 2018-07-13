const common = require('../../../utils/common.js');
const tempcomjs = require('../../../template/tempList.js');

Page({
  data: {
    casArray: [],
    casIndex: 0,
    listData: ''
  },
  onLoad: function () {
    this.username = wx.getStorageSync('username');
  },
  onShow: function () {
    this.setData({
      casIndex: 0
    })
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
          listData:'',
          casArray: res.data[0].name
        })
        that.getCheckEsn(res.data[0].name[0].id);
      }
    })
  },
  bindCasPickerChange: function (e) {
    this.setData({
      casIndex: e.detail.value
    })
    let selectId = this.data.casArray[e.detail.value].id;
    this.getCheckEsn(selectId);
  },
  getCheckEsn(id){
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/equipmentManagement/getCheckEsn',
      data: {
        ip: id
      },
      sh: function (res) {
        wx.hideLoading()
        that.getListData(id);
      }
    })
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
  delSelf: function (e) {
    this.showDialogBtn()
    this.setData({
      updateId: e.currentTarget.dataset.ip,
      updateState: true
    })
  },
  tapName: function (e) {
    if (e.detail.value !== '') {
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
    wx.showModal({
      title: '提示',
      content: '确定要删除吗?',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          common.post({
            url: '/android/equipmentManagement/deleteWg',
            data: {
              username: that.username,
              ip: that.data.updateId,
              password: that.data.nameS
            },
            sh: function (res) {
              wx.hideLoading()
              if (res.data.result === 'success') {
                that.hideModal();
                wx.showToast({
                  title: '删除成功',
                  icon: 'success'
                })
                that.getCasArray();
              } else {
                wx.showToast({
                  title: res.data.result,
                  icon: 'none'
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  updateSelf: function (e) {
    wx.navigateTo({
      url: '../gatewayUpdate/gatewayUpdate?flag=1&name=' + e.target.dataset.name + '&jw=' + e.target.dataset.jw
    })
  },
  getSelfMap: function (e) {
    var that = this;
    if (that.data.listData.cl06){
      let jwd = that.data.listData.cl06.split(',');
      let jdS = '', wdS = '';
      jdS = jwd[0];
      wdS = jwd[1];
      wx.navigateTo({
        url: '/pages/getLocationMap/getLocationMap?jdS=' + jdS + '&wdS=' + wdS + '&wgip=' + e.target.dataset.ip
      })
    }
  },
  goToJiedian: function (e) {
    let WgIp = e.target.dataset.ip
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/android/equipmentManagement/getNodeList',
      data: {
        ip: WgIp
      },
      sh: function (res) {
        wx.hideLoading()
        wx.navigateTo({
          url: '../gatewayNode/gatewayNode?id=' + WgIp
        })
      }
    })

  },
  onPullDownRefresh: function (event) {
    var self = this;
    setTimeout(function () {
      wx.stopPullDownRefresh()
      self.setData({
        Complete: true
      })
      self.data.casIndex= 0
      self.getCasArray();
    })
  }
})