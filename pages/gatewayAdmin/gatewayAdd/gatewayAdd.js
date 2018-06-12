// pages/gatewayAdmin/gatewayAdd/gatewayAdd.js
const common = require('../../../utils/common.js');

var city_new = require('../../../utils/city.data-3.js');
var cityData_new = city_new.data.RECORDS;

var app = getApp();

var provinceName = '' // 选择省区 -名字
var province_id = ''; // 选择省区 -id

var cityName = '' // 选择市区 - 名字
var city_id = ''; // 选择省区 -id

var countyName = '' // 选择县区 -名字
var county_id = ''; // 选择省区 -id

// 所有的 省市区 集合  
var result_province = cityData_new.filter(
  function (value) {
    return (value.level_type == 1);
  }
);
var result_city = cityData_new.filter(
  function (value) {
    return (value.level_type == 2);
  }
);
var result_county = cityData_new.filter(
  function (value) {
    return (value.level_type == 3);
  }
);

// 当前的 省市区 集合
var province_s = result_province
var city_s = []; // “市区”集合
var county_s = [];// “县区”集合

Page({
  data: {
    // 城市数据
    provinces: province_s,
    citys: city_s,
    countys: county_s,
    cityValue: [0, 0, 0],
    cityText: '',
    cityCode: '',
    isCity: true, // 是否选择弹出 选择城市
    cityholder:"请选择城市",
    isfindSure:false//设备是否存在
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //城市
    // 获取第一列元素 -- 北京
    city_s = this.selectResultAction(result_city, 110000);
    county_s = this.selectResultAction(result_county, 110100);
    this.setData({
      provinces: province_s,
      citys: city_s,
      countys: county_s,
      // isAddAdress: data.isAddAdress
    });
    this.setData({
      cityValue: this.data.cityValue
    });

    this.username = wx.getStorageSync('username');
  },
  findIsSure(e) {
    console.log(e);
    var that = this;
    wx.showLoading({
      title: '设备搜索中',
      mask: true
    })
    if (e.detail.value){
      common.post({
        url: '/android/equipmentManagement/findByIp',
        data: {
          ip: e.detail.value,
          username: this.username
        },
        sh: function (res) {
          console.log(res);
          wx.hideLoading()
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
  },
//citypick
  sureAction: function () {
    var that = this;
    that.setData({
      isCity: false
    })
  },
  sureActionLayer: function () {
    var that = this;
    console.log(111)
    that.setData({
      isCity: true
    })
  },
  selectResultAction: function (data, event) {
    var result = data.filter(
      function (value) {
        return (value.parent_id == event);
      }
    );
    return result;
  },
  //城市选择器
  cityChange: function (e) {
    var val = e.detail.value // 改变的picker 每一列对应的下标位置
    var t = this.data.cityValue; // 原本的位置 
    if (val[0] != t[0]) { // 第一列改变
      city_s = [];
      county_s = [];
      var current_id = province_s[val[0]].id;
      city_s = this.selectResultAction(result_city, current_id);
      var current_city_id = city_s[0].id;
      county_s = this.selectResultAction(result_county, current_city_id);
      this.setData({
        citys: city_s,
        countys: county_s,
        cityValue: [val[0], 0, 0]
      })
      return;
    }
    if (val[1] != t[1]) {// 第二列改变
      county_s = [];
      var current_city_id = city_s[val[1]].id;
      county_s = this.selectResultAction(result_county, current_city_id);
      this.setData({
        countys: county_s,
        cityValue: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {// 第三列改变
      this.setData({
        county: this.data.countys[val[2]],
        cityValue: val
      })
      return;
    }
  },
  //确定选择
  ideChoice: function (e) {
    var that = this;
    var $act = e.currentTarget.dataset.act;
    var $mold = e.currentTarget.dataset.mold;

    //城市
    if ($act == 'confirm' && $mold == 'city') {
      var t = this.data.cityValue; // 原本的位置 
      // 记录当前选择的省市区ID  
      province_id = province_s[t[0]].id;
      city_id = city_s[t[1]].id;
      county_id = county_s[t[2]].id;

      // 记录当前选择的省市区名称
      provinceName = province_s[t[0]].name;
      cityName = city_s[t[1]].name;
      countyName = county_s[t[2]].name;

      that.cityText = provinceName + '-' + cityName + '-' + countyName
      that.cityCode = province_id + '-' + city_id + '-' + county_id
      that.setData({
        cityText: that.cityText,
        cityCode: that.cityCode

      })
    }
    that.setData({
      isCity: true
    })
  }
})
