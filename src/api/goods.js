import request from '@/utils/request'
// 商品的分页查询
export const getGoodsListService = (params) => {
  return request({
    url: '/api/goods/page',
    method: 'post',
    data: params
  })
}
export const getAllGoodsService = () =>
  request.get('/api/goods/query')
// 添加商品
export const AddGoodsService = (params) =>
  request.post('/api/goods/add', params)
// 修改商品
export const UpdateGoodsService = (params) =>
  request.put('/api/goods/update', params)
// 删除商品
export const DeleteBatchGoodsService = (ids) => {
  return request({
    url: '/api/goods/delete',
    method: 'delete',
    params: { ids }
  })
}
// 获取商品信息
export const GetGoodsDetailService = (id) =>
  request.get(`/api/goods/${id}`)

// 根据商品名查询商品
export const queryGoodsService = (goodsName) =>
  request.get(`/api/goods/query/${goodsName}`)

// 根据分类id查询商品
export const getGoodsByCategory = (id) =>
  request.get(`/api/goods/category/${id}`)
