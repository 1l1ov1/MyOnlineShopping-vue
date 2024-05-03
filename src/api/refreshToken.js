import request from '@/utils/request'

// 刷新token
export const refreshTokenService = (refreshToken) => {
  return request({
    url: '/api/refresh/refreshToken',
    method: 'get',
    headers: {
      'Refresh-Token': refreshToken
    }
  })
}
