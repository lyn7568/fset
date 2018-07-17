const common = require('../../../utils/common.js');
const tempcomjs = require('../../../template/tempList.js');

Page({
  data: {
    navbarArray: [{
      text: '传感器管理',
      active: 'nav-active'
    }, {
      text: '电能表管理'
    }],
    array: [0, 1],
    currentChannelIndex: 0,
    listDataD: [],
    listDataC: [],
    startX: 0, //开始坐标
    startY: 0
  },
  onLoad: function (options) {
    this.setData({
      wgIpNow: options.wgIp,
      jdIpNow: options.jdIp
    });
    this.username = wx.getStorageSync('username');
  },
  onShow: function () {
    this.getSensorinfo()
  },
  onPullDownRefresh: function (event) {
    var self = this;
    setTimeout(function () {
      wx.stopPullDownRefresh()
      self.getSensorinfo()
    }, 1000)
  },
  getSensorinfo: function () {
    var that = this;
    let wgIp = that.data.wgIpNow
    let jdIp = that.data.jdIpNow
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/android/sensor/getModelList',
      data: {
        wgIp: wgIp,
        jdIp: jdIp,
        username:that.username
      },
      sh: function (res) {
        wx.hideLoading()
        that.setData({
          listDataC: res.data.cgq,
          listDataD: res.data.dnt,
          ifShowDnAdd: res.data.show
        });
      }
    })
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
  addCgq: function () {
    wx.navigateTo({
      url: '../gatewayAddCgq/gatewayAddCgq?flag=2&jdIp=' + this.data.jdIpNow + '&wgIp=' + this.data.wgIpNow
    })
  },
  addDnb: function () {
    wx.navigateTo({
      url: '../gatewayAddDnb/gatewayAddDnb?jdIp=' + this.data.jdIpNow + '&wgIp=' + this.data.wgIpNow
    })
  },
  delDnb: function () {
    var that = this;
    let wgIp = that.data.wgIpNow
    let jdIp = that.data.jdIpNow
    wx.showModal({
      title: '提示',
      content: '确定要删除吗?',
      success: function (res) {
        if (res.confirm) {
          common.post({
            url: '/sensor/deleteDnt',
            data: {
              wgIp: wgIp,
              jdIp: jdIp
            },
            sh: function (res) {
              if (res.data.result === 'success') {
                wx.showToast({
                  title: '删除成功'
                })
                that.getSensorinfo()
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
  configSelf: function (e) {
    var that = this;
    let wgIp = that.data.wgIpNow
    let jdIp = that.data.jdIpNow
    // let xh = e.target.dataset.id
    // common.post({
    //   url: '/equipmentManagement/panelKeyCf',
    //   data: {
    //     wgIp: wgIp,
    //     jdIp: jdIp,
    //     xh: xh
    //   },
    //   sh: function (res) {
    //     if (res.data.result === 'success') {
    //       wx.showToast({
    //         title: '控制按键' + xh
    //       })
    //     } else {
    //       wx.showToast({
    //         title: res.data.result,
    //         icon: 'none'
    //       })
    //     }
    //   }
    // })
  },
  delSelf: function (e) {
    var that =this
    var cgqId = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定要删除吗?',
      success: function (res) {
        if (res.confirm) {
          common.post({
            url: '/sensor/deleteCgq',
            data: {
              id: cgqId
            },
            sh: function (res) {
              if (res.data.result === 'success') {
                wx.showToast({
                  title: '删除成功'
                })
                that.getSensorinfo()
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
  touchstart: function (e) {
    tempcomjs.touchstart(this, e);
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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/sensor/editName',
      data: {
        id: that.data.updateId,
        name: that.data.nameS
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
  },
  onShareAppMessage: function () {
    return {
      path: 'pages/index/index'
    };
  }
})