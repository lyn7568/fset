// components/selectM/selectM.js
const common = require('../../utils/common.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    typeT: {
      type: String
    },
    copName: {
      type: String
    },
    ifhasDate: {
      type: Boolean
    },
    hasWeek: {
      type: Boolean
    },
    tabIndex: {
      type: Number
    },
    timgingIndex:{
      type: Number
    },
    clwgIp:{
      type: String
    },
    cljdIp: {
      type: String
    },
    cldlIp: {
      type: String
    },
    ifGeneral: {
      type: Boolean
    },
    clykIp: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dateStart: '0000-00-00',
    dateEnd: '0000-00-00',
    timeStart: '00:00',
    timeEnd: '23:59',
    casArray: ['固定', '经纬'],
    casSindex: 0,
    casEindex: 0,
    weekdays: [
      { name: '64', value: '一' },
      { name: '32', value: '二' },
      { name: '16', value: '三' },
      { name: '8', value: '四' },
      { name: '4', value: '五' },
      { name: '2', value: '六' },
      { name: '1', value: '日' },
    ]
  },
  attached(){
    this.username = wx.getStorageSync('username');
  },
  /**
   * 组件的方法列表
   */
  methods: {    
    // 日期段选择  
    bindDateChange(e) {
      let that = this;
      that.setData({
        dateStart: e.detail.value
      })
    },
    bindDateChange2(e) {
      let that = this;
      that.setData({
        dateEnd: e.detail.value
      })
    },
    // 时间段选择  
    bindTimeChange(e) {
      let that = this;
      that.setData({
        timeStart: e.detail.value,
      })
    },
    bindTimeChange2(e) {
      let that = this;
      that.setData({
        timeEnd: e.detail.value,
      })
    },
    bindTimeS: function (e) {
      var that = this
      let casSindex = that.data.casSindex;
      that.setData({
        casSindex: e.detail.value
      })
    },
    bindTimeE: function (e) {
      var that = this
      let casEindex = that.data.casEindex;
      that.setData({
        casEindex: e.detail.value
      })
    },
    checkboxChange: function (e) {
      var that = this
      let checkboxVal = e.detail.value
      that.setData({
        checkboxVal: checkboxVal
      })
    },
    bindCheckDsItem: function (e) {
      var that = this;
      let typeT = that.properties.typeT
      let wgIp = that.properties.clwgIp,
        jdIp = that.properties.cljdIp,
        ykIp = that.properties.clykIp,
        clIdNow = that.properties.cldlIp,
        timgingIndex = that.properties.timgingIndex,
        weekdays = that.data.weekdays,
        checkboxVal = that.data.checkboxVal;
      if (!clIdNow) {
        return;
      }
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      var url = '', getVals = {}
      if (typeT==='wg'){
        url = '/relay/checkDs';
        getVals = {
          wgIp: wgIp,
          jdIp: jdIp,
          index: timgingIndex,
          jdqls: clIdNow.split('_')[2]
        }
      } else if (typeT === 'yk') {
        url = '/crelay/checkDs';
        getVals = {
          jdIp: ykIp,
          index: timgingIndex,
          jdqls: clIdNow.split('_')[2]
        }
      }
      common.post({
        url: url,
        data: getVals,
        sh: function (res) {
          console.log(res)
          wx.hideLoading()
          if (res.data.result === 'success') {
            if (res.data.cl01) {
              let jjr = res.data.cl01.split(',')
              if (timgingIndex === 0) {
                that.setData({
                  dateStart: jjr[0],
                  dateEnd: jjr[1],
                  timeStart: jjr[2],
                  casSindex: jjr[3],
                  timeEnd: jjr[4],
                  casEindex: jjr[5]
                })
              } else {
                if (res.data.cl10!==''){
                  checkboxVal = res.data.cl10.split(",");
                  weekdays.forEach((item, index, array) => {
                    checkboxVal.forEach((itemC, indexC, arrayC) => {
                      if (item.name === itemC) {
                        item.checked = 'true'
                      }
                    })
                  });
                  that.setData({
                    weekdays: weekdays,
                    checkboxVal: checkboxVal
                  })
                }
                that.setData({
                  timeStart: jjr[0],
                  casSindex: jjr[1],
                  timeEnd: jjr[2],
                  casEindex: jjr[3]
                })
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
    arrToStr: function (arr){
      var str=0
      arr.forEach((item, index, array) => {
        str +=item
      })
      return (str > 100) ? str : ('0'+str);
    },
    sureSetting: function () {
      var that = this;
      let typeT = that.properties.typeT
      let wgIp = that.properties.clwgIp,
        jdIp = that.properties.cljdIp,
        ykIp = that.properties.clykIp,
        clIdNow = that.properties.cldlIp,
        tabIndex = that.properties.tabIndex,
        timgingIndex = that.properties.timgingIndex,
        ifGeneral = that.properties.ifGeneral,

        dateStart = that.data.dateStart,
        dateEnd = that.data.dateEnd,
        timeStart = that.data.timeStart,
        casSindex = that.data.casSindex,
        timeEnd = that.data.timeEnd,
        casEindex = that.data.casEindex,
        checkboxVal = that.data.checkboxVal

      var setVals = {}
      if (timgingIndex===0){
        setVals = {
          "dszIndex": timgingIndex,
          "jr": dateStart.replace(/\-/g, '') + ',' + dateEnd.replace(/\-/g, '') + ',' + timeStart.replace(/\:/g, '') + ',' + casSindex + ',' + timeEnd.replace(/\:/g, '') + ',' + casEindex
        }
      } else if(timgingIndex===1){
        setVals = {
          "dszIndex": timgingIndex,
          "sd1": timeStart.replace(/\:/g, '') + ',' + casSindex + ',' + timeEnd.replace(/\:/g, '') + ',' + casEindex + ',' + that.arrToStr(checkboxVal)
        }
      } else if (timgingIndex === 2) {
        setVals = {
          "dszIndex": timgingIndex,
          "sd2": timeStart.replace(/\:/g, '') + ',' + casSindex + ',' + timeEnd.replace(/\:/g, '') + ',' + casEindex + ',' + that.arrToStr(checkboxVal)
        }
      } else if (timgingIndex === 3) {
        setVals = {
          "dszIndex": timgingIndex,
          "sd3": timeStart.replace(/\:/g, '') + ',' + casSindex + ',' + timeEnd.replace(/\:/g, '') + ',' + casEindex + ',' + that.arrToStr(checkboxVal)
        }
      } else if (timgingIndex === 4) {
        setVals = {
          "dszIndex": timgingIndex,
          "sd4": timeStart.replace(/\:/g, '') + ',' + casSindex + ',' + timeEnd.replace(/\:/g, '') + ',' + casEindex + ',' + that.arrToStr(checkboxVal)
        }
      } else if (timgingIndex === 5) {
        setVals = {
          "dszIndex": timgingIndex,
          "sd5": timeStart.replace(/\:/g, '') + ',' + casSindex + ',' + timeEnd.replace(/\:/g, '') + ',' + casEindex + ',' + that.arrToStr(checkboxVal)
        }
      }

      var url='',dataStr=''
      if (typeT === 'wg') {
        url = '/android/relay/jdqSettings';
        dataStr = {
          wgIp: wgIp,
          jdIp: jdIp,
          index: tabIndex,
          value: JSON.stringify(setVals),
          type: ifGeneral ? 'ty' : 'dl',
          username: that.username,
          jdqls: ifGeneral ? '' : clIdNow.split('_')[2]
        }
      } else if (typeT === 'yk') {
        url = '/android/crelay/jdqSettings';
        dataStr = {
          jdIp: ykIp,
          index: tabIndex,
          value: JSON.stringify(setVals),
          type: ifGeneral ? 'ty' : 'dl',
          username: that.username,
          jdqls: ifGeneral ? '' : clIdNow.split('_')[2]
        }
      }
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      common.post({
        url: url,
        data: dataStr,
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
    }
  }
})