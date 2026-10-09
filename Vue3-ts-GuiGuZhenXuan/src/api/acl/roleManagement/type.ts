// 该文件用于编写 权限管理中的 角色管理模块 的类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 定义 获取单个角色 的数据类型
export interface rolesData {
  createTime?: string
  updateTime?: string
  id?: number
  roleName?: string
  remark?: string
}

// 定义 所有角色的数组
export type Records = rolesData[]

// 定义 要获取所有角色数据 的data类型
export interface Data_from_GetRoles {
  records: Records
  total: number
  size: number
  current: number
  pages: number
  searchCount: boolean
}

// 定义 获取所有角色数据 的返回值数据类型
export interface getRoles_ResData extends ResponseData {
  data: Data_from_GetRoles
}

// 定义 添加或者修改角色数据 的返回值数据类型
export interface AddOrUpdateRole_ResData extends ResponseData {
  data: string | null
}

// 定义 菜单权限 的数据类型
export interface MenuData {
  createTime: string
  updateTime: string
  id: number
  name: string
  pid: number
  code: string
  toCode: string
  type: number
  status: string
  level: number
  children: menuDataList | null
  select: boolean
}

// MenuData 中的children 是嵌套这一个又一个的menuData 且有多个孩子 所有是 数组
export type menuDataList = MenuData[]

// 定义 根据角色获取菜单权限请求 的返回值数据
export interface MenuPermissionByRole_ResData extends ResponseData {
  data: MenuData[]
}

// 定义 给角色分配权限 的返回值数据
export interface AssignPremissionToRole_ResData extends ResponseData {
  data: string | null
}
