// pages/gatewayAdmin/gatewayManageJd/gatewayManageJd.js
const common = require('../../../utils/common.js');
const util = require('../../../utils/util.js');
const tempcomjs = require('../../../template/tempList.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarArray: [{
      text: '通用管理',
      active: 'nav-active',
      type:'ty'
    }, {
      text: '继电器管理',
      type: 'jdq'
    }, {
      text: '传感器管理',
      type: 'cgq'
    }],
    array: [0, 1, 2],
    currentChannelIndex: 0,
    listData:'',
    listData2:[],
    listData3: [],
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
      jdIpNow: options.jdIp,
      jdNameNow: options.jdName,
      refreshTime:util.formatTime(new Date())
    });
    this.username = wx.getStorageSync('username');
  },
  onShow: function () {
    this.getCommonInfo();
    this.getListOther();
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
        self.getCommonInfo();
      } else{
        self.getListOther()
      }
    }, 1000)
  },
  checkTimeSelf: function (e) {
    var that = this;
    let wgIp = that.data.wgIpNow
    let jdIp = that.data.jdIpNow
    let time = util.formatTime((new Date()), 1)
    common.post({
      url: '/relay/timeCheck',
      data: {
        wgIp: wgIp,
        jdIp: jdIp,
        time: time
      },
      sh: function (res) {
        if (res.data.result === 'success') {
          wx.showToast({
            title: '校准成功！'
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
  getCommonInfo:function(){
    var that = this;
    let wgIp = that.data.wgIpNow
    let jdIp = that.data.jdIpNow
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/relay/getTyModelList',
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
  getListOther: function () {
    var that = this;
    let wgIp = that.data.wgIpNow
    let jdIp = that.data.jdIpNow
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/android/relay/getModelList',
      data: {
        wgIp: wgIp,
        jdIp: jdIp,
        username: that.username
      },
      sh: function (res) {
        wx.hideLoading()
        var arrLi=[],arrLi1 =[], arrLi2=[];
        if (res.data.gz !== 'null'){
            res.data.gz.cltype = 'gz';
            arrLi1.push(res.data.gz);
        }
        if (res.data.hw !== 'null') {
          res.data.hw.cltype = 'hw';
          arrLi2.push(res.data.hw);
        }
        arrLi = arrLi1.concat(arrLi2)
        that.setData({
          someList: res.data,
          listData2: res.data.jdq,
          listData3: arrLi
        });
      }
    })
  },
  configSelf:function(e){
    let tabTy = this.data.navbarArray[this.data.currentChannelIndex].type
    if (tabTy==='ty'){
      wx.navigateTo({
        url: '../gatewayConfig/gatewayConfig?ty=1&wgIp=' + this.data.wgIpNow + '&jdIp=' + this.data.jdIpNow
      })
    } else if(tabTy === 'jdq'){
      let clid = e.currentTarget.dataset.id
      let clState = e.currentTarget.dataset.state
      wx.navigateTo({
        url: '../gatewayConfig/gatewayConfig?clId=' + clid + '&wgIp=' + this.data.wgIpNow + '&jdIp=' + this.data.jdIpNow + '&clState=' + clState
      })
    } else if (tabTy === 'cgq') {
      let cltype = e.currentTarget.dataset.tl
      wx.navigateTo({
        url: '../gatewayConfigOther/gatewayConfigOther?ty=' + cltype +'&wgIp=' + this.data.wgIpNow + '&jdIp=' + this.data.jdIpNow
      })
    } 
  },
  addCgq:function(){
    wx.navigateTo({
      url: '../gatewayAddCgq/gatewayAddCgq?flag=1&jdIp=' + this.data.jdIpNow + '&wgIp=' + this.data.wgIpNow
    })
  },
  delSelf: function (e) {
    var cgqId = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定要删除吗?',
      success: function (res) {
        if (res.confirm) {
          common.post({
            url: '/android/relay/deleteCgq',
            data: {
              id: cgqId,
              username: that.username
            },
            sh: function (res) {
              if (res.data.result === 'success') {
                wx.showToast({
                  title: '删除成功'
                })
                that.getListOther();
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
    }else{
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
      url: '/relay/editName',
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
          that.getListOther();
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