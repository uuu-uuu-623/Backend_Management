// 用户登录接口 - 限制传入的参数
export interface LoginForm {
  username: string
  password: string
}

// 定义全部接口返回的数据都拥有的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 用户登录后 返回的响应体数据的类型限制  继承了 ResponseData
export interface LoginResponseData extends ResponseData {
  // 这里的data就是token
  data: string
}

// 获取用户信息 - 对用户信息列表做返回值类型限制
export interface UserInfoDetail extends ResponseData {
  data: {
    avatar: string
    buttons: string[]
    name: string
    roles: string[]
    routes: string[]
  }
}
