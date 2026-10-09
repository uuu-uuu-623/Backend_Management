<template>
  <div v-loading="loading" element-loading-text="加载中...">
    <el-card>
      <el-form class="form">
        <el-form-item label="用户名:" style="margin: 0">
          <el-input placeholder="请您输入用户名" v-model.trim="searchUsername" clearable></el-input>
        </el-form-item>
        <el-form-item style="margin: 0">
          <el-button
            type="primary"
            :disabled="searchUsername ? false : true"
            @click="search"
            :loading="searchLoading"
          >
            搜索
          </el-button>
          <el-button @click="reset" :loading="resetLoading">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 20px 0">
      <!-- 按钮 -->
      <div>
        <ButtonPermission value="btn.User.add">
          <el-button type="primary" @click="addUser">添加</el-button>
          <template #fallback>
            <el-button type="primary" disabled>添加</el-button>
          </template>
        </ButtonPermission>
        <ButtonPermission value="btn.User.remove">
          <el-button
            type="danger"
            @click="SureBatchDal_DialogVisible = true"
            :disabled="selectedUserId.length > 0 ? false : true"
          >
            批量删除
          </el-button>
          <template #fallback>
            <el-button type="danger" disabled>批量删除</el-button>
          </template>
        </ButtonPermission>

        <!-- 表格 -->
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="user"
          @selection-change="handleSelectChange"
          ref="tableRef"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column type="index" label="#" align="center" />
          <el-table-column prop="id" label="id" align="center" show-overflow-tooltip />
          <el-table-column
            prop="username"
            label="用户名字"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="name" label="用户名称" align="center" show-overflow-tooltip />
          <el-table-column prop="roleName" label="用户角色" align="center" show-overflow-tooltip />
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column label="操作" align="center" width="300" min-width="280">
            <template #="{ row }">
              <ButtonPermission value="btn.User.assgin">
                <el-button icon="User" type="primary" size="small" @click="setRoles(row)">
                  分配角色
                </el-button>
                <template #fallback>
                  <el-button icon="User" type="primary" size="small" disabled>分配角色</el-button>
                </template>
              </ButtonPermission>

              <ButtonPermission value="btn.User.update">
                <el-button icon="Edit" type="warning" size="small" @click="editUser(row)">
                  编辑
                </el-button>
                <template #fallback>
                  <el-button icon="Edit" type="warning" size="small" disabled>编辑</el-button>
                </template>
              </ButtonPermission>

              <ButtonPermission value="btn.User.remove">
                <template #default>
                  <el-popconfirm
                    :title="`你确定要删除 ${row.username} 吗`"
                    width="250"
                    @confirm="delOneUser(row)"
                  >
                    <template #reference>
                      <el-button icon="Delete" type="danger" size="small">删除</el-button>
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
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 10, 15, 20]"
          background
          :pager-count="5"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="handleCurrentPageChange"
          @size-change="getAllUserData(true)"
        />
      </div>
    </el-card>

    <!-- 点击批量删除按钮 显示的弹窗 -->
    <el-dialog v-model="SureBatchDal_DialogVisible" title="提醒" width="500" align-center>
      <span>
        你确定要删除这
        <strong style="color: red">{{ selectedUserName.length }}</strong>
        个用户吗?
      </span>
      <!-- 使用 tag 来展示要批量删除的用户 -->
      <div class="batch-delete-tags">
        <el-tag
          class="user-tag"
          v-for="(item, index) in selectedUserName"
          :key="index"
          type="danger"
          effect="plain"
          size="default"
        >
          {{ item }}
        </el-tag>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="SureBatchDal_DialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSelectionToDelUser" :loading="batchDeleteLoading">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 抽屉 -->
    <!-- 添加或者更新 用户信息的抽屉 -->
    <el-drawer v-model="drawerVisible" direction="rtl">
      <template #header>
        <h4>{{ UserParams.id ? '编辑用户信息' : '添加新用户' }}</h4>
      </template>
      <template #default>
        <el-form ref="formRef" :model="UserParams" :rules="rules">
          <el-form-item label="用户名称:" prop="username">
            <el-input placeholder="请您输入用户名" v-model="UserParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称:" prop="name">
            <el-input placeholder="请您输入昵称" v-model="UserParams.name"></el-input>
          </el-form-item>
          <el-form-item label="用户密码:" v-if="!UserParams.id" prop="password">
            <el-input
              placeholder="请您输入密码"
              v-model="UserParams.password"
              type="password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item class="btn-item">
            <el-button @click="cancel_AddOrUpdateUserForm">取消</el-button>
            <el-button type="primary" @click="save_AddOrUpdateUserForm" :loading="UserSaveLoading">
              确定
            </el-button>
          </el-form-item>
        </el-form>
        <!--  -->
      </template>
    </el-drawer>

    <!-- 抽屉 用于分配角色 -->
    <el-drawer v-model="drawerVisible2" direction="rtl">
      <template #header>
        <h4>分配角色</h4>
      </template>
      <template #default>
        <el-form label-width="80">
          <el-form-item label="用户名:">
            <el-input :model-value="currentRoleUser?.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="职位列表:">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox-group v-model="checkedRolesId" @change="handleCheckedRoleChange">
              <el-checkbox
                v-for="item in allRolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item class="btn-item">
            <el-button @click="cancel_RoleAssignForm">取消</el-button>
            <el-button type="primary" @click="save_RoleAssignForm" :loading="RoleSaveLoading">
              确定
            </el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import {
  reqUserData,
  reqAddOrUpdateUser,
  reqRoleAssignData,
  reqToAssignRoles,
  reqDelOneUser,
  reqDelMoreUser,
} from '@/api/acl/userManagement'
import type { assignRoleToOneData, Record_from_UserData, Role } from '@/api/acl/userManagement/type'
import { ElMessage } from 'element-plus'
import { ref, onMounted, computed, nextTick } from 'vue'
import type { CheckboxValueType, FormInstance, TableInstance } from 'element-plus'

defineOptions({
  name: 'User',
})

// 用于绑定 搜索用户名的v-model
const searchUsername = ref('')

// 加载状态
const loading = ref<boolean>(false)
// 批量删除按钮的 加载状态
const batchDeleteLoading = ref<boolean>(false)
// 搜索按钮的 加载状态
const searchLoading = ref(false)
// 重置按钮的 加载状态
const resetLoading = ref(false)
// 控制用户表单的 保存按钮的加载状态
const UserSaveLoading = ref<boolean>(false)
// 控制角色表单的 保存按钮的加载状态
const RoleSaveLoading = ref<boolean>(false)

const currentPage = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)

// 定义表格的ref标识
const tableRef = ref<TableInstance>()

// 定义 存储所有用户数据的变量
const user = ref<Record_from_UserData[]>([])

// 控制添加或者更新 用户信息的抽屉 显示
const drawerVisible = ref<boolean>(false)
// 收集 发送或者更新 用户信息的数据
const UserParams = ref<Record_from_UserData>({
  id: 0,
  username: '',
  password: '',
  name: '',
})
// 用于收集用户信息的 表单的ref
const formRef = ref<FormInstance>()
// 表单的校验规则 -动态校验规则 当用户编辑信息时 不校验密码
const rules = computed(() => ({
  // 用户名
  username: [
    {
      required: true,
      min: 5,
      max: 10,
      message: '用户名大于5,不超过10',
      trigger: 'blur',
    },
  ],
  name: [
    {
      required: true,
      min: 2,
      max: 10,
      message: '用户昵称至少2位,最多10位',
      trigger: 'blur',
    },
  ],
  password: UserParams.value.id
    ? []
    : [
        {
          required: true,
          min: 5,
          max: 15,
          message: '密码大于5,不超过15',
          trigger: 'blur',
        },
      ],
}))

// 控制用于分配角色 的抽屉展示
const drawerVisible2 = ref<boolean>(false)
// 存储当前选择的角色(点击分配角色按钮时)
const currentRoleUser = ref<Record_from_UserData | null>(null)
// 用于控制全选多选框
const checkAll = ref<boolean>(false)
// 用于控制 不确定状态的 false即没全选也没全不选
const isIndeterminate = ref<boolean>(false)
// 用于 保存已选择的角色
// const checkedRoles = ref<Role[]>([])
// 用于 保存已选择的角色id
const checkedRolesId = ref<number[]>([])
// 用于存储 所有的角色信息
const allRolesList = ref<Role[]>([])
// 用于收集 为用户分配角色的数据
const assignRoleData = ref<assignRoleToOneData>({
  roleIdList: [],
  userId: 0,
})

// 存储已选择用户的信息
const selectedUserName = ref<string[]>([])
// 用于收集 存储的用户id 用于 批量删除
const selectedUserId = ref<number[]>([])
// 控制 确定批量删除的弹窗
const SureBatchDal_DialogVisible = ref(false)

// 获取用户分页列表 即所有用户的数据 的函数
const getAllUserData = async (resetPageToOne: boolean = false) => {
  // 是否需要 重置到第一页
  if (resetPageToOne) currentPage.value = 1

  loading.value = true
  try {
    const searchKeyword = searchUsername.value
    const res = await reqUserData(currentPage.value, pageSize.value, searchKeyword)
    if (res.code === 200) {
      user.value = res.data.records
      total.value = res.data.total
    }
  } catch {
    ElMessage.error('获取用户列表失败')
  } finally {
    // 取消加载状态
    loading.value = false
    searchLoading.value = false
  }
}

// 处理当前页改变
const handleCurrentPageChange = () => {
  getAllUserData()
}

onMounted(() => {
  getAllUserData()
})

// 点击添加按钮 的回调函数
const addUser = () => {
  // 展示抽屉 用于添加或者编辑用户信息
  drawerVisible.value = true

  // 重置表单信息
  Object.assign(UserParams.value, {
    id: 0,
    username: '',
    name: '',
    password: '',
    roleName: '',
  })

  // 清理字段的表单验证信息
  formRef.value?.clearValidate()
}

// 点击编辑按钮 的回调函数
const editUser = (row: Record_from_UserData) => {
  Object.assign(UserParams.value, {
    id: row.id,
    username: row.username,
    name: row.name,
    password: '', // 编辑时密码字段置空
  })
  // 展示抽屉 用于添加或者编辑用户信息
  drawerVisible.value = true
  // 清空校验信息
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 点击 添加或者编辑的 抽屉中的确定按钮的 回调函数
const save_AddOrUpdateUserForm = async () => {
  // 如果form表单还未挂载
  if (!formRef.value) return
  try {
    await formRef.value?.validate()
  } catch (error) {
    return
  }
  // 设置保存按钮加载状态 防止重复提交
  UserSaveLoading.value = true
  try {
    const res = await reqAddOrUpdateUser(UserParams.value)
    if (res.code === 200) {
      drawerVisible.value = false
      ElMessage.success(UserParams.value.id ? '更新成功' : '添加成功')

      // 刷新一次页面 防止修改的是自己的账户 导致后端查找不到用户
      window.location.reload()
    }
  } catch (error) {
    ElMessage.error(UserParams.value.id ? '更新失败' : `添加失败`)
  } finally {
    // 关闭按钮加载状态
    UserSaveLoading.value = false
  }
}

// 点击抽屉中的取消按钮的 回调函数
const cancel_AddOrUpdateUserForm = () => {
  drawerVisible.value = false
}

// 点击分配角色按钮的 回调函数
const setRoles = async (row: Record_from_UserData) => {
  // 重置全选框状态
  checkAll.value = false
  isIndeterminate.value = false

  // 利用之前收集数据的 UserParams 存数据
  currentRoleUser.value = row

  // 发请求前重置数据
  checkedRolesId.value = []
  allRolesList.value = []

  // 展示抽屉
  drawerVisible2.value = true

  // 发送请求 存取角色数据
  try {
    const res = await reqRoleAssignData(row.id as number)
    if (res.code === 200) {
      // 获取返回的数据
      allRolesList.value = res.data.allRolesList
      checkedRolesId.value = res.data.assignRoles.map((item) => item.id as number)

      // 检查点的角色
      // 1.判断是否已有分配 -- 修改 不确定状态的值
      // 2.判断是否为全选的状态 -- 修改全选状态的值
      isIndeterminate.value =
        checkedRolesId.value.length > 0 && checkedRolesId.value.length < allRolesList.value.length
      checkAll.value = checkedRolesId.value.length === allRolesList.value.length ? true : false
    }
  } catch (error) {}
}

// 当分配角色的抽屉中的 全选多选框发生改变时 的回调函数
const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedRolesId.value = val ? allRolesList.value.map((item) => item.id as number) : []
  // 现在为全选 所以不确定状态改变
  isIndeterminate.value = false
}

// 当选择的 角色的多选框改变时 触发的回调函数
const handleCheckedRoleChange = (valArr: CheckboxValueType[]) => {
  // 得到选择了几个
  const checkedCount = valArr.length
  // 全选则改变 checkAll状态
  checkAll.value = checkedCount === allRolesList.value.length

  // 当没全选也没全不选时 isIndeterminate 一直保持false
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRolesList.value.length
}

// 当点击分配角色的抽屉 的保存按钮的回调函数
const save_RoleAssignForm = async () => {
  // 保存按钮 加载状态
  RoleSaveLoading.value = true

  try {
    // 安全检查：防止未选择用户时触发保存
    if (!currentRoleUser.value?.id) {
      ElMessage.warning('请先选择要分配角色的用户')
      return
    }

    assignRoleData.value.userId = currentRoleUser.value?.id as number
    assignRoleData.value.roleIdList = checkedRolesId.value
    const res = await reqToAssignRoles(assignRoleData.value)
    if (res.code === 200) {
      ElMessage.success('角色分配成功')
      drawerVisible2.value = false
      getAllUserData()
    }
  } catch (err) {
    ElMessage.error('角色分配失败')
  } finally {
    RoleSaveLoading.value = false
  }
}

// 当点击分配角色的抽屉 的取消按钮的回调函数
const cancel_RoleAssignForm = () => {
  drawerVisible2.value = false
}

const handleSelectChange = (val: Record_from_UserData[]) => {
  // val 是已选的用户信息
  // 存储 已选择的用户信息
  selectedUserName.value = val.map((item) => item.username as string)
  // 存储 已选择的用户的id
  selectedUserId.value = val.map((item) => item.id as number)
}

// 点击删除按钮 的回调函数
const delOneUser = async (row: Record_from_UserData) => {
  try {
    const res = await reqDelOneUser(row.id as number)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      getAllUserData()
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 点击批量删除的 回调函数
const handleSelectionToDelUser = async () => {
  if (selectedUserId.value.length === 0) return
  batchDeleteLoading.value = true
  try {
    const res = await reqDelMoreUser(selectedUserId.value)
    if (res.code === 200) {
      ElMessage.success('批量删除成功')
      SureBatchDal_DialogVisible.value = false
      selectedUserName.value = []
      selectedUserId.value = []
      tableRef.value?.clearSelection()
      getAllUserData(true)
    }
  } catch (error) {
    ElMessage.error('批量删除失败')
  } finally {
    batchDeleteLoading.value = false
  }
}

// 点击搜索按钮的 回调函数
const search = async () => {
  searchLoading.value = true
  tableRef.value?.clearSelection()
  getAllUserData(true)
}

const reset = async () => {
  resetLoading.value = true
  searchUsername.value = ''
  tableRef.value?.clearSelection()
  try {
    await getAllUserData(true)
  } catch (error) {
    ElMessage.error('请求出错~')
  } finally {
    resetLoading.value = false
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

// 使用深度选择器覆盖内部样式
.btn-item {
  :deep(.el-form-item__content) {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: nowrap;
  }
}

//批量删除弹窗 相关的样式
.batch-delete-tags {
  margin-top: 12px;
  max-height: 240px; // 限制最大高度，超出滚动
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap; // 自动换行
  gap: 8px; // Tag 之间的间距
  padding-right: 4px; // 为滚动条预留空间，避免遮挡

  .user-tag {
    max-width: 100%; // 防止单个超长用户名撑破容器
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
