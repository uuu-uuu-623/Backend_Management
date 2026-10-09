// 该文件用于编写 权限管理中的 用户管理模块 的接口
import instance from '@/utils/instance'
import type {
  UserResData,
  addOrUpdateUserResData,
  Record_from_UserData,
  UserRolesAssignResData,
  assignRoleResData,
  assignRoleToOneData,
  DelOneAndMoreUserResData,
} from './type'
enum API {
  // 获取用户分页列表 即所有用户的数据
  Get_UserData = '/admin/acl/user',
  // 新增用户的接口
  Add_UserData = '/admin/acl/user/save',
  // 更新用户信息的接口
  Update_UserData = '/admin/acl/user/update',
  // 获取用户角色分配信息
  Get_RoleAssign = '/admin/acl/user/toAssign',
  // 给某个用户 分配角色
  To_AssignRole = '/admin/acl/user/doAssignRole',
  // 删除单个用户
  Del_OneUser = '/admin/acl/user/remove',
  // 批量删除用户
  Del_MoreUser = '/admin/acl/user/batchRemove',
}

// 请求得到 用户分页列表 即所有的用户数据
// 判断有无 username 用于搜索
export const reqUserData = (page: number, limit: number, username?: string) => {
  return instance<any, UserResData>({
    url: `${API.Get_UserData}/${page}/${limit}`,
    params: { ...(username !== undefined && username !== '' && { username }) },
  })
}

// 请求新增或者更新用户信息
export const reqAddOrUpdateUser = (data: Record_from_UserData) => {
  if (data.id) {
    // 有id 即为更改用户信息
    return instance<any, addOrUpdateUserResData>({
      url: API.Update_UserData,
      method: 'put',
      data,
    })
  } else {
    // 新增用户的请求
    return instance<any, addOrUpdateUserResData>({
      url: API.Add_UserData,
      method: 'post',
      data,
    })
  }
}

// 请求获取角色分配信息
export const reqRoleAssignData = (adminId: number) => {
  return instance<any, UserRolesAssignResData>({
    url: `${API.Get_RoleAssign}/${adminId}`,
  })
}

// 请求 给某个用户分配角色
export const reqToAssignRoles = (data: assignRoleToOneData) => {
  return instance<any, assignRoleResData>({
    url: API.To_AssignRole,
    method: 'post',
    data,
  })
}

// 请求 删除单个用户
export const reqDelOneUser = (userId: number) => {
  return instance<any, DelOneAndMoreUserResData>({
    url: `${API.Del_OneUser}/${userId}`,
    method: 'delete',
  })
}

export const reqDelMoreUser = (userId: number[]) => {
  return instance<any, DelOneAndMoreUserResData>({
    url: API.Del_MoreUser,
    method: 'delete',
    data: userId,
    headers: {
      'Content-Type': 'application/json', //  必须显式声明
    },
  })
}
