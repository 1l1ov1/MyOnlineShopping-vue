import request from '@/utils/request'

// 上传图片
export const uploadImgService = (file, id) => {
  request.post('/api/img/uploadAvatar', { file, id })
}

export const uploadGoodsFile = (fd) => {
  return request({
    url: `/api/img/uploadGoods/${fd.get('id')}`,
    method: 'post',
    data: fd
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // }
  })
}
