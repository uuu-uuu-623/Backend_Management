// 该文件用于编写 权限管理中的 菜单管理模块 的类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 定义 菜单 的数据类型
export interface menu {
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
  children: menuList | null
  select: boolean
}

// children 是菜单类型嵌套
export type menuList = menu[]

// 定义 获取已有菜单列表的 返回值数据类型
export interface Getpermission_ResData extends ResponseData {
  data: menuList
}

// 定义 添加或修改 菜单信息要收集的数据 的数据类型
export interface MenuParams {
  id?: number
  code: string
  level: number
  name: string
  pid: number
}

// 定义 获取已有菜单列表的 返回值数据类型
export interface NothingResData extends ResponseData {
  data: string | null
}
