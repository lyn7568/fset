// pages/gatewayAdmin/gatewayConfig/gatewayConfig.js
const common = require('../../../utils/common.js');

const commonIndex = {
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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarArray: [{
      text: '开关状态',
      active: 'nav-active',
      index:0
    }, {
        text: '消防配置',
        index: 6
    }, {
        text: '基本配置',
        index: 1
    }, {
        text: '场景配置',
        index: 2
    }, {
        text: '定时配置',
        index: 3
    }, {
        text: '光控配置',
        index: 4
    }, {
        text: '红外配置',
        index: 5
    }, {
        text: '其他配置',
        index: 7
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
    numArray: [ //编号
      {id:"0",name:"请选择"},
      {id:"1",name:"1"},
      { id:"2", name:"2" }
    ],
    ifSelectedNum:false,//是否选择设备
    jiedianArr: [
      { id: "0", name: "节点1" },
      { id: "1", name: "节点2" },
      { id: "2", name: "节点3" }
    ],//节点
    jiedianArrIndex: commonIndex,
    anjianArr:[
      { id: "0", name: "按键1" },
      { id: "1", name: "按键2" },
      { id: "2", name: "按键3" }
    ],//按键
    anjianArrIndex: commonIndex,
    numIndex: commonIndex, //编号index
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wgIpNow: options.wgIp,
      jdIpNow: options.jdIp
    });
    if (options.ty){
      this.setData({
        ifGeneral: options.ty
      });
    }
    this.username = wx.getStorageSync('username');
    this.getShebeiBH();
  },
  getShebeiBH: function () {
    var that = this;
    let wgIp = that.data.wgIpNow
    common.post({
      url: '/relay/initEsnNumber',
      data: {
        wgIp: wgIp
      },
      sh: function (res) {
        let delf={id:0,name:'请选择'}
        res.data.unshift(delf);
        that.setData({
          numArray: res.data.list
        });
      }
    })
  },
  getShebeiJD: function (id,index) {
    var that = this;
    common.post({
      url: '/relay/getNodeList',
      data: {
        id: id,
        index: index
      },
      sh: function (res) {
        that.setData({
          jiedianArr: res.data
        });
      }
    })
  },
  getShebeiAJ: function (id, index) {
    var that = this;
    common.post({
      url: '/relay/getSelectModelList',
      data: {
        id: id,
        index: index
      },
      sh: function (res) {
        that.setData({
          jiedianArr: res.data
        });
      }
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
    let sbNum = that.data.numArray[numIndex[modelCas][modelIndex].index].id
    let tabIndex = that.data.navbarArray[that.data.currentChannelIndex].index
    that.getShebeiJD(sbNum, tabIndex)
  },
  bindJiedian: function (e) {
    var that = this;
    that.setData({
      jiedianArrIndex: e.detail.value
    })
    let jdNum = that.data.jiedianArr[e.detail.value].id
    let tabIndex = that.data.navbarArray[that.data.currentChannelIndex].index
    that.getShebeiAJ(jdNum, tabIndex)
  },
  bindAnjian: function (e) {
    var that = this;
    that.setData({
      anjianArrIndex: e.detail.value
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
  bindTimeDelay1: function (e) {
    this.setData({
      timeDelay1: e.detail.value
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
  bindDelItem: function (e) {
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
  },
  sureSetting:function(e){
    var that = this;
    let tab = that.data.currentChannelIndex
    let wgIp = that.data.wgIpNow
    let jdIp = that.data.jdIpNow
    var setVals = ''
    if (tab === 0){
      setVals = {
        "onOff": that.data.tab0_kg,
        "tyDelay":that.data.timeDelay1
      }
    } else if (tab === 1) {
      setVals = {
        "onOff":that.data.tab1_kg
      }
    } else if (tab === 2) {
      setVals = {
        "delay":that.data.timeDelay,
        "timer":that.data.timeInterval,
        "onOff":that.data.casIndex.base[0]
      }
    } else if (tab === 3) {
      let modas = 'scene'
      setVals = [{ 
          "qxz": that.data.numArray[numIndex[modas][0].index].id, 
          "qxzNode": that.data.jiedianArr[that.data.jiedianArrIndex].id, 
          "qxzModel": that.data.anjianArr[that.data.anjianArrIndex].id, 
          "cfms": that.data.casIndex[modas][0] 
        },{
          "qxz": that.data.numArray[numIndex[modas][0].index].id,
          "qxzNode": that.data.jiedianArr[that.data.jiedianArrIndex].id,
          "qxzModel": that.data.anjianArr[that.data.anjianArrIndex].id,
          "cfms": that.data.casIndex[modas][0]
        }, {
          "qxz": that.data.numArray[numIndex[modas][0].index].id,
          "qxzNode": that.data.jiedianArr[that.data.jiedianArrIndex].id,
          "qxzModel": that.data.anjianArr[that.data.anjianArrIndex].id,
          "cfms": that.data.casIndex[modas][0]
        }, {
          "qxz": that.data.numArray[numIndex[modas][0].index].id,
          "qxzNode": that.data.jiedianArr[that.data.jiedianArrIndex].id,
          "qxzModel": that.data.anjianArr[that.data.anjianArrIndex].id,
          "cfms": that.data.casIndex[modas][0]
        }, {
          "qxz": that.data.numArray[numIndex[modas][0].index].id,
          "qxzNode": that.data.jiedianArr[that.data.jiedianArrIndex].id,
          "qxzModel": that.data.anjianArr[that.data.anjianArrIndex].id,
          "cfms": that.data.casIndex[modas][0]
        },
      ]
    } else if (tab === 4) {
      setVals = '{\"onOff\":' + that.data.tab1_kg + '\"}'
    } else if (tab === 5) {
      setVals = '{\"onOff\":' + that.data.tab1_kg + '\"}'
    } else if (tab === 6) {
      setVals = '{\"onOff\":' + that.data.tab1_kg + '\"}'
    } else if (tab === 7) {
      setVals = '{\"onOff\":' + that.data.tab1_kg + '\"}'
    }

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/android/relay/jdqSettings',
      data: {
        wgIp: wgIp,
        jdIp: jdIp,
        index: that.data.navbarArray[tab].index,
        value: JSON.stringify(setVals),
        type: 'ty',
        username:that.username
      },
      sh: function (res) {
        wx.hideLoading()
        console.log(res)
      }
    })
  }
})