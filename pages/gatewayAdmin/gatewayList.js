// pages/gatewayAdmin/gatewayList.js
const common = require('../../utils/common.js');

Page({
  data: {
    casArray: [
       {
          mc: '测试',
          id: '12345677'
        },
        {
        mc: '测试1',
        id: '12345733'
      }
    ],
    casIndex: 0,
    listData: [
      { "code": "01", "text": "text1", "type": "type1" },
      { "code": "02", "text": "text2", "type": "type2" },
      { "code": "02", "text": "text2", "type": "type2" },
      { "code": "02", "text": "text2", "type": "type2" },
      { "code": "01", "text": "text1", "type": "type1" },
      { "code": "02", "text": "text2", "type": "type2" },
      { "code": "02", "text": "text2", "type": "type2" },
      { "code": "02", "text": "text2", "type": "type2" },
      { "code": "01", "text": "text1", "type": "type1" },
      { "code": "02", "text": "text2", "type": "type2" },
      { "code": "02", "text": "text2", "type": "type2" },
      { "code": "02", "text": "text2", "type": "type2" },
      { "code": "02", "text": "text2", "type": "type2" }
    ],
    tableTh:{
      "one":"设备名称",
      "two":"设备地址"
    },
    startX: 0, //开始坐标
    startY: 0,
    isHideLoadMore: true
  },
  onLoad: function () {
    console.log('onLoad');
    this.getCasArray();
  },
  getCasArray:function(){
    var that = this;
    common.post({
      url: '/equipmentManagement/getEquitNameList',
      data: {},
      sh: function (res) {
        console.log(res);
        that.setData({
          casArray: res.data[0].name
        })
      }
    })
  },
  bindCasPickerChange: function (e) {
    console.log(this.data.casArray[e.detail.value].mc)
    if (e.detail.value == 4) {
      this.setData({ reply: true })
    } else {
      this.setData({ reply: false })
    }
    this.setData({
      casIndex: e.detail.value
    })
  },
  onReachBottom: function () {
    setTimeout(() => {
      this.setData({
        isHideLoadMore: true,
        listData:[
          { "code": "04", "text": "text1", "type": "type1" },
          { "code": "05", "text": "text1", "type": "type1" }
        ]
      })
    })
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