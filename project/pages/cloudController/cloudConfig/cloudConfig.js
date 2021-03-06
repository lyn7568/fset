const common = require('../../../utils/common.js');
const tempcomjs = require('../../../template/tempList.js');

Page({
  data: {
    navbarArray: [{
      text: '开关状态',
      active: 'nav-active',
      index: 0
    },{
      text: '基本配置',
      index: 1
    },
    // {
    //   text: '定时配置',
    //   index: 3
    // }, 
    {
      text: '光控配置',
      index: 4,
      name: 'light',
      arr: [0, 1, 2, 3, 4],
      hasCfms: false,
      changelist: []
    }, {
      text: '红外配置',
      index: 5,
      name: 'infrare',
      arr: [0, 1, 2, 3, 4],
      hasCfms: false,
      changelist: []
    }],
    array: [0, 1, 2, 3], //, 4
    currentChannelIndex: 0,
    currentTabInIndex: 0,
    numArray: [],//编号
    tab1_kg: 0,
    tab0_kg: 0,
    casBase: ['释放', '吸合'],
    casBIndex: 0,
    shiduanArr: [0, 1, 2, 3, 4]
  },
  onLoad: function (options) {
    this.setData({
      ykIpNow: options.ykIp
    });
    if (options.ty) {
      wx.setNavigationBarTitle({
        title: '通用管理配置'
      });
      this.setData({
        ifGeneral: options.ty
      });
    } else {
      wx.setNavigationBarTitle({
        title: '继电器管理配置'
      });
      if (options.clId) {
        let stateImg = ''
        if (options.clState === '开启') {
          stateImg = '/images/open.png'
        } else if (options.clState === '关闭') {
          stateImg = '/images/close.png'
        }
        console.log(options.clId)
        this.setData({
          clIdNow: options.clId,
          clStateNow: common.baseUrl + stateImg
        });
        console.log(this.data.clIdNow)
        this.getDLInfo(options.clId, 0)
      }
    }
    this.username = wx.getStorageSync('username');
    this.getShebeiBH();
  },
  getShebeiBH: function () {
    tempcomjs.getYkShebeiBH(this)
  },
  bindBmodel: function (e) {
    var that = this
    let modelValue = parseInt(e.detail.value);
    that.setData({
      casBIndex: modelValue
    })
  },
  bindTimeDelay1: function (e) {
    this.setData({
      timeDelay1: e.detail.value
    })
  },
  bindTimeDelay: function (e) {
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
    if (tabid > 2) {
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
      if (item.arr) {
        item.arr.forEach((itemchild, indexchild, arraychild) => {
          if (item.hasCfms) {
            item.changelist[indexchild] = 'qxz,qxz,qxz,0';
          } else {
            item.changelist[indexchild] = 'qxz,qxz,qxz';
          }
        })
      }
    });
    this.setData({
      navbarArray: navbarArray,
      currentChannelIndex: targetChannelIndex,
      currentTabInIndex: navbarArray[targetChannelIndex].index
    });
    if (this.data.clIdNow) {
      let tabClId = this.data.clIdNow
      this.getDLInfo(tabClId, targetChannelIndex);
    }
  },
  propChange: function (e) {
    var that = this;
    var navbarArray = that.data.navbarArray
    var currentChannelIndex = that.data.currentChannelIndex
    navbarArray[currentChannelIndex].changelist[e.detail.index] = e.detail.str;
    that.setData({
      navbarArray: navbarArray
    })
  },
  getDLInfo: function (id, targetChannelIndex) {
    var that = this;
    var navbarArray = that.data.navbarArray
    var tabindex = navbarArray[targetChannelIndex].index
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/crelay/jdqConfigShow',
      data: {
        mid: id,
        index: tabindex
      },
      sh: function (res) {
        wx.hideLoading()
        if (res.data.result === 'success') {
          if (tabindex === 1) {
            let baseT = [];
            if (res.data.data && res.data.data.length > 0) {
              baseT = res.data.data[0].cl01.split(',');
              that.setData({
                timeDelay: baseT[0],
                timeInterval: baseT[1],
                casBIndex: baseT[2]
              });
            }
          } else if (tabindex === 4 || tabindex === 5) {
            if (res.data.data && res.data.data.length > 0) {
              var codeList = []
              for (let i = 0; i < res.data.data.length; i++) {
                codeList[i] = res.data.data[i].cl01;
                navbarArray[targetChannelIndex].changelist[i] = res.data.data[i];
              }
              that.setData({
                navbarArray: navbarArray
              });
              codeList.forEach((item, index, array) => {
                that.selectComponent("#" + navbarArray[targetChannelIndex].name + index).initdata(item)
              });
            }
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
  sureSetting: function (e) {
    var that = this;
    let navbarArray = that.data.navbarArray
    let tab = that.data.currentChannelIndex
    let jdIp = that.data.ykIpNow
    var setVals = []
    if (tab === 0) {
      if (!that.data.timeDelay1 && that.data.ifGeneral) {
        wx.showToast({
          title: '延时不能为空',
          icon: 'none'
        })
        return
      }
      setVals = {
        "onOff": that.data.tab0_kg,
        "tyDelay": that.data.timeDelay1
      }
    } else if (tab === 1) {
      if (!that.data.timeDelay) {
        wx.showToast({
          title: '吸合延时不能为空',
          icon: 'none'
        })
        return
      }
      if (!that.data.timeInterval) {
        wx.showToast({
          title: '吸合时长不能为空',
          icon: 'none'
        })
        return
      }
      setVals = {
        "delay": that.data.timeDelay,
        "timer": that.data.timeInterval,
        "onOff": that.data.casBIndex
      }
    } else if (tab === 4 || tab === 5 ) {
      for (let i = 0; i < navbarArray[tab].changelist.length; i++) {
        var arr = navbarArray[tab].changelist[i].split(',');
        if (navbarArray[tab].hasCfms) {
          setVals[i] = {
            "qxz": arr[0],
            "qxzNode": arr[1],
            "qxzModel": arr[2],
            "cfms": arr[3]
          };
        } else {
          setVals[i] = {
            "qxz": arr[0],
            "qxzNode": arr[1],
            "qxzModel": arr[2]
          };
        }
      }
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    common.post({
      url: '/android/crelay/jdqSettings',
      data: {
        jdIp: jdIp,
        index: navbarArray[tab].index,
        value: JSON.stringify(setVals),
        type: that.data.ifGeneral ? 'ty' : 'dl',
        username: that.username,
        jdqls: that.data.ifGeneral ? '' : that.data.clIdNow.split('_')[1]
      },
      sh: function (res) {
        wx.hideLoading()
        if (res.data.result === 'success') {
          wx.showToast({
            title: '配置成功'
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
  onShareAppMessage: function () {
    return {
      path: 'pages/index/index'
    };
  }
})