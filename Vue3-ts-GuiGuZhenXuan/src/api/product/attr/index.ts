// 该文件用于编写管理 商品管理中的属性管理模块接口
// 引入二次封装的axios
import instance from '@/utils/instance'
import type { CategoryResponseData, attrResponseData, attrArr } from './type'

enum API {
  // 获取一级分类接口
  Get_Category1 = '/admin/product/getCategory1',
  // 获取二级分类接口 --注意要带上一级分类的id
  Get_Category2 = '/admin/product/getCategory2',
  // 获取三级分类接口 --注意要带上二级分类的id
  Get_Category3 = '/admin/product/getCategory3',
  // 获取对应分类下的 已有属性与属性值
  attr_URL = '/admin/product/attrInfoList',
  // 添加或修改已有的属性 判断有无id
  AddOrEditAttrInfo_URL = '/admin/product/saveAttrInfo',
  // 删除属性
  Del_Attr = '/admin/product/deleteAttr',
}

// 请求一级分类的列表
export const reqCategoryOne = () => {
  return instance<any, CategoryResponseData>({
    url: API.Get_Category1,
  })
}

// 请求二级分类的列表
export const reqCategoryTwo = (c1id: number) => {
  return instance<any, CategoryResponseData>({
    url: `${API.Get_Category2}/${c1id}`,
  })
}

// 请求一级分类的列表
export const reqCategoryThree = (c2id: number) => {
  return instance<any, CategoryResponseData>({
    url: `${API.Get_Category3}/${c2id}`,
  })
}

// 请求分类 对应的属性与属性值
export const reqAttrAndAttrValue = (c1id: number, c2id: number, c3id: number) => {
  return instance<any, attrResponseData>({
    url: `${API.attr_URL}/${c1id}/${c2id}/${c3id}`,
  })
}

// 添加或修改属性值请求
export const reqAddOrEditAttrInfo = (data: attrArr) => {
  return instance<any, any>({
    url: API.AddOrEditAttrInfo_URL,
    method: 'post',
    data,
  })
}

// 删除属性请求
export const reqDelAttr = (attrId: number) => {
  return instance<any, any>({
    url: `${API.Del_Attr}/${attrId}`,
    method: 'delete',
  })
}
