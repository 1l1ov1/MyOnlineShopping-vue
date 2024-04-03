import request from '@/utils/request'

// 分页查询
export const getStoreListService = (params) =>
  request.get('/api/store/page', {
    params
  })

// 修改商店
export const UpdateStoreService = (obj) =>
  request.put('/api/store/updateStore', obj)

// 回显商店
export const GetStoreDetailService = (id) =>
  request.get(`/api/store/getStoreDetail/${id}`)
// 添加商店
export const AddStoreService = (obj) =>
  request.post('/api/store/addStore', obj)
// 批量删除
export const BatchDeleteStoreService = (ids) => {
  return request({
    url: '/api/store/deleteStore',
    method: 'delete',
    params: { ids }
  })
}

// 开店和关店
export const OpenOrClose = (params) => {
  return request({
    url: `/api/store/openOrClose/${params.status}`,
    method: 'post',
    params: { id: params.id }
  })
}
// 回显商店的商品
export const getStoreGoods = (id) =>
  request.get(`/api/store/getGoods/${id}`)

// 根据商店名查询商店
export const queryStoresService = (storeName) =>
  request.get(`/api/store/query/${storeName}`)
