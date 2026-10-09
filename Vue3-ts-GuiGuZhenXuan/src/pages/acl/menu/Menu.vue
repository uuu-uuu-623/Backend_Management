<template>
  <div v-loading="loading" element-loading-text="加载中...">
    <el-card>
      <el-table :data="menuList" style="width: 100%; margin: 10px 0" row-key="id" border>
        <el-table-column prop="name" label="名称" width="200px" show-overflow-tooltip />
        <el-table-column prop="code" label="权限值" align="center" show-overflow-tooltip />
        <el-table-column prop="updateTime" label="修改时间" align="center" show-overflow-tooltip />
        <el-table-column label="操作" width="250" align="center">
          <template #="{ row }">
            <ButtonPermission value="btn.Permission.add">
              <el-button
                type="primary"
                size="small"
                :disabled="row?.level === 4 ? true : false"
                @click="add_MenuOrFuntion(row)"
              >
                {{ row?.level === 3 ? '添加功能' : '添加菜单' }}
              </el-button>
              <template #fallback>
                <el-button type="primary" size="small" disabled>
                  {{ row?.level === 3 ? '添加功能' : '添加菜单' }}
                </el-button>
              </template>
            </ButtonPermission>

            <ButtonPermission value="btn.Permission.update">
              <el-button
                type="warning"
                size="small"
                :disabled="row?.level === 1 ? true : false"
                @click="update_MenuOrFuntion(row)"
              >
                编辑
              </el-button>
              <template #fallback>
                <el-button type="warning" size="small" disabled>编辑</el-button>
              </template>
            </ButtonPermission>

            <ButtonPermission value="btn.Permission.remove">
              <template #default>
                <el-popconfirm
                  width="260"
                  icon="InfoFilled"
                  icon-color="#626AEF"
                  :title="`你确定要删除 ${row.name} 吗?`"
                  @confirm="Del_menuData(row)"
                >
                  <template #reference>
                    <el-button
                      type="danger"
                      size="small"
                      :disabled="row?.level === 1 ? true : false"
                    >
                      删除
                    </el-button>
                  </template>
                  <template #actions="{ confirm, cancel }">
                    <el-button size="small" @click="cancel">取消</el-button>
                    <el-button type="danger" size="small" @click="confirm" :loading="delLoading">
                      确定
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
              <template #fallback>
                <el-button type="danger" size="small" disabled>删除</el-button>
              </template>
            </ButtonPermission>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加 或者编辑的 对话框 -->
    <!-- 因为 添加菜单的逻辑 需要level+1 所以menuParams.level === 4 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="menuParams.id ? '编辑菜单' : menuParams.level === 4 ? '添加功能' : '添加菜单'"
      width="500"
      @close="cancel_AddOrUpdate"
    >
      <el-form ref="formRef" :model="menuParams" :rules="rules">
        <el-form-item label="名称:" label-width="80" prop="name">
          <el-input placeholder="请输入名称" v-model="menuParams.name" />
        </el-form-item>
        <el-form-item label="权限值:" label-width="80">
          <el-input placeholder="请输入权限值" v-model="menuParams.code" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel_AddOrUpdate">取消</el-button>
          <el-button type="primary" @click="save_AddOrUpdate" :loading="AddOrUpdate_saveLoading">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reqAddOrUpdateMenuData, reqMenuList, reqDelMenuData } from '@/api/acl/menuManagement'
import type { menu, MenuParams } from '@/api/acl/menuManagement/type'
import { ElMessage, type FormInstance } from 'element-plus'
import { ref, onMounted, nextTick } from 'vue'

defineOptions({
  name: 'Menu',
})

// 页面 加载状态
const loading = ref(false)
// 添加或编辑对话框中的保存按钮 的加载状态
const AddOrUpdate_saveLoading = ref(false)
// 删除按钮的 加载状态
const delLoading = ref(false)

// 用于 存储已有的菜单列表
const menuList = ref<menu[]>([])

// 控制 添加或者编辑的对话框 展示
const dialogFormVisible = ref(false)

// 用于收集 添加或编辑 已有菜单的数据
const menuParams = ref<MenuParams>({
  id: 0,
  code: '', //权限值
  level: 0, //几级菜单
  name: '', //菜单名字
  pid: 0, // pid 就是父亲的id -- 辨别是给哪个菜单添加的子菜单
})

// 表单 的ref标识
const formRef = ref<FormInstance>()
// 添加或编辑的 表单 校验规则
const rules = {
  name: [
    {
      required: true,
      message: '名称不能为空',
      trigger: 'blur',
    },
  ],
}

// 获取已有的菜单列表
const getHasMenuList = async () => {
  loading.value = true
  try {
    const res = await reqMenuList()
    if (res.code === 200) {
      menuList.value = res.data
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('操作错误')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getHasMenuList()
})

// 点击添加菜单按钮的 回调函数
const add_MenuOrFuntion = (row: menu) => {
  dialogFormVisible.value = true
  // 清空表单信息
  Object.assign(menuParams.value, {
    id: 0,
    code: '',
    level: row.level + 1,
    name: '',
    pid: row.id,
    // 因为点击的是添加菜单 是给点击的某个父菜单添加子菜单
    // 所有pid应该是 所点击的菜单的id
  })
  nextTick(() => {
    // 清空校验信息
    formRef.value?.clearValidate()
  })
}

// 点击编辑按钮的 回调函数
const update_MenuOrFuntion = (row: menu) => {
  dialogFormVisible.value = true
  Object.assign(menuParams.value, {
    id: row.id,
    code: row.code,
    level: row.level,
    name: row.name,
    pid: row.pid,
  })
  nextTick(() => {
    // 清空校验信息
    formRef.value?.clearValidate()
  })
}

// 点击 添加或者修改菜单信息对话框中的 保存按钮的回调函数
const save_AddOrUpdate = async () => {
  // 如果form表单还未挂载
  if (!formRef.value) return
  try {
    await formRef.value?.validate()
  } catch (err) {
    ElMessage.error('请重新检查')
    return
  }

  AddOrUpdate_saveLoading.value = true
  try {
    const res = await reqAddOrUpdateMenuData(menuParams.value)
    if (res.code === 200) {
      getHasMenuList()
      ElMessage.success(menuParams.value.id ? '修改成功' : '添加成功')
    }
  } catch (error) {
    ElMessage.error(menuParams.value.id ? '修改失败' : '添加失败')
  } finally {
    AddOrUpdate_saveLoading.value = false
    dialogFormVisible.value = false
  }
}

// 点击 添加或者修改菜单信息对话框中的 取消按钮和关掉对话框 的回调函数
const cancel_AddOrUpdate = () => {
  Object.assign(menuParams.value, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  dialogFormVisible.value = false
}

// 点击删除按钮 的回调函数
const Del_menuData = async (row: menu) => {
  // 前置拦截：如果已有删除请求在进行中，直接拒绝
  if (delLoading.value) return

  if (!row.id) return
  if (row.children) {
    ElMessage.warning('该菜单下有子菜单，不可以删除')
    return
  }
  delLoading.value = true
  try {
    const res = await reqDelMenuData(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      getHasMenuList()
    }
  } catch (error) {
    ElMessage.error('删除失败')
    return
  } finally {
    delLoading.value = false
  }
}
</script>

<style scoped></style>
