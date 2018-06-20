// pages/gatewayAdmin/gatewayConfig/gatewayConfig.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarArray: [{
      text: '开关状态',
      active: 'nav-active'
    }, {
      text: '消防配置'
    }, {
      text: '基本配置'
    }, {
      text: '场景配置'
    }, {
      text: '定时配置'
    }, {
      text: '光控配置'
    }, {
      text: '红外配置'
    }, {
      text: '其他配置'
    }],
    array: [0, 1, 2,3,4,5,6,7],
    currentChannelIndex: 0,
    casArray: { //模式
      base: ['释放', '吸合'],
      scene: ['反转', '吸合', '释放','点动'],
      other: ['释放', '吸合', '反转']
    },
    casIndex:{ //模式index
      base: [0],
      scene: [0, 0, 0, 0, 0, 0],
      other: [0, 0, 0, 0]
    },
    numPlaceh: '请选择',
    numArray: [ //编号
      "请选择",
      "1",
      "2"
    ],
    ifSelectedNum:false,//是否选择设备
    jiedianArr:{},//节点
    jiedianArrIndex:0,
    anjianArr:{},//按键
    anjianArrIndex:0,
    numIndex: { //编号index
      scene: [
        { ifS: false, index: 0 }, 
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 }
      ],
      light: [ //光控
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 }
      ],
      infrare: [ //红外
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 },
        { ifS: false, index: 0 }
      ],
      other: [
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
  bindSnum: function (e) { //选择设备
    var that = this;
    let numIndex = that.data.numIndex;
    let modelIndex = e.currentTarget.dataset.model;
    let modelCas = e.currentTarget.dataset.cas;
    let modelValue = parseInt(e.detail.value);
    numIndex[modelCas][modelIndex].index = modelValue;
    if (modelValue!==0){
      numIndex[modelCas][modelIndex].ifS = true;
    }else{
      numIndex[modelCas][modelIndex].ifS = false;
    }
    that.setData({
      numIndex: numIndex
    })
  },
  bindCmodel: function (e) {
    var that=this;
    let casIndex = that.data.casIndex;
    let modelIndex = e.currentTarget.dataset.model;
    let modelCas = e.currentTarget.dataset.cas;
    let modelValue = parseInt(e.detail.value);
    casIndex[modelCas][modelIndex] = modelValue;
    that.setData({
      casIndex: casIndex
    })
  },
  bindTimeDelay:function(e){
    this.setData({
      timeDelay: e.detail.value
    })
  },
  bindTimeInterval: function (e) {
    this.setData({
      timeInterval: e.detail.value
    })
  },
  onTapNavbar: function (e) {
    this.switchChannel(parseInt(e.currentTarget.id));
    this.scrollLeftNav(parseInt(e.currentTarget.id));
  },
  scrollLeftNav: function (tabid) {
    if (tabid > 3) {
      this.setData({
        scrollNavbarLeft: 300
      })
    } else {
      this.setData({
        scrollNavbarLeft: 0
      })
    }
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
  }
})