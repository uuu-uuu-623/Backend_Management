<template>
  <!-- 本子组件 用于完成 spu管理模块的 添加或修改spu功能的场景 -->
  <div v-loading="loading" element-loading-text="加载SPU数据中...">
    <el-form label-width="100" :model="hasSpuData">
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" style="width: 200px" v-model="hasSpuData.spuName" />
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select placeholder="请选择" style="width: 200px" v-model="hasSpuData.tmId">
          <el-option
            v-for="item in allTrademarkList"
            :key="item.id"
            :label="item.tmName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="请输入SPU描述" v-model="hasSpuData.description" />
      </el-form-item>
      <!-- 照片墙 -->
      <el-form-item label="SPU图标">
        <el-upload
          v-model:file-list="imagesList"
          list-type="picture-card"
          action="/api/admin/product/fileUpload"
          :headers="headers"
          :on-preview="handlePictureCardPreview"
          :before-upload="handleBeforeUpload"
          :before-remove="handleBeforeRemove"
          :on-success="handleUploadSuccess"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible" style="width: 400px">
          <el-image fit="cover" :src="dialogImageUrl" style="width: 100%" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <el-select
          :placeholder="
            UnSelectSpuBaseSaleList.length
              ? `还有${UnSelectSpuBaseSaleList.length}个销售属性可选择`
              : '无'
          "
          style="width: 200px; margin-right: 15px"
          v-model="spuSaleSelect"
        >
          <!-- 
            option的value值 这么做的原因是 
            要同时把 id和name 都发送请求至后台 所以要做拼接 
            最后的值 给到了 select绑定的 spuSaleSelect
          -->
          <el-option
            v-for="item in UnSelectSpuBaseSaleList"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}:${item.name}`"
          />
        </el-select>
        <el-button
          type="primary"
          icon="Plus"
          :disabled="UnSelectSpuBaseSaleList.length && spuSaleSelect ? false : true"
          @click="addSpuSaleAttr"
        >
          添加属性
        </el-button>
        <el-table border style="width: 100%; margin: 20px 0" :data="spuSaleList">
          <el-table-column label="序号" width="80" type="index" align="center" />
          <el-table-column label="销售属性名字" width="120" prop="saleAttrName" />
          <el-table-column label="销售属性值">
            <template #="{ row, $index }">
              <!-- 标签 -->
              <el-tag
                style="margin-right: 5px"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="handleClose(row, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 编辑 输入框 -->
              <el-input
                v-if="row.flag"
                ref="InputRef"
                v-model="inputValue"
                class="w-20"
                size="small"
                style="width: 100px"
                @keyup.enter="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              />
              <!-- 编辑按钮 -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                icon="Plus"
                type="primary"
                color="green"
                @click="showInput(row)"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #="{ row, $index }">
              <el-popconfirm title="确定要删除吗" @confirm="spuSaleList.splice($index, 1)">
                <template #reference>
                  <el-button type="danger" icon="Delete" circle />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="!spuSaleList.length || !spuSaleList[0]?.spuSaleAttrValueList?.length"
          @click="save"
        >
          保存
        </el-button>
        <el-button @click="changeViewToZone">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
// 引入spu组合式函数
import { AddOrUpdateSpuData } from '@/api/product/spu'
import { useSpuData } from './useSpuData'
import type {
  DataFromSpuSale,
  spuSaleValue,
  AddOrUpdateSpuResponseData,
} from '@/api/product/spu/type'
import type { UploadProps, InputInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, onMounted, nextTick, computed } from 'vue'
// 引入用户仓库 用于获取token 上传图片时用到
import useUserStore from '@/stores/modules/user'

defineOptions({
  name: 'SpuForm',
})

// 在添加或者修改图片的的时候 要带上请求头 - 是token
const UserStore = useUserStore()
const headers = { Token: UserStore.token }

// 引入hook中的 相关参数
const { loading, hasSpuData, allTrademarkList, imagesList, allBaseSpuSaleList, spuSaleList } =
  useSpuData()

// 照片墙 查看大图
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 销售属性值 中添加标签 中展示输入框需要的数据
const inputValue = ref('')
const InputRef = ref<InputInstance>()

// 存储 还未选择的spu销售属性下拉框 绑定的值 值里有id和name 拼接而成
const spuSaleSelect = ref('')

// 通过defineEmits获取父亲给的回调函数
const emit = defineEmits(['updateView'])

// 照片墙 点击照片墙中图片的 查看放大图片功能的回调函数
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

// 照片墙 上传文件之前的钩子
const handleBeforeUpload: UploadProps['onSuccess'] = (uploadFile) => {
  // 判断上传的图片 格式是否正确
  // console.log(uploadFile)
  if (
    uploadFile.type === 'image/jpeg' ||
    uploadFile.type === 'image/png' ||
    uploadFile.type === 'image/gif'
  ) {
    if (uploadFile.size / 1024 / 1024 < 4) {
      ElMessage.success('上传成功')
      return true
    } else {
      ElMessage.error('上传的文件大小超过4M')
    }
  } else {
    return ElMessage.error('上传的图片不是jpg、png、gif格式,请重新上传')
  }
}

// 照片墙 删除照片墙图片之前 的钩子 回调函数
const handleBeforeRemove = async () => {
  try {
    await ElMessageBox.confirm('你确定要删除吗?', '注意', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    return true
  } catch (error) {
    ElMessage({
      type: 'info',
      message: '取消成功',
    })
    return false
  }
}

// 上传成功后的回调 - 用服务器真实地址替换 Blob 地址
const handleUploadSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {
  if (response.code === 200) {
    // 关键：用后端返回的真实图片路径替换掉临时的 blob 地址
    // 根据你的后端接口返回结构调整 response.data 的路径
    // console.log(response, uploadFile, uploadFiles)

    uploadFile.url = response.data
    // imagesList.value.push({ name: uploadFile.name, url: uploadFile.url as string })
  } else {
    ElMessage.error(response.message || '图片上传失败')
    // 上传失败时移除该文件
    const index = uploadFiles.indexOf(uploadFile)
    if (index > -1) {
      uploadFiles.splice(index, 1)
    }
  }
}

// 计算当前spu还没选择的spu销售属性 渲染到对应的下拉框
const UnSelectSpuBaseSaleList = computed(() => {
  // 利用数组去重的思想 去除已有的属性 剩下还没有的
  const unSelectArr = allBaseSpuSaleList.value.filter((item) => {
    return spuSaleList.value.every((ele) => {
      return ele.saleAttrName !== item.name
    })
  })
  return unSelectArr
})

// 添加spu销售属性 的回调函数
const addSpuSaleAttr = () => {
  // 点击之后 先分离 得到选择的销售属性的数据
  const [spuSaleid, spuSaleName] = spuSaleSelect.value.split(':')

  // 再清空下拉框的数据 和 删除未选择spu销售属性数组的相应数据
  spuSaleSelect.value = ''

  // 定义 新的销售属性数组 收集数据
  let newSpuSaleAttr: DataFromSpuSale = {
    baseSaleAttrId: Number(spuSaleid),
    saleAttrName: spuSaleName,
    spuId: hasSpuData.value.id as number,
    spuSaleAttrValueList: [],
  }
  // 把新添加的数据 推进数组
  spuSaleList.value.push(newSpuSaleAttr)
}

// 点击表格中 添加属性值标签的回调 展示输入框
const showInput = (row: DataFromSpuSale) => {
  row.flag = true // flag管理 每个输入框的展示状态
  nextTick(() => {
    // 编辑状态 输入框自动获取焦点
    InputRef.value!.input!.focus()
  })
}

// spu销售属性值 添加属性值时 当输入框不为空 则push进数组
const handleInputConfirm = (row: DataFromSpuSale) => {
  // 做出判断 属性值不能为空 且不能重复
  // 判断属性值是否为空
  if (inputValue.value.trim() === '') {
    ElMessage.error('属性值不能为空')
    row.flag = false
    return
  }

  // 判断属性值是否重复
  const repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName === inputValue.value.trim()
  })
  if (repeat) {
    ElMessage.error('属性值不能重复')
    inputValue.value = ''
    row.flag = false
    return
  }

  // 判断都通过之后
  // 定义 新的销售属性值数组并收集数据
  const newSpuSaleAttrValue: spuSaleValue = {
    saleAttrValueName: inputValue.value,
    baseSaleAttrId: row.baseSaleAttrId,
    spuId: row.spuId,
  }

  // 收集之后 整理 push进 spuSaleList
  row.spuSaleAttrValueList.push(newSpuSaleAttrValue)
  ElMessage.success('属性值添加成功')
  inputValue.value = ''
  row.flag = false
}

// spu销售属性值 表格中的 标签tag 删除标签的回调函数
const handleClose = (row: DataFromSpuSale, index: number) => {
  row.spuSaleAttrValueList.splice(index, 1)
}

// 点击保存按钮的回调
const save = async () => {
  // 整理照片墙 和 销售属性  再发送请求
  // 然后通知 父组件切换场景

  if (!spuSaleList.value.length) {
    ElMessage.warning('请至少添加一个销售属性')
    return
  }

  // 1.整理照片墙 把之前改的名字 换成正确的
  hasSpuData.value.spuImageList = imagesList.value.map((item) => {
    return {
      imgName: item.name,
      imgUrl: item.url,
    }
  })
  // 2. 整理销售属性
  hasSpuData.value.spuSaleAttrList = spuSaleList.value

  // 3.发请求
  try {
    const res: AddOrUpdateSpuResponseData = await AddOrUpdateSpuData(hasSpuData.value)
    if (res.code === 200) {
      ElMessage.success(hasSpuData.value.id ? '修改成功' : '添加成功')
    }
  } catch (error) {
    ElMessage.error(hasSpuData.value.id ? '修改失败' : '添加失败')
  }

  // 4.切换场景 后面的true 代表 是否需要重新获取 spu数据列表
  // 根据id判断 是add场景 还是update场景
  const addOrUpdateStatus = hasSpuData.value.id ? 'update' : 'add'
  emit('updateView', {
    viewNum: 0,
    refreshAfterSave: true,
    addOrUpdateStatus,
    isUseCategory: false,
  })

  // 要清空 spuSaleSelect  -- spu销售属性的下拉框
  // 如果不清空 会出现数据残留 从而导致 在修改的场景下 出现已有的基础销售属性
  // 取消按钮 也是一样
  spuSaleSelect.value = ''
}

// 点击取消按钮的回调 切换场景零
const changeViewToZone = () => {
  // 传递参数 给父组件修改场景
  emit('updateView', {
    viewNum: 0,
    refreshAfterSave: false,
    addOrUpdateStatus: 'update',
    isUseCategory: false,
  })
  //取消的话 就在当前页就行了 所以是update 不用变换当前页码
  spuSaleSelect.value = ''
}
</script>

<style scoped></style>
