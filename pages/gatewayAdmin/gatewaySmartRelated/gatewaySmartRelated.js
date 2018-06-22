// pages/gatewayAdmin/gatewaySmartRelated/gatewaySmartRelated.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    casArray: { //模式
      scene: ['反转', '吸合', '释放', '点动']
    },
    casIndex: { //模式index
      scene: [0, 0, 0, 0, 0, 0]
    },
    numPlaceh: '请选择',
    numArray: [ //编号
      "请选择",
      "1",
      "2"
    ],
    ifSelectedNum: false,//是否选择设备
    jiedianArr: {},//节点
    jiedianArrIndex: 0,
    anjianArr: {},//按键
    anjianArrIndex: 0,
    numIndex: { //编号index
      scene: [
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  bindJiedian: function (e) {
    var that = this;
    that.setData({
      jiedianArrIndex: e.detail.value
    })
  },
  bindAnjian: function (e) {
    var that = this;
    that.setData({
      anjianArrIndex: e.detail.value
    })
  },
  bindCmodel: function (e) {
    var that = this;
    let casIndex = that.data.casIndex;
    let modelIndex = e.currentTarget.dataset.model;
    let modelCas = e.currentTarget.dataset.cas;
    let modelValue = parseInt(e.detail.value);
    casIndex[modelCas][modelIndex] = modelValue;
    that.setData({
      casIndex: casIndex
    })
  },
  bindSnum: function (e) { //选择设备
    var that = this;
    let numIndex = that.data.numIndex;
    let modelIndex = e.currentTarget.dataset.model;
    let modelCas = e.currentTarget.dataset.cas;
    let modelValue = parseInt(e.detail.value);
    numIndex[modelCas][modelIndex].index = modelValue;
    if (modelValue !== 0) {
      numIndex[modelCas][modelIndex].ifS = true;
    } else {
      numIndex[modelCas][modelIndex].ifS = false;
    }
    that.setData({
      numIndex: numIndex
    })
  },
  bindDelItem: function(e) {
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
  }
})