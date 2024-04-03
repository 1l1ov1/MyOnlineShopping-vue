import request from '@/utils/request'

// 分页查询
export const getUserListService = (params) =>
  request.get('/api/manager/page', {
    params
  })
// 启用和禁用账号
export const managerStartOrStopService = (params) => {
  return request({
    url: `/api/manager/status/${params.accountStatus}`,
    method: 'post',
    params: { id: params.id }
  })
}
// 批量删除用户
export const managerBatchDeleteUsersService = (ids) => {
  return request({
    url: '/api/manager/delete',
    method: 'delete',
    params: { ids }
  })
}

// 添加用户
export const managerAddUserService = (obj) => {
  return request({
    url: '/api/manager/add',
    method: 'post',
    data: obj
  })
}

// 修改用户
export const managerUpdateUserService = (obj) =>
  request.put('/api/manager/updateUser', obj)

// 回显用户的地址
export const managerGetUserAddressService = (id) =>
  request.get(`/api/manager/getAddress/${id}`)

// 修改商店
export const managerUpdateStoreService = (obj) =>
  request.put('/api/manager/updateStore', obj)

// 回显商店
export const managerGetStoreDetailService = (id) =>
  request.get(`/api/manager/getStoreDetail/${id}`)
// 添加商店
export const managerAddStoreService = (obj) =>
  request.post('/api/manager/addStore', obj)
// 批量删除
export const managerPatchDeleteStoreService = (ids) => {
  return request({
    url: '/api/manager/deleteStore',
    method: 'delete',
    params: { ids }
  })
}

// 开店和关店
export const managerOpenOrClose = (params) => {
  return request({
    url: `/api/manager/openOrClose/${params.status}`,
    method: 'post',
    params: { id: params.id }
  })
}

// 商品的分页查询
// 分页查询
export const getGoodsListService = (params) => {
  return request({
    url: '/api/manager/goodsPageQuery',
    method: 'post',
    data: params
  })
}

// 查询营业额
export const queryStoreSales = (day) =>
  request.get(`/api/manager/queryStoreSales/${day}`)

// 查询用户数量和在线用户数量
export const queryUserAndRegisterUser = (day) =>
  request.get(`/api/manager/queryUserCount/${day}`)
