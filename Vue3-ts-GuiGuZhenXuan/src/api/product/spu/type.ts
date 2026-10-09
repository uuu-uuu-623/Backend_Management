// 该文件用于编写管理 商品管理中的 spu管理模块 的类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 获取SPU分页列表 返回的类型中的data中的records的 类型定义
// spu数据的ts类型
export interface RecordFromSpuLimitData {
  id?: number //spu的id 可有可无(新增时)
  spuName: string //品牌名称
  description: string //spu描述
  category3Id: number
  tmId: number //品牌id
  // 下面两个 初始类型是null 不可以省略
  spuImageList?: DataFromSpuImagesList[] | null //spu图片墙
  spuSaleAttrList?: DataFromSpuSale[] | null //spu销售属性
}

export type Records = RecordFromSpuLimitData[]

// 获取SPU分页列表 返回的类型中的data 类型定义
export interface dataFromSpuLimit {
  records: Records
  total: number
  size: number
  current: number
  searchCount: boolean
  pages: number
}

// 获取SPU分页列表 返回的类型
export interface SpuLimitResponseData extends ResponseData {
  data: dataFromSpuLimit
}

// 所有品牌列表中的data 返回的类型
export interface DataFromTrademarkList {
  id: number
  tmName: string
  logoUrl: number
}

// 获取所有品牌列表 返回的类型
export interface AllTrademarkList extends ResponseData {
  data: DataFromTrademarkList[]
}

// spu模块的照片墙中data 返回的数据类型
export interface DataFromSpuImagesList {
  id?: number
  imgName: string
  imgUrl: string
  spuId?: number
}

// 获取spu模块的照片墙 返回的数据类型
export interface SpuImagesList extends ResponseData {
  data: DataFromSpuImagesList[]
}

// 获取所有的 基础spu销售属性列表中的data 返回的数据类型
export interface DataFromBaseSale {
  id: number
  name: string
}

// 获取所有的 基础销售列表 返回的数据类型
export interface BaseSaleList extends ResponseData {
  data: DataFromBaseSale[]
}

// 某个商品spu销售属性列表 中的销售属性值的 数据类型定义
export interface spuSaleValue {
  id?: number
  saleAttrValueName: string
  baseSaleAttrId: number
  spuId: number
}

// 某个商品spu销售属性中的data 的数据类型定义
export interface DataFromSpuSale {
  id?: number
  baseSaleAttrId: number
  saleAttrName: string
  spuId: number
  spuSaleAttrValueList: spuSaleValue[]
  // 以下为后加的数据 确保每个spu销售属性都是独立的
  flag?: boolean //后加 用于控制spu销售属性值 的查看or编辑状态
  CollectSkuFormInSaleSelect?: string // 在spu模块中的 skuForm 表单中的 销售属性的下拉框 收集的数据
}

// 某个商品spu销售属性中的数据类型定义
export interface SpuSaleList extends ResponseData {
  data: DataFromSpuSale[]
}

// 新增或修改 spu的数据的数据类型定义
export interface AddOrUpdateSpuResponseData extends ResponseData {
  data: string
}

// 添加sku需要收集的平台属性数据
export interface skuAttrValueList_From_AddSku {
  attrId: number | string
  valueId: number | string
}

// 添加sku需要收集的销售属性数据
export interface skuSaleAttrValueList_From_AddSku {
  saleAttrId: number | string
  saleAttrValueId: number | string
}

// 新增sku 的数据类型定义
export interface DataFromAddSku {
  category3Id: number | string //三级id
  price: string //价格
  spuID: number | string //spu的id
  tmId: number | string //品牌id
  weight: string //重量
  skuDefaultImg: string //售卖商品sku图片地址
  skuDesc: string //描述
  skuName: string //sku名字
  // 平台属性
  skuAttrValueList: skuAttrValueList_From_AddSku[]
  // 销售属性
  skuSaleAttrValueList: skuSaleAttrValueList_From_AddSku[]
}

export interface AddSkuInfo extends ResponseData {
  data: DataFromAddSku[]
}

// 删除spu 的数据类型定义
export interface DelSpu extends ResponseData {
  data: string | null
}
