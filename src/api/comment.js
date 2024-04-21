import request from '@/utils/request'
// 查询评论
export const queryCommentsService = (params) => {
  return request({
    url: '/api/user/queryComment',
    method: 'post',
    data: params
  })
}

// 添加评论
export const addCommentService = (params) => {
  return request({
    url: '/api/user/addComment',
    method: 'post',
    data: params
  })
}

// 查询是否点赞或点踩
export const queryLikeOrDislikeService = (params) => {
  return request({
    url: '/api/user/queryCommentAction',
    method: 'post',
    data: params
  })
}
// 修改评论行为
export const updateCommentActionService = (params) => {
  return request({
    url: '/api/user/updateCommentAction',
    method: 'put',
    data: params
  })
}
