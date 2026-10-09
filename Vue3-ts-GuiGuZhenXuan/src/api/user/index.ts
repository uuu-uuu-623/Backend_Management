// 统一管理项目用户的相关接口
import instance from '@/utils/instance' // 引入封装的 axios
import type { LoginForm, LoginResponseData, UserInfoDetail, ResponseData } from './type'

// 统一管理接口
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGINOUT_URL = '/admin/acl/index/logout',
}

// 用户登录
export const reqLogin = (data: LoginForm): Promise<LoginResponseData> => {
  // 返回值也要做 类型限制
  return instance<LoginResponseData>({
    url: API.LOGIN_URL,
    method: 'post',
    data,
  }) as unknown as Promise<LoginResponseData>
}

// 获取用户信息的接口函数并暴露出去
export const reqUserInfo = (): Promise<UserInfoDetail> => {
  return instance<UserInfoDetail>({ url: API.USERINFO_URL }) as unknown as Promise<UserInfoDetail>
}

// 用户退出登录
export const reqLogout = (): Promise<ResponseData> => {
  return instance<ResponseData>({
    url: API.LOGINOUT_URL,
    method: 'post',
  }) as unknown as Promise<ResponseData>
}
