// 该文件用于编写管理 商品管理中的 sku管理模块 的类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 添加sku需要收集的平台属性数据
export interface skuAttrValueList_From_skuData {
  attrId: number | string
  valueId: number | string
}

// 添加sku需要收集的销售属性数据
export interface skuSaleAttrValueList_From_skuData {
  saleAttrId: number | string
  saleAttrValueId: number | string
}

// 新增sku 的数据类型定义
export interface skuData {
  loading?: boolean //新增 加入loading 状态
  id?: number //skuId
  category3Id: number | string //三级id
  isSale?: number //是否上下架sku商品
  price: string //价格
  spuID: number | string //spu的id
  tmId: number | string //品牌id
  weight: string //重量
  skuDefaultImg: string //售卖商品sku图片地址
  skuDesc: string //描述
  skuName: string //sku名字
  // 平台属性
  skuAttrValueList: skuAttrValueList_From_skuData[]
  // 销售属性
  skuSaleAttrValueList: skuSaleAttrValueList_From_skuData[]
}

// 请求获取sku的分页列表的 返回值类型定义
export interface GetSkuLimitResponseData extends ResponseData {
  data: {
    records: skuData[]
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 请求上架商品的 返回值类型定义
export interface SkuSaleUpResData extends ResponseData {
  data: string | null
}

// 请求下架商品的 返回值类型定义
export interface SkuSaleDownResData extends ResponseData {
  data: string | null
}

// 获取sku详情中的 skuAttrValueList 的类型定义
export interface skuAttrValueList_from_SkuInfoData {
  ID: number
  id: number
  attrId: number
  valueId: number
  valueName: string
  attrName: string
  skuId: number
}

// 获取sku详情中的 skuSaleAttrValueList 的类型定义
export interface skuSaleAttrValueList_from_SkuInfoData {
  ID: number
  id: number
  saleAttrId: number
  saleAttrValueId: number
  saleAttrName: string
  saleAttrValueName: string
  skuId: number
}

// 获取sku详情中的 skuImageList 的类型定义
export interface skuImageList_from_SkuInfoData {
  ID: number
  id: number
  skuId: number
  imgName: string
  imgUrl: string
  spuImgId: number
  isDefault: string
}

// 请求获取sku详情的 类型定义
export interface SkuInfoData {
  id: number | string
  spuID: number | string
  category3Id: number | string
  tmId: number | string
  skuName: string
  weight: number | string
  price: number | string
  skuDesc: string
  skuDefaultImg: string
  isSale: number
  skuAttrValueList: skuAttrValueList_from_SkuInfoData[]
  skuSaleAttrValueList: skuSaleAttrValueList_from_SkuInfoData[]
  skuImageList: skuImageList_from_SkuInfoData[]
}

export interface SkuInfoResData extends ResponseData {
  data: SkuInfoData
}

// 请求删除sku 返回值类型定义
export interface DelSkuResData extends ResponseData {
  data: string | null
}
