// 该文件用于编写 权限管理中的 用户管理模块 的类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 定义获取用户分页列表的 data中record 的数据类型
// 也可以是 定义 新增或者更新 用户信息需要传递的数据类型
export interface Record_from_UserData {
  id?: number
  createTime?: string
  updateTime?: string
  username?: string
  roleName?: string
  password?: string
  name?: string
  phone?: string | null
}

// 定义获取用户分页列表的 data 的数据类型
export interface Data_from_User {
  records: Record_from_UserData[]
  total: number
  size: number
  current: number
  pages: number
}

// 定义获取用户分页列表的 返回值数据 的类型
export interface UserResData extends ResponseData {
  data: Data_from_User
}

// 定义 新增或者更新用户的 返回值数据类型
export interface addOrUpdateUserResData extends ResponseData {
  data: string | null
}

// 定义角色的数据类型
export interface Role {
  id?: number
  roleName?: string
  remark?: string
  createTime?: string
  updateTime?: string
}

// 定义 用户角色分配信息的 data数据类型
export interface Data_from_UserRolesAssign {
  assignRoles: Role[]
  allRolesList: Role[]
}

// 请求获得角色分配数据的 返回值数据类型定义
export interface UserRolesAssignResData extends ResponseData {
  data: Data_from_UserRolesAssign
}

// 定义 为用户分配角色的数据类型
export interface assignRoleToOneData {
  roleIdList: number[]
  userId: number
}

// 定义 为用户分配角色的 返回值数据类型定义
export interface assignRoleResData extends ResponseData {
  data: string
}

// 定义 删除用户 (一个和多个) 的 返回值数据类型定义
export interface DelOneAndMoreUserResData extends ResponseData {
  data: string
}
