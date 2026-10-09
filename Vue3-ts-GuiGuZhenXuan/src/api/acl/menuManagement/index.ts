// 该文件用于编写 权限管理中的 菜单管理模块 的接口
import instance from '@/utils/instance'
import type { Getpermission_ResData, MenuParams, NothingResData } from './type'

enum API {
  // 获取 已有的菜单列表
  Get_MenuList = '/admin/acl/permission',
  // 新增菜单
  Add_MenuData = '/admin/acl/permission/save',
  // 修改菜单
  Update_MenuData = '/admin/acl/permission/update',
  // 删除菜单
  Del_MenuData = '/admin/acl/permission/remove',
}

// 请求 获取已有的菜单列表
export const reqMenuList = () => {
  return instance<any, Getpermission_ResData>({
    url: API.Get_MenuList,
  })
}

// 请求 添加或者修改菜单信息
export const reqAddOrUpdateMenuData = (data: MenuParams) => {
  if (data.id) {
    // 修改
    return instance<any, NothingResData>({
      url: API.Update_MenuData,
      method: 'put',
      data,
    })
  } else {
    return instance<any, NothingResData>({
      url: API.Add_MenuData,
      method: 'post',
      data,
    })
  }
}

// 请求 删除菜单信息
export const reqDelMenuData = (menuId: number) => {
  return instance<any, NothingResData>({
    url: `${API.Del_MenuData}/${menuId}`,
    method: 'delete',
  })
}
