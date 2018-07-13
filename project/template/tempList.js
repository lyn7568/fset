const common = require('../utils/common.js');

//===============滑动操作=============
function touchstart(that, nowEvent) {
  //开始触摸时 重置所有删除
  var List = nowEvent.currentTarget.dataset.list;//操作的对象
  that.data[List].forEach(function (v, i) {
    if (v.isTouchMove)//只操作为true的
      v.isTouchMove = false;
  })
  that.setData({
    startX: nowEvent.changedTouches[0].clientX,
    startY: nowEvent.changedTouches[0].clientY,
    [List]: that.data[List]
  })
}
//滑动事件处理
function touchmove(that, nowEvent) {
  var index = nowEvent.currentTarget.dataset.index,//当前索引
    startX = that.data.startX,//开始X坐标
    startY = that.data.startY,//开始Y坐标
    touchMoveX = nowEvent.changedTouches[0].clientX,//滑动变化坐标
    touchMoveY = nowEvent.changedTouches[0].clientY,//滑动变化坐标
    //获取滑动角度
    angle = touchangle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
  var List = nowEvent.currentTarget.dataset.list;//操作的对象
  that.data[List].forEach(function (v, i) {
    v.isTouchMove = false
    //滑动超过30度角 return
    if (Math.abs(angle) > 30) return;
    if (i == index) {
      if (touchMoveX > startX) //右滑
        v.isTouchMove = false
      else //左滑
        v.isTouchMove = true
    }
  })
  //更新数据
  that.setData({
    [List]: that.data[List]
  })
}
/**
 * 计算滑动角度
 * @param {Object} start 起点坐标
 * @param {Object} end 终点坐标
 */
function touchangle(start, end) {
  var _X = end.X - start.X,
    _Y = end.Y - start.Y
  //返回角度 /Math.atan()返回数字的反正切值
  return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
}

//===============弹出编辑窗口=============
function showDialogBtn(that) {
  that.setData({
    showModal: true
  })
}
/**
 * 隐藏模态对话框
 */
function hideModal(that) {
  that.setData({
    showModal: false
  });
}

//==============设备编号选择级联节点=============
function getShebeiBH(that) {
  let wgIp = that.data.wgIpNow
  common.post({
    url: '/relay/initEsnNumber',
    data: {
      wgIp: wgIp
    },
    sh: function (res) {
      let delf = { id: 0, name: '请选择' }
      res.data.unshift(delf);
      that.setData({
        numArray: res.data
      });
    }
  })
}
function getYkShebeiBH(that) {
  let ykIp = that.data.jdIpNow
  common.post({
    url: '/crelay/initEsnNumber',
    data: {
      wgIp: ykIp
    },
    sh: function (res) {
      let delf = { id: 0, name: '请选择' }
      res.data.unshift(delf);
      that.setData({
        numArray: res.data
      });
    }
  })
}

module.exports = {
  touchstart,
  touchmove,
  showDialogBtn,
  hideModal,
  getShebeiBH,
  getYkShebeiBH
}