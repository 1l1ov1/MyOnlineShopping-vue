import request from '@/utils/request'

export const queryMessageService = (sendId, receiveId, type) => {
  return request({
    url: '/api/userChat/query',
    method: 'post',
    data: { sendId, receiveId, type }
  })
}
