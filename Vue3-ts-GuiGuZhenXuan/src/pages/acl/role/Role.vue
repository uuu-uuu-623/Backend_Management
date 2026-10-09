<template>
  <div v-loading="loading" element-loading-text="加载中...">
    <el-card>
      <el-form class="form" @submit.prevent="search">
        <el-form-item label="角色名称:" style="margin: 0">
          <el-input
            placeholder="请您输入角色名称"
            clearable
            v-model.trim="searchRoleName"
            @keyup.enter="search"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin: 0">
          <el-button
            type="primary"
            :disabled="!searchRoleName"
            :loading="searchLoading"
            @click="search"
          >
            搜索
          </el-button>
          <el-button @click="reset" :loading="resetLoading">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 20px 0">
      <div>
        <el-button type="primary" icon="Plus" @click="addRole">添加角色</el-button>
        <el-table border style="margin: 20px 0" :data="roles">
          <el-table-column label="#" type="index" align="center" width="60"></el-table-column>
          <el-table-column
            prop="id"
            label="id"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" width="300" align="center">
            <template #="{ row }">
              <ButtonPermission value="btn.Role.assgin">
                <el-button icon="User" type="primary" size="small" @click="assignPermission(row)">
                  分配权限
                </el-button>
                <template #fallback>
                  <el-button icon="User" type="primary" size="small" disabled>分配权限</el-button>
                </template>
              </ButtonPermission>

              <ButtonPermission value="btn.Role.update">
                <el-button icon="Edit" type="warning" size="small" @click="updateRole(row)">
                  编辑
                </el-button>
                <template #fallback>
                  <el-button icon="Edit" type="warning" size="small" disabled>编辑</el-button>
                </template>
              </ButtonPermission>

              <ButtonPermission value="btn.Role.remove">
                <template #default>
                  <el-popconfirm
                    width="220"
                    icon="InfoFilled"
                    icon-color="#626AEF"
                    :title="`你确定要删除角色 ${row.roleName} 吗`"
                    @confirm="Del_role(row.id)"
                  >
                    <template #reference>
                      <el-button icon="Delete" type="danger" size="small">删除</el-button>
                    </template>
                    <template #actions="{ confirm, cancel }">
                      <el-button size="small" @click="cancel">取消</el-button>
                      <el-button type="danger" size="small" @click="confirm">确定</el-button>
                    </template>
                  </el-popconfirm>
                </template>
                <template #fallback>
                  <el-button icon="Delete" type="danger" size="small" disabled>删除</el-button>
                </template>
              </ButtonPermission>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 10, 15, 20]"
          background
          :pager-count="5"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- 添加或者修改角色信息的 对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="roleParams.id ? '编辑角色' : '添加角色'"
      width="500"
    >
      <el-form :model="roleParams" :rules="rules" ref="formRef">
        <el-form-item label="角色名称:" prop="roleName">
          <el-input
            autocomplete="off"
            v-model="roleParams.roleName"
            placeholder="请输入要添加的角色名称"
            @keyup.enter="save_AddOrUpdateRoleData"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="save_AddOrUpdateRoleData"
            :loading="AddOrUpdate_SaveLoading"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 抽屉 分配权限 -->
    <el-drawer v-model="drawerVisiable">
      <template #header>
        <h4>分配角色权限</h4>
      </template>
      <template #default>
        <el-tree
          ref="tree"
          style="max-width: 600px"
          :data="menuData"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="defaultProps"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawerVisiable = false">取消</el-button>
          <el-button
            type="primary"
            @click="save_AssignPermission"
            :loading="save_assignPermissionLoading"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import {
  reqRoleData,
  reqAddOrUpdateRole,
  reqMenuPermission,
  reqAssignPermissionToRole,
  reqDelRole,
} from '@/api/acl/roleManagement'
import type { rolesData, MenuData } from '@/api/acl/roleManagement/type'
import { ElMessage, type FormInstance, type TreeInstance } from 'element-plus'
import { ref, onMounted, nextTick } from 'vue'

const defaultProps = {
  children: 'children',
  label: 'name',
}

defineOptions({
  name: 'Role',
})

// 整页加载状态
const loading = ref(false)
// 搜索按钮的 加载状态
const searchLoading = ref(false)
// 重置按钮的 加载状态
const resetLoading = ref(false)
// 添加或编辑角色信息对话框中保存按钮的 加载状态
const AddOrUpdate_SaveLoading = ref(false)
// 分配权限抽屉的保存按钮 的加载状态
const save_assignPermissionLoading = ref(false)

// 搜索框绑定的数据
const searchRoleName = ref('')

// 分页器
const currentPage = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)

// 用于存储 获取的所有角色数据
const roles = ref<rolesData[]>([])

// 用于收集 添加或者修改的 角色数据 发送请求
const roleParams = ref<rolesData>({
  id: 0,
  remark: '',
  roleName: '',
})
// 定义form表单的ref标识
const formRef = ref<FormInstance>()
// 控制 添加或者修改角色信息的对话框展示
const dialogFormVisible = ref(false)
// 定义 添加或者修改角色信息的对话框中表单 的校验规则
const rules = {
  roleName: [
    {
      required: true,
      min: 2,
      max: 15,
      trigger: 'blur',
      message: '角色名称长度至少两位,最多15位',
    },
  ],
}

// 控制抽屉展示
const drawerVisiable = ref(false)
// 点击分配权限按钮时 收集角色id
const roleIdWhenClick_assignPermission = ref<number | null>(null)
// 用于 存储请求得到的 菜单权限数据
const menuData = ref<MenuData[]>([])
// 已选择的 菜单权限
const selectedPermission = ref<number[]>([])

// 树形控件的ref标识
const tree = ref<TreeInstance>()

// 获取全部角色信息
const getAllRolesData = async (resetPage = false) => {
  if (resetPage) currentPage.value = 1

  // 开启加载状态
  loading.value = true

  try {
    const res = await reqRoleData(currentPage.value, pageSize.value, searchRoleName.value)
    if (res.code === 200) {
      roles.value = res.data.records
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('请求失败,请重新加载...')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getAllRolesData(true)
})

// 分页器 当前页改变的回调函数
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getAllRolesData()
}

// 分页器 当前size 大小改变的回调函数
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getAllRolesData(true)
}

// 点击搜索按钮 的回调函数
const search = async () => {
  searchLoading.value = true
  try {
    await getAllRolesData(true)
  } finally {
    searchLoading.value = false
  }
}

// 点击重置按钮 的回调函数
const reset = async () => {
  resetLoading.value = true
  searchRoleName.value = ''
  try {
    await getAllRolesData(true)
  } finally {
    resetLoading.value = false
  }
}

// 点击添加按钮 的回调函数
const addRole = () => {
  // 展示对话框
  dialogFormVisible.value = true
  Object.assign(roleParams.value, {
    id: 0,
    remark: '',
    roleName: '',
  })
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 点击编辑按钮 的回调函数
const updateRole = (row: rolesData) => {
  // 展示对话框
  dialogFormVisible.value = true
  Object.assign(roleParams.value, {
    id: row.id,
    roleName: row.roleName,
    remark: row.remark,
  })
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 点击 添加或者编辑角色信息的 保存按钮的回调
const save_AddOrUpdateRoleData = async () => {
  // 如果form表单还未挂载
  if (!formRef.value) return
  try {
    await formRef.value?.validate()
  } catch (err) {
    ElMessage.error('请重新检查')
    return
  }
  AddOrUpdate_SaveLoading.value = true

  try {
    const res = await reqAddOrUpdateRole(roleParams.value)
    if (res.code === 200) {
      ElMessage.success(roleParams.value.id ? '更新成功' : '添加成功')
      dialogFormVisible.value = false
      roleParams.value.id ? getAllRolesData() : getAllRolesData(true)
    }
  } catch (error: any) {
    ElMessage.error(
      roleParams.value.id ? '更新失败' : error.message === '服务繁忙' ? '用户名已存在' : '添加失败',
    )
  } finally {
    AddOrUpdate_SaveLoading.value = false
  }
}

// 递归 过滤菜单已选权限的状态
const filterMenuPermission = (allData: MenuData[], initData: number[]) => {
  allData.forEach((item) => {
    // 只需要收集 已选择的第四级的id
    if (item.select && item.level === 4) {
      initData.push(item.id)
    }
    // 递归遍历
    if (item.children && item.children.length > 0) {
      filterMenuPermission(item.children, initData)
    }
  })
  return initData
}

// 点击 分配权限按钮 的回调函数
const assignPermission = async (row: rolesData) => {
  if (!row.id) return
  roleIdWhenClick_assignPermission.value = row.id //下面保存按钮需要用到
  drawerVisiable.value = true
  try {
    const res = await reqMenuPermission(row.id as number)
    if (res.code === 200) {
      menuData.value = res.data
      // 调用递归函数 - 过滤已选状态 传递所有数据和初始数组
      selectedPermission.value = filterMenuPermission(menuData.value, [])

      // ✅ 等待 Tree DOM 渲染完成后，手动设置选中
      nextTick(() => {
        // 第二个参数 false = 不进行父子联动
        // Tree 会根据实际选中的叶子节点，自动推导出哪些父级应该半选
        tree.value?.setCheckedKeys(selectedPermission.value, false)
      })
    }
  } catch (error) {
    ElMessage.error('操作失败')
    drawerVisiable.value = false
  }
}

// 点击 分配权限抽屉中的保存按钮 的回调函数
const save_AssignPermission = async () => {
  if (!roleIdWhenClick_assignPermission.value) return
  save_assignPermissionLoading.value = true

  // 通过 tree的暴露方法 收集被选中状态的permissionId (全选)
  const perIdArr = (tree.value?.getCheckedKeys() || []) as number[]
  // console.log(perIdArr)

  // 收集半选的 父亲节点
  const parentPerIdArr = (tree.value?.getHalfCheckedKeys() || []) as number[]
  // console.log(parentPerIdArr)

  // 收集permissionId 全选和半选状态
  const permissionId = [...perIdArr, ...parentPerIdArr]
  const roleId = roleIdWhenClick_assignPermission.value

  try {
    const res = await reqAssignPermissionToRole(roleId, permissionId)
    if (res.code === 200) {
      ElMessage.success('权限分配成功')
      drawerVisiable.value = false
      // 权限分配成功之后 刷新页面 重新获取用户新的信息
      window.location.reload()
    }
  } catch (error) {
    ElMessage.error('权限分配失败')
  } finally {
    save_assignPermissionLoading.value = false
  }
}

// 确定删除 的回调函数
const Del_role = async (id: number) => {
  try {
    const res = await reqDelRole(id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      getAllRolesData()
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}
</style>
