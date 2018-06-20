// pages/gatewayAdmin/gatewayManageJd/gatewayManageJd.js
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
    listData:[{
      cl01:"继电器1继电器1",
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
    startY: 0
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
      } else if (self.data.currentChannelIndex === 1){
        console.log(2)
      } else if (self.data.currentChannelIndex === 2) {
        console.log(3)
      }

    }, 1000)
  },
  configSelf:function(e){
    wx.navigateTo({
      url: '../gatewayConfig/gatewayConfig'
    })
  },
  addCgq:function(){
    wx.navigateTo({
      url: '../gatewayAddCgq/gatewayAddCgq'
    })
  },
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    var List=e.currentTarget.dataset.list;//操作的对象
    this.data[List].forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      [List]: this.data[List]
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
    var List = e.currentTarget.dataset.list;//操作的对象
    that.data[List].forEach(function (v, i) {
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
      [List]: that.data[List]
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