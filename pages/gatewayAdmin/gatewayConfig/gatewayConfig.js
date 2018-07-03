// pages/gatewayAdmin/gatewayConfig/gatewayConfig.js
const common = require('../../../utils/common.js');
const tempcomjs = require('../../../template/tempList.js');


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
    numArray: [],//编号
    jiedianArr: [],//节点
    jiedianArrIndex: JSON.parse(JSON.stringify(tempcomjs.commonIndex)),
    anjianArr:[],//按键
    anjianArrIndex: JSON.parse(JSON.stringify(tempcomjs.commonIndex)),
    numIndex: JSON.parse(JSON.stringify(tempcomjs.commonIndex)), //编号index
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
    }else{
      if (options.clId) {
        this.setData({
          clIdNow: options.clId
        });
        this.getDLInfo(options.clId, 0)
      }
    }
    this.username = wx.getStorageSync('username');
    this.getShebeiBH();
  },
  getShebeiBH: function () {
    tempcomjs.getShebeiBH(this)
  },
  bindSnum: function (e) { //选择设备
    tempcomjs.bindSnum(this,e)
  },
  bindJiedian: function (e) {
    tempcomjs.bindJiedian(this, e)
  },
  bindAnjian: function (e) {
    tempcomjs.bindAnjian(this, e)
  },
  bindCmodel: function (e) {
    tempcomjs.bindCmodel(this, e)
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
      currentChannelIndex: targetChannelIndex,
      jiedianArr: [],//节点
      jiedianArrIndex: JSON.parse(JSON.stringify(tempcomjs.commonIndex)),
      anjianArr: [],//按键
      anjianArrIndex: JSON.parse(JSON.stringify(tempcomjs.commonIndex))
    });
    if (this.data.clIdNow){
      let tabClId = this.data.clIdNow
      this.getDLInfo(tabClId,targetChannelIndex);
    }
  },
  getDLInfo: function (id,targetChannelIndex){
    var that = this;
    let tabindex = that.data.navbarArray[targetChannelIndex].index
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/relay/jdqConfigShow',
      data: {
        mid: id,
        index: tabindex
      },
      sh: function (res) {
        wx.hideLoading()
        if (res.data.result === 'success') {
          if (tabindex === 6){
            if (res.data.code === '开启'){
              that.setData({
                tab1_kg: true
              });
            } else if (res.data.code === '关闭') {
              that.setData({
                tab1_kg: false
              });
            }
          } else if (tabindex === 1) {
            let base=[];
            base = res.data.list[0].cl01.split(',');
            that.setData({
              timeDelay: base[0],
              timeInterval: base[1],
              // casIndex[base][0]: base[2]
            });
          }
        } else {
          wx.showToast({
            title: res.data.result,
            icon: 'none'
          })
        }
      }
    })
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