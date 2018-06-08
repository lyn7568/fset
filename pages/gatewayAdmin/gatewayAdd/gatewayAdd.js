// pages/gatewayAdmin/gatewayAdd/gatewayAdd.js
var model = require('../../../model/model.js');
const common = require('../../../utils/common.js');
// const citypick = require('../../../template/tempList.js');

var show = false;
var item = {};

Page({
  data: {
    item: {
      show: show
    },
    cityholder:"请选择城市",
    isfindSure:false//设备是否存在
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.username = wx.getStorageSync('username');
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    model.animationEvents(this, 200, false, 400);
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  },

  findIsSure(e) {
    console.log(e);
    var that = this;
    if (e.detail.value){
      common.post({
        url: '/android/equipmentManagement/findByIp',
        data: {
          ip: e.detail.value,
          username: this.username
        },
        sh: function (res) {
          console.log(res);
          if (res.data.result === 'fail') {
            wx.showToast({
              title: '该设备已被注册',
              icon: 'none'
            })
          } else {
            that.setData({
              nameS: e.detail.value
            });
            that.findEquipment(e.detail.value);
          }
        }
      })
    }
  },
  findEquipment(ip) {
    var that = this;
    common.post({
      url: '/equipmentManagement/findIp',
      data: {
        ip:ip
      },
      sh: function (res) {
        console.log(res);
        if(res.data.result === 'success'){
          that.setData({
            typeS: res.data.name_,
            typeX: res.data.type_,
            isfindSure: true
          });
        }else{
          wx.showToast({
            title: res.data.result,
            icon: 'none'
          })
        }
      }
    })
  },
  addEquipment() {
    var that = this;
    common.post({
      url: '/equipmentManagement/addEquit',
      data: {
        // eq_name: ,
        // eq_id:,
        // eq_type:that.typeX,
        // jingwei:
      },
      sh: function (res) {
        console.log(res);
        if (res.data.result === 'success') {
          wx.showToast({
            title: '设备添加成功'
          })
          wx.redirectTo({
            url: '../gatewayList/gatewayList',
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
})
