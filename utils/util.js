const formatTime = (date, flag) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const week = date.getDay()
  var weekday = new Array('7','1', '2', '3', '4', '5', '6')

  return flag 
    ? ([year, month, day].map(formatNumber).join('') + ',' + (weekday[week]) + ',' + [hour, minute, second].map(formatNumber).join('')) 
  : ([year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':'))
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
