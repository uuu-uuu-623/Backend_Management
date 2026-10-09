import instance from '@/utils/instance'
import type {
  GetSkuLimitResponseData,
  SkuSaleUpResData,
  SkuSaleDownResData,
  SkuInfoResData,
  DelSkuResData,
} from './type'

enum API {
  // 获取SKU分页列表
  Get_skuLimit = '/admin/product/list',
  // 上架sku商品
  Get_skuSaleUp = '/admin/product/onSale',
  // 下架sku商品
  Get_skuSaleDown = '/admin/product/cancelSale',
  // 获取sku详情
  Get_skuDetail = '/admin/product/getSkuInfo',
  // 删除sku
  Del_sku = '/admin/product/deleteSku',
}

// 请求 得到SKU分页列表
export const reqSkuLimitData = (page: number, limit: number) => {
  return instance<any, GetSkuLimitResponseData>({
    url: `${API.Get_skuLimit}/${page}/${limit}`,
  })
}

// 请求 上架sku商品
export const reqSkuSaleUp = (skuId: number) => {
  return instance<any, SkuSaleUpResData>({
    url: `${API.Get_skuSaleUp}/${skuId}`,
  })
}

// 请求 下架sku商品
export const reqSkuSaleDown = (skuId: number) => {
  return instance<any, SkuSaleDownResData>({
    url: `${API.Get_skuSaleDown}/${skuId}`,
  })
}

// 请求 获取sku详情数据
export const reqSkuDetailData = (skuId: number) => {
  return instance<any, SkuInfoResData>({
    url: `${API.Get_skuDetail}/${skuId}`,
  })
}

// 请求 删除sku
export const reqDelSku = (skuId: number) => {
  return instance<any, DelSkuResData>({
    url: `${API.Del_sku}/${skuId}`,
    method: 'delete',
  })
}
