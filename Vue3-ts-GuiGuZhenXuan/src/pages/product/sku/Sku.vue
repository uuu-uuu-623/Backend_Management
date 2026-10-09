<template>
  <div>
    <!-- 表格 sku数据展示 -->
    <el-card>
      <el-table style="width: 100%; margin: 10px 0" border :data="skuInfo">
        <el-table-column label="序号" width="80" align="center" type="index" />
        <el-table-column prop="skuName" label="名称" width="150" />
        <el-table-column prop="skuDesc" label="描述" width="250">
          <template #default="{ row }">
            <div class="desc-cell" @click="openDetail(row)">
              <div class="text-ellipsis-2">{{ row.skuDesc }}</div>
              <span v-show="row.skuDesc.length > 50" class="view-more">查看详情 &gt;</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="默认图片" width="150">
          <template #="{ row }">
            <el-image
              :src="row.skuDefaultImg"
              fit="fill"
              style="width: 100px; height: 100px"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(g)" width="150" />
        <el-table-column prop="price" label="价格" width="150" />
        <el-table-column fixed="right" label="操作" width="250" min-width="200">
          <template #default="{ row }">
            <ButtonPermission value="btn.Sku.updown">
              <el-tooltip :content="row?.isSale === 1 ? '下架商品' : '上架商品'" :hide-after="0">
                <!-- 
                如果 row.isSale 当前为 1 就是上架状态 要下架商品--即灰色向下箭头
                再点一下就是0 下架状态 要上架商品--即绿色向上箭头
              -->
                <el-button
                  :type="row?.isSale === 1 ? 'info' : 'success'"
                  circle
                  :icon="row?.isSale === 1 ? 'Bottom' : 'Top'"
                  @click="UpdateSaleStatus(row)"
                  :loading="row.loading"
                ></el-button>
              </el-tooltip>
              <template #fallback>
                <el-button
                  :type="row?.isSale === 1 ? 'info' : 'success'"
                  circle
                  :icon="row?.isSale === 1 ? 'Bottom' : 'Top'"
                  disabled
                ></el-button>
              </template>
            </ButtonPermission>

            <ButtonPermission value="btn.Sku.update">
              <el-tooltip content="编辑" :hide-after="0">
                <el-button
                  type="warning"
                  circle
                  icon="Edit"
                  @click="ElMessage.error('暂不可用,敬请期待')"
                ></el-button>
              </el-tooltip>
              <template #fallback>
                <el-button type="warning" circle icon="Edit" disabled></el-button>
              </template>
            </ButtonPermission>

            <ButtonPermission value="btn.Sku.detail">
              <el-tooltip content="详情" :hide-after="0">
                <el-button
                  color="#409eff"
                  circle
                  icon="InfoFilled"
                  style="color: white"
                  @click="showDrawer(row)"
                ></el-button>
              </el-tooltip>
              <template #fallback>
                <el-button
                  color="#409eff"
                  circle
                  icon="InfoFilled"
                  style="color: white"
                  disabled
                ></el-button>
              </template>
            </ButtonPermission>

            <ButtonPermission value="btn.Sku.remove">
              <template #default>
                <!-- 删除按钮的气泡提示框 -->
                <el-popconfirm
                  width="220"
                  icon="InfoFilled"
                  icon-color="#626AEF"
                  :title="`你确定要删除 ${row.skuName} 吗`"
                  @confirm="del_sku(row)"
                >
                  <template #reference>
                    <!-- 关键：用 div 包裹 el-tooltip，解决嵌套冲突 -->
                    <div style="display: inline-block; margin-left: 10px">
                      <el-tooltip content="删除" :hide-after="0" placement="bottom">
                        <el-button type="danger" circle icon="Delete"></el-button>
                      </el-tooltip>
                    </div>
                  </template>

                  <template #actions="{ confirm, cancel }">
                    <el-button size="small" @click="cancel">No!</el-button>
                    <el-button type="danger" size="small" @click="confirm">Yes?</el-button>
                  </template>
                </el-popconfirm>
              </template>
              <template #fallback>
                <el-button type="danger" circle icon="Delete" disabled></el-button>
              </template>
            </ButtonPermission>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        background
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
        size="default"
        :disabled="false"
        layout="prev, pager, next, jumper,->, sizes,total"
        :total="total"
        @change="getSkuLimit"
        @size-change="currentPage = 1"
      />
    </el-card>
    <!-- Sku描述详情 对话框 -->
    <el-dialog v-model="detailVisible" title="Sku描述详情" width="600px">
      <div class="detail-content">{{ currentDesc }}</div>
    </el-dialog>
    <!-- 抽屉 -->
    <el-drawer v-model="drawerVisible" direction="rtl">
      <template #header>
        <h2>sku详情</h2>
      </template>
      <template #default>
        <!-- body -->
        <el-descriptions style="margin-bottom: 20px" :column="1" border>
          <!-- 名称 -->
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon><Goods /></el-icon>
                名称
              </div>
            </template>
            {{ skuDetail?.skuName }}
          </el-descriptions-item>
          <!-- 描述-->
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon><Document /></el-icon>
                描述
              </div>
            </template>

            <div class="desc-text-ellipsis">{{ skuDetail?.skuDesc }}</div>
          </el-descriptions-item>
          <!-- 价格 -->
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon><PriceTag /></el-icon>
                价格
              </div>
            </template>
            {{ skuDetail?.price }}
          </el-descriptions-item>
          <!-- 平台属性 -->
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon><Grid /></el-icon>
                平台属性
              </div>
            </template>
            <el-tag
              v-for="(item, index) in skuDetail?.skuAttrValueList"
              :key="item.id"
              :type="['success', 'warning'][index % 2]"
              style="margin: 5px 5px 5px 0"
            >
              {{ item.valueName }}
            </el-tag>
          </el-descriptions-item>
          <!-- 销售属性 -->
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon><List /></el-icon>
                销售属性
              </div>
            </template>
            <el-tag
              v-for="(item, index) in skuDetail?.skuSaleAttrValueList"
              :key="item.id"
              :type="['success', 'warning'][index % 2]"
              style="margin: 5px 5px 5px 0"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <el-divider border-style="dashed" />
        <!-- 轮播图 -->
        <h5>商品图片:</h5>
        <el-empty :image-size="150" v-show="!skuDetail?.skuImageList.length" />
        <el-carousel
          :interval="4000"
          type="card"
          height="200px"
          v-show="skuDetail?.skuImageList.length"
        >
          <el-carousel-item v-for="(item, index) in skuDetail?.skuImageList" :key="item.id">
            <el-image :src="item.imgUrl" fit="cover"></el-image>
          </el-carousel-item>
        </el-carousel>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import {
  reqSkuLimitData,
  reqSkuSaleUp,
  reqSkuSaleDown,
  reqSkuDetailData,
  reqDelSku,
} from '@/api/product/sku'
import type { skuData, SkuInfoData, DelSkuResData } from '@/api/product/sku/type'
import { ElMessage, ElNotification } from 'element-plus'
import { ref, onMounted } from 'vue'

defineOptions({
  name: 'Sku',
})
const currentPage = ref<number>(1)
const pageSize = ref<number>(8)
const total = ref<number>(0)
const skuInfo = ref<skuData[]>([])
// 存储 sku详情的数据
const skuDetail = ref<SkuInfoData>()

// Sku描述 字数过多时 要省略描述 并由用户选择是否查看描述
const detailVisible = ref<boolean>(false)
const currentDesc = ref('')
const openDetail = (row: skuData) => {
  currentDesc.value = row.skuDesc
  detailVisible.value = true
}

// 控制 抽屉展示
const drawerVisible = ref<boolean>(false)

// 获取sku分页列表的函数
const getSkuLimit = async () => {
  const res = await reqSkuLimitData(currentPage.value, pageSize.value)
  // console.log(res)
  if (res.code === 200) {
    total.value = res.data.total
    skuInfo.value = res.data.records
  }
}

onMounted(() => {
  getSkuLimit()
})

// 上架或者下架商品 更新 isSale状态
const UpdateSaleStatus = async (row: skuData) => {
  row.loading = true // 1. 开启 loading，按钮变成转圈状态，防止重复点击
  try {
    // 1 代表上架状态 0代表下架状态
    if (row.isSale === 1) {
      // 当前 row.isSale 为 1 则修改为0 (下架)

      const Downres = await reqSkuSaleDown(row.id as number)
      if (Downres.code === 200) {
        // 请求成功后 下架商品
        row.isSale = 0
        ElMessage.success(`${row.skuName} 已下架成功`)
      }
    } else {
      // 当前 row.isSale 为 10 则修改为1 (上架)
      const Upres = await reqSkuSaleUp(row.id as number)
      if (Upres.code === 200) {
        // 请求成功后 上架商品
        row.isSale = 1
        ElMessage.success(`${row.skuName} 已上架成功`)
      }
    }
  } finally {
    row.loading = false // 2. 无论成功失败，都关闭 loading
  }
}

// 点击详情按钮的回调函数
const showDrawer = async (row: skuData) => {
  drawerVisible.value = true
  const res = await reqSkuDetailData(row.id as number)
  if (res.code === 200) {
    skuDetail.value = res.data
    // console.log(skuDetail.value)
  }
}

// 点击删除 按钮的回调
const del_sku = async (row: skuData) => {
  try {
    const res: DelSkuResData = await reqDelSku(row.id as number)
    if (res.code === 200) {
      ElMessage.success(`删除 ${row.skuName} 成功`)
      getSkuLimit()
    }
  } catch (error) {
    // ElMessage.error(`删除 ${row.skuName} 失败,请稍后再试`)

    ElNotification({
      title: 'Error',
      message: `删除 ${row.skuName} 失败,请稍后再试`,
      type: 'error',
    })
  }
}
</script>

<style scoped lang="scss">
/* ================= 1. SKU 列表描述单元格样式 ================= */
.desc-cell {
  cursor: pointer;

  // 文本两行省略
  .text-ellipsis-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all; // 防止长英文或链接撑开容器
  }

  // 鼠标悬停时文字变色
  &:hover .text-ellipsis-2 {
    color: var(--el-color-primary);
  }

  // "查看详情" 提示文字
  .view-more {
    font-size: 12px;
    color: var(--el-color-primary);
    margin-top: 4px;
    display: inline-block;
  }
}

/* ================= 2. 抽屉详情内容区样式 ================= */
.detail-content {
  white-space: pre-wrap; // 保留换行符
  word-break: break-all;
  line-height: 1.8;
  max-height: 60vh;
  overflow-y: auto;
}

// 抽屉内 图标+文字 的 Flex 对齐
.cell-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

// 描述过长时 省略文字
.desc-text-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 限制显示 3 行 */
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all; /* 防止长英文或链接撑开不换行 */
}

/* 解决 el-descriptions 中 Flex 布局导致文本省略失效的问题 */
:deep(.el-descriptions-item__content) {
  min-width: 0 !important;
}

/* ================= 4. 轮播图指示器（小长条）自定义样式 ================= */
// 强制指示器容器使用 Flex 布局，并禁止换行
:deep(.el-carousel__indicators) {
  display: flex !important;
  flex-wrap: nowrap !important; // 核心：绝对不换行
  justify-content: center; // 保持居中
  width: 100%; // 确保占满底部宽度
  padding: 0 10px; // 左右留边距，防止边缘圆点被裁剪
  box-sizing: border-box;
}

// 限制每个指示器的宽度，防止被过度压缩
:deep(.el-carousel__indicator) {
  flex-shrink: 0; // 禁止指示器被压缩
  padding: 0 4px; // 控制小长条之间的间距
}

// 未选中状态：深灰色
:deep(.el-carousel__button) {
  background-color: #9b9da2 !important;
  opacity: 1 !important; // 默认有半透明效果，强制不透明
}

// 选中状态（激活态）：极深色
:deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background-color: #303133 !important;
  // 如果想跟随 Element Plus 主题色，可取消下面这行的注释：
  // background-color: var(--el-color-primary) !important;
}
</style>
