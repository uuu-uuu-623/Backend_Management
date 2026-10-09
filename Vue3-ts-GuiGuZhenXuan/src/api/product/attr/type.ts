// 该文件用于编写管理 商品管理中的属性管理模块 的类型
interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface CategoryObj {
  // 由于一级与 二、三级得到的返回数据不一样 所以加?
  id: number
  name: string
  category1Id?: number
  category2Id?: number
}

// 请求1、2、3级分类得到数据的 数据类型定义
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

// 获取完三级分类之后的 属性与属性值的类型定义

// 属性值类型定义
export interface attrValue {
  id?: number // 属性值id  当新添加属性值的时候 是无id的 所以有 ‘ ? ’
  valueName: string // 属性值名称
  attrId?: number // 属性id 当新添加属性的时候(因为属性和属性值是一起添加的) 也是无id的 所以有 ‘ ? ’
  flag?: boolean
}

// 属性类型定义
export interface attrArr {
  id?: number // 属性id 当新添加属性的时候 是无id的 所以有 ‘ ? ’
  attrName: string
  categoryId: number
  categoryLevel: number
  attrValueList: Array<attrValue>
  CollectSkuFormInPingTaiSelect?: string // 在spu模块中的 skuForm 表单中的 平台属性的下拉框 收集的数据
}

// 完整的请求 三级分类之后的 响应数据类型定义 (属性与属性值)
export interface attrResponseData extends ResponseData {
  data: attrArr[]
}
