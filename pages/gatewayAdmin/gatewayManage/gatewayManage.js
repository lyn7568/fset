// pages/gatewayAdmin/gatewayManage/gatewayManage.js
// const common = require('../../../utils/common.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listData: [
      { "code": "电饭锅", "text": "回复的", "type": "发鬼地方" },
      { "code": "电饭锅", "text": "回复的", "type": "发鬼地方" },
      { "code": "电饭锅", "text": "回复的", "type": "发鬼地方" },
      { "code": "电饭锅", "text": "回复的", "type": "发鬼地方" },
      { "code": "电饭锅", "text": "回复的", "type": "发鬼地方" },
      { "code": "电饭锅", "text": "回复的", "type": "发鬼地方" },
      { "code": "电饭锅", "text": "回复的", "type": "发鬼地方" },
    ],
    tableTh: {
      "one": "节点名称",
      "two": "节点地址"
    },
    scrollTop: 100,
    navbarArray: [{
      text: '开关模块',
      type: 'navbar-item-active'
    }, {
      text: '智能面板',
      type:''
    }, {
      text: '传感器模块',
      type: ''
    }, {
      text: '调光面板',
      type: ''
    }],
    array: [0, 1, 2, 3],
    currentChannelIndex: 0,
    rows: 10,
    conList: [],//所有内容列表
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
    if (options.key) {
      this.setData({
        searchKeyword: options.key,
        searchTmp: options.key
      });
    }
    this.scrollLeftNav(0)
    this.switchChannel(0);
    console.log(this.data)
  },

  onTapNavbar: function (e) {
    this.switchChannel(parseInt(e.currentTarget.id));
    this.scrollLeftNav(parseInt(e.currentTarget.id));
  },
  scrollLeftNav: function (tabid) {
    // if (tabid > 2) {
    //   this.setData({
    //     scrollNavbarLeft: 300
    //   })
    // } else {
    //   this.setData({
    //     scrollNavbarLeft: 0
    //   })
    // }
  },
  switchChannel: function (targetChannelIndex) {
    let navbarArray = this.data.navbarArray;
    navbarArray.forEach((item, index, array) => {
      item.type = '';
      if (index == targetChannelIndex) {
        item.type = 'navbar-item-active';
      }
    });
    this.setData({
      searchKeyword: this.data.searchTmp,
      navbarArray: navbarArray,
      currentChannelIndex: targetChannelIndex,
      isFormSearch: true,
      loadingModalHide: false,
      loadingComplete: true,
      conList: [],
    });
    this.search(targetChannelIndex);
  },
  search: function (index) {
    var that = this;
    
    // common.get({
    //   url: url,
    //   data: dataStr,
    //   sh: function (res) {
    //     var $info = res;
    //     if ($info.length > 0) {
          
    //       that.watchobjFun($info, typeC, "conList", { num: 0 })
    //     }

    //     if ($info.length < rows) {
    //       that.setData({
    //         loadingModalHide: true,
    //         loadingComplete: false,
    //       })
    //     }

    //   }
    // })
  },
  keywordSearch: function (e) {
    // console.log(e)
    if (e.detail.value) {
      this.setData({
        isFormSearch: true,
        loadingModalHide: false,
        loadingComplete: true,
        conList: [],
        searchKeyword: e.detail.value,
        searchTmp: e.detail.value
      });
      this.search(this.data.currentChannelIndex);
    } else {
      this.setData({
        searchKeyword: ""
      });
      wx.showToast({
        title: '请输入关键词',
        icon: 'none',
        duration: 2000
      })
    }
  },
  searchScrollLower: function () {
    let that = this;
    if (!that.data.loadingModalHide && that.data.loadingComplete) {
      that.setData({
        isFormSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      that.search(this.data.currentChannelIndex);
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  // watchobjFun: function (daStr, typeC, str, ref) {
  //   var that = this,
  //     rows = that.data.rows
  //   if (typeC) {
  //     queryInfo.queryAuthInfo(daStr, typeC, str, ref, function (that, param) {
  //       var list = that.data[str],
  //         list1 = []
  //       that.data.isFormSearch ? list1 = daStr : list1 = list.concat(param[str]);
  //       param[str] = list1;
  //       param.loadingModalHide = false;
  //       param.loadingComplete = true;
  //       if (list.length == list1.length) {
  //         param.loadingModalHide = true;
  //         param.loadingComplete = false;
  //       }
  //       if (list1.length < rows && that.data.isFormSearch) {
  //         param.loadingModalHide = true;
  //         param.loadingComplete = false;
  //       }
  //       that.setData(param);
  //     })
  //   } else {
  //     var parM = {};
  //     var list = that.data[str],
  //       list1 = [];
  //     that.data.isFormSearch ? list1 = daStr : list1 = list.concat(daStr);
  //     parM[str] = list1;
  //     parM.loadingModalHide = false;
  //     parM.loadingComplete = true;
  //     if (list.length == list1.length) {
  //       parM.loadingModalHide = true;
  //       parM.loadingComplete = false;
  //     }
  //     if (list1.length < rows && that.data.isFormSearch) {
  //       parM.loadingModalHide = true;
  //       parM.loadingComplete = false;
  //     }
  //     that.setData(parM);
  //   }
  // },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.listData.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      listData: this.data.listData
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.listData.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      listData: that.data.listData
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  }
})