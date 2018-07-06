// components/selectM/selectM.js
const common = require('../../utils/common.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    copName: {
      type: String
    },
    hasWeek: {
      type: Boolean
    },
    tabIndex: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timeStart: '00:00',
    timeEnd: '23:59',
    casArray: ['固定', '经纬'],
    casSindex: 0,
    casEindex: 0,
    weekdays: [
      { name: '1', value: '一' },
      { name: '2', value: '二' },
      { name: '3', value: '三' },
      { name: '4', value: '四' },
      { name: '5', value: '五' },
      { name: '6', value: '六' },
      { name: '0', value: '日' },
    ]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initdata: function (codeList){
      var that = this
      let hasCfms = that.properties.hasCfms,
        numArray = that.properties.numArray,
        numIndex = that.data.numIndex,
        casIndex = that.data.casIndex,
        modelS = that.data.modelS,
        copItem = that.data.copItem,
        tabIndex = that.data.tabIndex

      if (codeList) {
        var arr = codeList.split(',')
        numArray.forEach((item, index, array) => {
          if (item.id === arr[0]) {
            numIndex = index;
            that.getShebeiJD(item.id, tabIndex, arr)
            that.setData({
              numIndex: numIndex,
              numIfs: 1
            });
          }
        });
        if (hasCfms) {
          casIndex[modelS][copItem] = arr[3];
          that.setData({
            casIndex: casIndex
          })
        }
        
      }
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
      // that.propChangeData()
    },
    bindTimeE: function (e) {
      var that = this
      let casEindex = that.data.casEindex;
      that.setData({
        casEindex: e.detail.value
      })
      // that.propChangeData()
    },
    checkboxChange: function (e) {
      console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    },
    propChangeData: function () {
      var that = this
      let casThisNow = that.data.casThisNow;
      let hasCfms = that.data.hasCfms,
          copItem = that.data.copItem;
      let numArray = that.properties.numArray,
          numIndex = that.data.numIndex,
          jiedianArr = that.data.jiedianArr,
          jiedianArrIndex = that.data.jiedianArrIndex,
          anjianArr = that.data.anjianArr,
          anjianArrIndex = that.data.anjianArrIndex;

      var changeList =[];
      if (hasCfms){
        if (numIndex!==0){
          if (anjianArr.length > 0){
            changeList = {
              index: copItem,
              str: numArray[numIndex].id + ',' + jiedianArr[jiedianArrIndex].id + ',' + anjianArr[anjianArrIndex].id + ',' + casThisNow
            }
          }else{
            changeList = {
              index: copItem,
              str: numArray[numIndex].id + ',' + jiedianArr[jiedianArrIndex].id + ',' + casThisNow
            }
          }
          
        }
      } else {
        if (numIndex !== 0) {
          if (anjianArr.length>0) {
            changeList = {
              index: copItem,
              str: numArray[numIndex].id + ',' + jiedianArr[jiedianArrIndex].id + ',' + anjianArr[anjianArrIndex].id
            }
          }else{
            changeList = {
              index: copItem,
              str: numArray[numIndex].id + ',' + jiedianArr[jiedianArrIndex].id
            }
          }
        }
      }
      that.triggerEvent('propChange', changeList);
    }
  }
})