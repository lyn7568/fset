// pages/cloudController/cloudConList/cloudConList.js
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
      "two": "地址"
    },
    pagesize: 10,
    pageno: 1,
    searchKeyword: '',
    searchTmp: "",
    isFormSearch: true,
    loadingModalHide: false,
    loadingComplete: true,
    startX: 0, //开始坐标
    startY: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currendId: options.id
    });
    this.switchChannel(0);
    console.log(this.data)
  },
  manageSelf: function (e) {
    wx.navigateTo({
      url: '.. /cloudConManage/cloudConManage?ykIp=' + e.target.dataset.ip
    })

  },

  switchChannel: function (targetChannelIndex) {
    this.setData({
      searchKeyword: this.data.searchTmp,
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
    // common.post({
    //   url: '/equipmentManagement/getJdList',
    //   data: {
    //     
    //   },
    //   sh: function (res) {
    //     wx.hideLoading()
    //     console.log(res)
    //     var $info = res.data.rows;
    //     if ($info.length > 0) {
    //       var parM = {};
    //       var list = that.data.listData,
    //         list1 = [];
    //       that.data.isFormSearch ? list1 = $info : list1 = list.concat($info);
    //       parM.listData = list1;
    //       parM.loadingModalHide = false;
    //       parM.loadingComplete = true;
    //       if (list.length == list1.length) {
    //         parM.loadingModalHide = true;
    //         parM.loadingComplete = false;
    //       }
    //       if (list1.length < that.data.pagesize && that.data.isFormSearch) {
    //         parM.loadingModalHide = true;
    //         parM.loadingComplete = false;
    //       }
    //       that.setData(parM);
    //     }
    //     if ($info.length < that.data.pagesize) {
    //       that.setData({
    //         loadingModalHide: true,
    //         loadingComplete: false,
    //       })
    //     }
    //   }
    // })
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
  }
})