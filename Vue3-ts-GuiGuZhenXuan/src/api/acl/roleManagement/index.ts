// 该文件用于编写 权限管理中的 角色管理模块 的接口
import instance from '@/utils/instance'
import type {
  getRoles_ResData,
  AddOrUpdateRole_ResData,
  rolesData,
  MenuPermissionByRole_ResData,
  AssignPremissionToRole_ResData,
} from './type'

enum API {
  // 获取角色分页列表的接口
  Get_AllroleData = '/admin/acl/role',
  // 请求 添加角色的接口
  Add_roleData = '/admin/acl/role/save',
  // 请求 修改角色的接口
  Update_roleData = '/admin/acl/role/update',
  // 请求 根据角色获取菜单权限 的接口
  Get_MenuPermissionByRole = '/admin/acl/permission/toAssign',
  // 请求 给角色分配权限 的接口
  Assign_permissionToRole = '/admin/acl/permission/doAssign',
  // 请求 删除角色 的接口
  Del_roleData = '/admin/acl/role/remove',
}

// 请求 获取角色的分页列表
export const reqRoleData = (page: number, limit: number, roleName?: string) => {
  return instance<any, getRoles_ResData>({
    url: `${API.Get_AllroleData}/${page}/${limit}`,
    params: { ...(roleName !== undefined && roleName !== '' && { roleName }) },
  })
}

// 请求 添加或者修改角色数据
export const reqAddOrUpdateRole = (role: rolesData) => {
  if (role.id) {
    return instance<any, AddOrUpdateRole_ResData>({
      url: API.Update_roleData,
      method: 'put',
      data: role,
    })
  } else {
    return instance<any, AddOrUpdateRole_ResData>({
      url: API.Add_roleData,
      method: 'post',
      data: role,
    })
  }
}

// 请求 根据角色 获取菜单权限
export const reqMenuPermission = (roleId: number) => {
  return instance<any, MenuPermissionByRole_ResData>({
    url: `${API.Get_MenuPermissionByRole}/${roleId}`,
  })
}

// 请求 给角色分配权限
export const reqAssignPermissionToRole = (roleId: number, permissionId: number[]) => {
  return instance<any, AssignPremissionToRole_ResData>({
    url: `${API.Assign_permissionToRole}?roleId=${roleId}&permissionId=${permissionId}`,
    method: 'post',
  })
}

// 请求 删除角色
export const reqDelRole = (roleId: number) => {
  return instance<any, any>({
    url: `${API.Del_roleData}/${roleId}`,
    method: 'delete',
  })
}
