<template>
  <div>
    <!-- 卡片 -->
    <el-card>
      <!-- 卡片顶部添加品牌按钮 -->
      <ButtonPermission value="btn.Trademark.add">
        <template #default>
          <el-button type="primary" size="default" icon="Plus" @click="showDialog">
            添加品牌
          </el-button>
        </template>
        <template #fallback>
          <el-button type="primary" size="default" icon="Plus" disabled>添加品牌</el-button>
        </template>
      </ButtonPermission>

      <!-- 表格 -->
      <el-table border style="width: 100%; margin: 20px 0" :data="trademarkArr" :lazy="true">
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          min-width="80px"
          align="center"
          :resizable="false"
        ></el-table-column>
        <el-table-column label="品牌名称" :resizable="false" prop="tmName"></el-table-column>
        <el-table-column label="品牌logo" :resizable="false">
          <template #="{ row, $index }">
            <!-- row 是trademarkArr里的每个数据 $index是索引号 -->
            <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作" :resizable="false">
          <template #="{ row }">
            <ButtonPermission value="btn.Trademark.update">
              <template #default>
                <el-button type="warning" icon="Edit" circle @click="showEditDialog(row)" />
              </template>
              <template #fallback>
                <el-button type="warning" icon="Edit" circle disabled></el-button>
              </template>
            </ButtonPermission>
            <!-- 下面为确认是否删除的弹框 -->
            <ButtonPermission value="btn.Trademark.remove">
              <!-- 有权限时的完整交互 -->
              <el-popconfirm
                title="你确定要删除吗"
                icon="Delete"
                icon-color="red"
                @confirm="deleteTrademark(row.id)"
              >
                <template #reference>
                  <el-button type="danger" icon="Delete" circle />
                </template>
              </el-popconfirm>
              <!-- 无权限时的回退 UI -->
              <template #fallback>
                <el-button type="danger" icon="Delete" circle disabled />
              </template>
            </ButtonPermission>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <!-- 
      v-model:current-page：设置分页器当前页码
      v-model:page-size：每页显示条目个数
      :page-sizes：用于设置下拉菜单数据
      background：设置分页器按钮的背景颜色
      layout：设置分页器六个子组件的位置
    -->
      <el-pagination
        style="padding: 0 10px"
        v-model:current-page="pageNow"
        v-model:page-size="pageSize"
        :page-sizes="[1, 2, 3, 4, 5, 6]"
        size="default"
        :disabled="false"
        :pager-count="5"
        background
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @change="pageNoChange"
        @size-change="psizeChange"
      />
    </el-card>

    <!-- 对话框组件 用于添加和修改品牌 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id === 0 ? '添加品牌' : '修改品牌'"
      width="500"
    >
      <!-- 表单 -->
      <el-form style="width: 80%" ref="elformRef" :rules="rules" :model="trademarkParams">
        <el-form-item label="品牌名称" label-width="88" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="88" prop="logoUrl">
          <!-- action 请求url 
              这里是上传图片 要带上api 但是这里要注意前缀 因为走的不是代理 -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleAvatarError"
          >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">可上传 jpg/png/gif 文件 文件大小不超过 4M</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 确定和取消按钮 使用了插槽 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import {
  reqTrademarkLimitList,
  reqAddTrademark,
  reqUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import type {
  TrademarkArr,
  Records,
  TrademarkLimitListResponseData,
  addTrademarkResponseData,
  updateTrademarkResponseData,
  deleteTrademarkResponseData,
} from '@/api/product/trademark/type'
import useUserStore from '@/stores/modules/user'
import type { UploadProps } from 'element-plus/lib'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'Trademark' })

// 初始化分页器当前分页
let pageNow = ref<number>(1)
// 初始化一页表格里展示多少数据
let pageSize = ref<number>(3)
// 初始化已有品牌数据的总数
let total = ref<number>(0)
// 存放品牌数据  -传递给table的数据
let trademarkArr = ref<Records | null>(null)

// 设置对话框的展示
let dialogFormVisible = ref<boolean>(false)

// el-form 表单的的ref标识 用于表单校验
const elformRef = ref<FormInstance>()

// 定义品牌
let trademarkParams: TrademarkArr = reactive({
  id: 0,
  logoUrl: '',
  tmName: '',
})

// 在添加或者修改图片的的时候 要带上请求头 - 是token
const UserStore = useUserStore()
const headers = { Token: UserStore.token }

// 请求品牌数据函数
const getTradementLimitList = async () => {
  try {
    const res: TrademarkLimitListResponseData = await reqTrademarkLimitList(
      pageNow.value,
      pageSize.value,
    )
    if (res.code === 200) {
      total.value = res.data.total
      trademarkArr.value = res.data.records
    }
  } catch (error) {}
}

// 挂载时 请求列表
onMounted(() => {
  getTradementLimitList()
})

// current-page 或 page-size 更改时触发
const pageNoChange = () => {
  // 再次发请求即可
  // 因为分页器 使用了v-model
  getTradementLimitList()
}

// 增加一个新功能 如果当没改变page-size 之前访问的是最后一页比如说是11页
// 当page-size改变之后 就没有11页了
// 那么就让用户访问第一页
const psizeChange = () => {
  pageNow.value = 1
}

// 打开 添加品牌的对话框 回调
const showDialog = () => {
  dialogFormVisible.value = true
  // 要在每次添加品牌之前 清空数据
  trademarkParams.logoUrl = ''
  trademarkParams.tmName = ''

  /* 
  细节的一个点
  因为对话框中的标题变化的逻辑是看 id是不是0
  如果用户先点的修改操作的按钮 那么id就是被赋值
  用户再次点击添加操作的时候 id被赋值了 所以显示的就为 '修改品牌'
  所以要归0  */

  trademarkParams.id = 0

  // 细节一个点 打开之前清除 之前表单存在的报错信息
  // 但是更细节的是 一开始点击添加品牌按钮的时候是没有表单的
  // 即不存在elformRef    所以执行 clearValidate() 会爆出undefined
  // 可以使用 ?. 这个可选符号 或者是 nextTick() 下一轮
  // 同时 点击修改的时候也要清空校验的报错信息
  elformRef.value?.clearValidate()

  /* nextTick(() => {
    elformRef.value?.clearValidate()
  }) */
}

// 打开 修改品牌的对话框 回调
const showEditDialog = (row: TrademarkArr) => {
  elformRef.value?.clearValidate()
  dialogFormVisible.value = true

  // 收集品牌数据 用作展示
  trademarkParams.id = row.id
  trademarkParams.logoUrl = row.logoUrl
  trademarkParams.tmName = row.tmName
  // console.log(row)
}

// 成功上传图片之前的 判断回调函数
const beforeAvatarUpload: UploadProps['onSuccess'] = (rawFile) => {
  // 判断是否 是png jpg gif 三种格式的图片
  // 判断是否 图片大小超过4M
  if (
    rawFile.type === 'image/gif' ||
    rawFile.type === 'image/png' ||
    rawFile.type === 'image/jpeg'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage.error('上传的文件大小超过4M')
    }
  } else {
    ElMessage.error('上传的文件不是jpg、png、gif格式,请重新上传')
    return false
  }
}

// 成功上传图片 回调 可以给用户提示
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  // response -- 上传成功 服务器返回的数据
  // console.log(response, uploadFile)
  trademarkParams.logoUrl = response.data
  ElMessage({
    type: 'success',
    message: '上传成功',
    duration: 1000,
  })
}

// 图片上传失败 回调
const handleAvatarError = () => {
  ElMessage({
    type: 'error',
    message: '上传失败',
    duration: 1000,
  })
}

// 取消添加或修改品牌
const cancel = () => {
  dialogFormVisible.value = false
}

// 确认添加或修改品牌 发送请求
const confirm = async () => {
  // 当点击确认按钮的时候 要把全部表单项都校验一边 成功之后才可以走下去
  await elformRef.value?.validate()

  // 添加品牌是不带id的 所以添加和修改品牌 要做出判断
  if (!trademarkParams.id) {
    // 发送添加品牌请求
    const res: addTrademarkResponseData = await reqAddTrademark(
      trademarkParams.logoUrl,
      trademarkParams.tmName,
    )

    // 添加品牌 接口请求成功
    if (res.code === 200) {
      ElMessage.success('添加成功')
      // 再次获取所有品牌数据 -- 及时更新数据
      getTradementLimitList()
      // 取消对话框
      dialogFormVisible.value = false
    } else {
      // 失败
      ElMessage.error('添加失败')
    }
  } else {
    // 修改品牌是不带id的
    // 发送修改品牌请求
    const updateRes: updateTrademarkResponseData = await reqUpdateTrademark(
      trademarkParams.id,
      trademarkParams.logoUrl,
      trademarkParams.tmName,
    )

    // 修改品牌 接口请求成功
    if (updateRes.code === 200) {
      ElMessage.success('修改成功')
      // 再次获取所有品牌数据 -- 及时更新数据
      getTradementLimitList()
      // 取消对话框
      dialogFormVisible.value = false
    } else {
      ElMessage.error('修改失败')
    }
  }
}

// 删除品牌 发送请求
const deleteTrademark = async (id: number) => {
  try {
    const res: deleteTrademarkResponseData = await reqDeleteTrademark(id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      getTradementLimitList()
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    console.dir(error)
  }
}

// 校验品牌名称
const validatorTmName = (rule: any, value: any, callback: any) => {
  if (typeof value === 'string' && value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称长度要大于等于2'))
  }
}

// 校验logo是否上传
const validatorlogoUrl = (rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback('请上传品牌logo')
  }
}

// 表单校验规则
const rules = reactive<FormRules<typeof trademarkParams>>({
  tmName: [
    { required: true, trigger: 'blur', message: '请输入品牌名称' },
    { validator: validatorTmName, trigger: 'blur' },
  ],
  logoUrl: [{ required: true, validator: validatorlogoUrl }],
})
</script>

<style scoped lang="scss">
.avatar-uploader {
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>

<style lang="scss">
.avatar-uploader {
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
