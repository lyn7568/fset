// pages/gatewayAdmin/gatewayNode/gatewayNode.js
const common = require('../../../utils/common.js');
const tempcomjs = require('../../../template/tempList.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    tableTh: {
      "one": "名称",
      "two": "地址",
      "three": "类型",
      "four": "状态"
    },
    scrollTop: 100,
    navbarArray: [{
      text: '开关模块',
      active: 'navbar-item-active',
      type:'kg'
    }, {
      text: '智能面板',
      type:'znpanel'
    }, {
      text: '传感器模块',
      type: 'cgq'
    }, {
      text: '调光面板',
      type: 'tgpanel'
    }],
    array: [0, 1, 2, 3],
    navbarType:'kg',
    currentChannelIndex: 0,
    pagesize: 10,
    pageno:1,
    searchKeyword: '',
    searchTmp: "",
    isFormSearch: true,
    loadingModalHide: false,
    loadingComplete: true,
    startX: 0, //开始坐标
    startY: 0,
    updateState:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wgIdNow: options.id
    });
    this.switchChannel(0);
    this.username = wx.getStorageSync('username');
  },
  manageSelf: function (e) {
    var that = this;
    let navbarType = that.data.navbarType
    let wgIp = that.data.wgIdNow
    let jdIp = e.target.dataset.ip
    let jdName = e.target.dataset.name
    var jdType=''
    if (navbarType === 'kg') {
      jdType = '继电器'
    } else if (navbarType === 'znpanel') {
      jdType = '触摸面板'
    } else if (navbarType === 'cgq') {
      jdType = '传感器'
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/equipmentManagement/checkJd',
      data: {
        wgIp: wgIp,
        jdIp: jdIp,
        jdType: jdType
      },
      sh: function (res) {
        console.log(res)
        if(res.data.result === 'success'){
          wx.hideLoading()
          if (navbarType === 'kg') {
            wx.navigateTo({
              url: '../gatewayManageJd/gatewayManageJd?jdIp=' + jdIp + '&wgIp=' + wgIp + '&jdName=' + jdName
            })
          } else if (navbarType === 'znpanel') {
            wx.navigateTo({
              url: '../gatewaySmart/gatewaySmart?jdIp=' + jdIp + '&wgIp=' + wgIp
            })
          } else if (navbarType === 'cgq') {
            wx.navigateTo({
              url: '../gatewaySensor/gatewaySensor?jdIp=' + jdIp + '&wgIp=' + wgIp
            })
          }
        }else{
          wx.showToast({
            title: res.data.result,
            icon: 'none'
          })
        }
        
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
        item.active = 'navbar-item-active';
      }
    });
    this.setData({
      searchKeyword: this.data.searchTmp,
      navbarArray: navbarArray,
      navbarType: navbarArray[targetChannelIndex].type,
      currentChannelIndex: targetChannelIndex,
      isFormSearch: true,
      loadingModalHide: false,
      loadingComplete: true,
      listData: [],
    });
    this.getJdList(targetChannelIndex);
  },
  getJdList: function (index) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let navbarArray = this.data.navbarArray;
    common.post({
      url: '/equipmentManagement/getJdList',
      data: {
        page: '{\"curpage\":' + that.data.pageno + ',\"pagesize\":' + that.data.pagesize + ',\"sumcount\":null}',
        values: '{\"pid\":\"' + that.data.wgIdNow + '\",\"ip\":\"' + that.data.searchKeyword + '\",\"key\": \"cl02\",\"order\": \"asc\",\"type\": \"' + navbarArray[index].type + '\"}',
        fields: '[]'
      },
      sh: function (res) {
        wx.hideLoading()
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
     console.log(e)
    if (e.detail.value) {
      this.setData({
        isFormSearch: true,
        loadingModalHide: false,
        loadingComplete: true,
        listData: [],
        searchKeyword: e.detail.value,
        searchTmp: e.detail.value
      });
      this.getJdList(this.data.currentChannelIndex);
    } else {
      this.setData({
        searchKeyword: ""
      });
      wx.showToast({
        title: '请输入节点地址',
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
      that.getJdList(that.data.currentChannelIndex);
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
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
      updateId: e.currentTarget.dataset.ip,
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
      url: '/android/equipmentManagement/editName',
      data: {
        type: 'jd',
        pid: that.data.wgIdNow,
        username: that.username,
        ip: that.data.updateId,
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
          that.getJdList(that.data.currentChannelIndex);
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