// pages/cloudController/cloudConList/cloudConList.js
const common = require('../../../utils/common.js');
const tempcomjs = require('../../../template/tempList.js');

Page({
  data: {
    listData: [],
    tableTh: {
      "one": "名称",
      "two": "地址",
      "three": "型号",
      "four": "状态"
    },
    pagesize: 10,
    pageno: 1,
    searchKeyword: '',
    searchTmp: "",
    isFormSearch: true,
    loadingModalHide: false,
    loadingComplete: true,
    startX: 0, //开始坐标
    startY: 0,
    baseUrl:common.baseUrl
  },
  onLoad: function () {
    this.username = wx.getStorageSync('username');
  },
  onShow: function () {
    this.getJdList();
  },
  manageSelf: function (e) {
    var that = this;
    let ykIp = e.target.dataset.ip
    let ykName = e.target.dataset.name
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/cloudController/checkJd',
      data: {
        jdIp: ykIp
      },
      sh: function (res) {
        if (res.data.result === 'success') {
          wx.hideLoading()
          wx.navigateTo({
            url: '../cloudConManage/cloudConManage?ykIp=' + ykIp + '&ykName=' + ykName
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
  updateSelf: function (e) {
    wx.navigateTo({
      url: '/pages/gatewayAdmin/gatewayUpdate/gatewayUpdate?flag=2&name=' + e.target.dataset.name + '&jw=' + e.target.dataset.jw
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
  getJdList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/android/cloudController/getJdList',
      data: {
        page: '{\"curpage\":' + that.data.pageno + ',\"pagesize\":' + that.data.pagesize + ',\"sumcount\":null}',
        values: '{\"ip\":\"' + that.data.searchKeyword + '\",\"key\": \"cl02\",\"order\": \"asc\"}',
        username: that.username
      },
      sh: function (res) {
        wx.hideLoading()
        console.log(res)
        var $info = res.data.rows;
        if ($info.length > 0) {
          var parM = {};
          var list = that.data.listData,
            list1 = [];
          that.data.isFormSearch ? list1 = $info : list1 = list.concat($info);
          parM.listData = list1;
          parM.loadingModalHide = false;
          parM.loadingComplete = true;
          if (list.length == list1.length) {
            parM.loadingModalHide = true;
            parM.loadingComplete = false;
          }
          if (list1.length < that.data.pagesize && that.data.isFormSearch) {
            parM.loadingModalHide = true;
            parM.loadingComplete = false;
          }
          that.setData(parM);
        }
        if ($info.length < that.data.pagesize) {
          that.setData({
            loadingModalHide: true,
            loadingComplete: false,
          })
        }
      }
    })
  },
  keywordSearch: function (e) {
    if (e.detail.value) {
      this.setData({
        isFormSearch: true,
        loadingModalHide: false,
        loadingComplete: true,
        listData: [],
        searchKeyword: e.detail.value,
        searchTmp: e.detail.value
      });
      this.getJdList();
    } else {
      this.setData({
        searchKeyword: ""
      });
      wx.showToast({
        title: '请输入云控制器地址',
        icon: 'none'
      })
    }
  },
  searchScrollLower: function () {
    let that = this;
    if (!that.data.loadingModalHide && that.data.loadingComplete) {
      that.setData({
        isFormSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      that.getJdList();
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.setData({
      isFormSearch: true,
      loadingModalHide: false,
      loadingComplete: true,
      listData: [],
      searchKeyword: e.detail.value,
      searchTmp: e.detail.value
    });
    this.getJdList();
  },
  touchstart: function (e) {
    tempcomjs.touchstart(this, e);
  },
  touchmove: function (e) {
    tempcomjs.touchmove(this, e);
  }
})