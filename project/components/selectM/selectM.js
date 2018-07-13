const common = require('../../utils/common.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    copName: {
      type: String
    },
    copItem: {
      type: Number
    },
    hasCfms: {
      type: Boolean
    },
    numArray: {
      type: Object
    },
    modelS: {
      type: String
    },
    tabIndex:{
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    numIndex:0,
    numIfs:0,
    jiedianArr:[],
    jiedianArrIndex:0,
    jiedianIfs:0,
    anjianArr:[],
    anjianArrIndex: 0,
    casArray: { //模式
      base: ['释放', '吸合'],
      scene: ['反转', '吸合', '释放', '点动'],
      other: ['释放', '吸合', '反转']
    },
    casIndex: { //模式index
      base: [0],
      scene: [0, 0, 0, 0, 0, 0],
      other: [0, 0, 0, 0]
    },
    casThisNow:0
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
    bindDelItem: function (e) {
      var that = this
      wx.showModal({
        title: '提示',
        content: '确定要删除吗?',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              numIndex: 0,
              jiedianArrIndex: 0,
              anjianArrIndex: 0,
              numIfs: 0,
              jiedianIfs: 1
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    getShebeiJD:function(id, index, arr) {
      var that=this
      common.post({
        url: '/relay/getNodeList',
        data: {
          id: id,
          index: index
        },
        sh: function(res) {
          var jiedianArr=that.data.jiedianArr;
          jiedianArr = res.data.list
          that.setData({
            jiedianArr: jiedianArr
          });
          let jdid = res.data.list[0].id;
          that.getShebeiAJ(jdid, index)
          if(arr){
            jiedianArr.forEach((itemJ, indexJ, arrayJ) => {
              if (itemJ.id === arr[1]) {
                that.setData({
                  jiedianArrIndex: indexJ,
                  jiedianIfs: 0
                });
              }
            });
            that.getShebeiAJ(arr[1], index, arr[2])
          }
        }
      })
    },
    getShebeiAJ: function (id, index, arr) {
      var that = this
      common.post({
        url: '/relay/getSelectModelList',
        data: {
          id: id,
          index: index
        },
        sh: function(res) {
          var anjianArr = that.data.anjianArr
          anjianArr = res.data
          that.setData({
            anjianArr: anjianArr
          });
          that.propChangeData()

          if (arr) {
            anjianArr.forEach((itemA, indexA, arrayA) => {
              if (itemA.id === arr) {
                that.setData({
                  anjianArrIndex: indexA
                });
              }
            });
          }
        }
      })
    },
    _bindSnum:function(e) { //选择设备
      var that=this
      var numIndex = that.data.numIndex,
        numIfs = that.data.numIfs,
        modelValue = parseInt(e.detail.value);
      let tabIndex = that.data.tabIndex;
      let sbNum = that.properties.numArray[modelValue].id;
      if (modelValue !== 0) {
        numIfs = 1;
      } else {
        numIfs = 0;
      }
      that.setData({
        numIndex: modelValue,
        numIfs: numIfs
      })
      that.getShebeiJD(sbNum, tabIndex)
    },
    _bindJiedian: function (e) { 
      var that = this
      let anjianArr = that.data.anjianArr;
      let jiedianIfs = that.data.jiedianIfs;
      let jiedianArrIndex = that.data.jiedianArrIndex;
      let tabIndex = that.data.tabIndex;
      let modelValue = parseInt(e.detail.value);
      let jdNum = that.data.jiedianArr[modelValue].id;

      if (anjianArr.length > 0) {
        jiedianIfs = 0;
      } else {
        jiedianIfs = 1;
      }
      that.setData({
        jiedianArrIndex: modelValue,
        jiedianIfs: jiedianIfs
      })
      that.getShebeiAJ(jdNum, tabIndex)
    },
    _bindAnjian: function (e) { 
      var that = this
      let anjianArrIndex = that.data.anjianArrIndex;
      let modelValue = parseInt(e.detail.value);
      that.setData({
        anjianArrIndex: modelValue
      })
      that.propChangeData()
    },
    _bindCmodel: function (e) {
      var that = this
      let casIndex = that.data.casIndex;
      let modelIndex = e.currentTarget.dataset.model;
      let modelCas = e.currentTarget.dataset.cas;
      let modelValue = parseInt(e.detail.value);
      casIndex[modelCas][modelIndex] = modelValue;
      that.setData({
        casIndex: casIndex,
        casThisNow:modelValue
      })
      that.propChangeData()
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