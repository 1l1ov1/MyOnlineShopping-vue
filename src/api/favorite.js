import request from '@/utils/request'

// 添加收藏
export const addFavoriteService = (params, target) => {
  return request({
    url: `/api/favorite/add/${target}`,
    method: 'post',
    data: params
  })
}

// 根据用户id查询收藏
export const queryFavoriteService = (id) =>
  request.get(`/api/favorite/query/${id}`)

// 根据用户id和商品id或商店id查询该用户是否收藏了该商品
export const queryFavoriteIsExistService = (id, target) => {
  return request({
    url: `/api/favorite/search/${id}`,
    method: 'get',
    params: { target }
  })
}

// 删除收藏
export const batchDeleteFavoriteService = (ids, target) => {
  return request({
    url: `/api/favorite/delete/${target}`,
    method: 'delete',
    params: { ids }
  })
}
