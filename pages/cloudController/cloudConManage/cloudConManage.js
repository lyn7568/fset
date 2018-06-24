const common = require('../../../utils/common.js');
const tempcomjs = require('../../../template/tempList.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarArray: [{
      text: '通用管理',
      active: 'nav-active'
    }, {
      text: '继电器管理'
    }, {
      text: '传感器管理'
    }],
    array: [0, 1, 2],
    currentChannelIndex: 0,
    listData: [{
      cl01: "继电器1继电器1",
      cl02: "继电器1",
      cl03: "关闭",
      cl04: "空闲模式",
    }],
    listData3: [{
      cl01: "红外",
      cl02: "红外传感器",
      cl03: "正常",
      cl04: "空闲模式",
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
  onTapNavbar: function (e) {
    this.switchChannel(parseInt(e.currentTarget.dataset.index));
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
  onPullDownRefresh: function (event) {
    var self = this;
    setTimeout(function () {
      wx.stopPullDownRefresh()

      if (self.data.currentChannelIndex === 0) {
        console.log(1)
      } else if (self.data.currentChannelIndex === 1) {
        console.log(2)
      } else if (self.data.currentChannelIndex === 2) {
        console.log(3)
      }

    }, 1000)
  },
  checkTimeSelf: function (e) {
    console.log('当前时间')
  },
  configSelf: function (e) {
    wx.navigateTo({
      url: '../gatewayConfig/gatewayConfig'
    })
  },
  addCgq: function () {
    wx.navigateTo({
      url: '../gatewayAddCgq/gatewayAddCgq?flag=1'
    })
  },
  delSelf: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
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