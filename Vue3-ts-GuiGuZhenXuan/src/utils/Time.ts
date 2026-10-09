// 用户登陆时间判断
export const getLoginTime = () => {
  let message = ''
  const hours = new Date().getHours()
  if (hours <= 12) {
    message = '上午好'
  } else if (hours <= 13) {
    message = '中午好'
  } else if (hours <= 18) {
    message = '下午好'
  } else {
    message = '晚上好'
  }
  // console.log(message)
  return message
}
