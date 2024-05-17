<script setup>
import { ref, watch } from 'vue'
import { queryCommentsService, queryLikeOrDislikeService, updateCommentActionService } from '@/api/comment'
import AddComment from './AddComment.vue'
import AddReport from './AddReport.vue'
import { userStore } from '@/store'
const userStoreInstance = userStore()
const props = defineProps({
  goods: Object,
  store: Object
})

watch(
  () => props.goods,
  (newValue) => {
    params.value = {
      goodsId: newValue.id,
      storeId: newValue.storeId,
      type: 0, // 默认全部
      sort: 1
    }
    queryComments(params.value)
    queryLikeOrDislike()
  }
)
const businessmanId = ref()
watch(
  () => props.store,
  (newValue) => {
    businessmanId.value = newValue.userId
  }
)

const params = ref({
  type: 0,
  sort: 1
})
const commentSort = ref(1)
// 下拉框排序改变
const handleSortChange = (value) => {
  params.value.sort = value
  queryComments(params.value)
}
const commentsList = ref([])
const subCommentList = ref(new Map())
const total = ref(0)

// 查询评论
const queryComments = async (params) => {
  const res = await queryCommentsService(params)
  total.value = res.data.total
  commentsList.value = res.data.comments
  emit('returnComments', commentsList.value)
  if (commentsList.value == null) {
    return
  }
  // 创建一个新数组，仅包含父评论（parentCommentId为null或undefined）
  const parentComments = commentsList.value.filter(
    (comment) => !comment.parentCommentId
  )

  // 遍历父评论，为每个父评论查找子评论并添加到subCommentList
  parentComments.forEach((comment) => {
    const subCommentsForCurrentComment = commentsList.value.filter(
      (subComment) =>
        subComment.parentCommentId === comment.id &&
        subComment.parentCommentId !== null
    )
    // 得到子评论后按照时间从旧到新排序
    subCommentsForCurrentComment.sort((a, b) => {
      return new Date(a.createTime) - new Date(b.createTime)
    })
    subCommentList.value.set(comment.id, subCommentsForCurrentComment)
  })

  // 更新commentsList，仅保留父评论
  commentsList.value = parentComments
}
const openCommentDialog = ref()
const addComment = () => {
  openCommentDialog.value.open(userStoreInstance.user, props.goods.id, props.store.id, null)
}

// 加密用户名，让中间全部为* 只留头尾
const encryptName = (name) => {
  const len = name.length
  if (len <= 2) {
    return name
  } else {
    return name.substring(0, 1) + '*'.repeat(len - 2) + name.substring(len - 1, len)
  }
}

const handleReply = (userId, goodsId, storeId, parentCommentId) => {
  openCommentDialog.value.open(userStoreInstance.user, props.goods.id, props.store.id, parentCommentId)
}

const isBusinessman = (userId, name) => {
  if (businessmanId.value === userId) {
    return '商家'
  }
  return encryptName(name)
}
const onDialog = () => {
  queryComments(params.value)
}
// 查询全部评论
const queryAll = () => {
  params.value.type = 0
  queryComments(params.value)
}
// 查询好评
const queryGood = () => {
  params.value.type = 1
  queryComments(params.value)
}
// 查询坏评
const queryBad = () => {
  params.value.type = 2
  queryComments(params.value)
}

const handleLike = async (commentId, actionType) => {
  await updateCommentActionService({
    userId: userStoreInstance.user.id,
    goodsId: props.goods.id,
    storeId: props.store.id,
    commentId: commentId,
    action: actionType
  })
}

const handleDislike = async (commentId, actionType) => {
  await updateCommentActionService({
    userId: userStoreInstance.user.id,
    goodsId: props.goods.id,
    storeId: props.store.id,
    commentId: commentId,
    action: actionType
  })
}
const commentActionsList = ref([])
const like = ref({})
const dislike = ref({})
const queryLikeOrDislike = async () => {
  const res = await queryLikeOrDislikeService({
    userId: userStoreInstance.user.id,
    goodsId: props.goods.id,
    storeId: props.store.id
  })

  commentActionsList.value = res.data
  // 清空like和dislike对象
  like.value = {}
  dislike.value = {}
  // 遍历commentActionsList，更新like和dislike对象
  for (const commentAction of commentActionsList.value) {
    if (commentAction.action === 1) {
      like.value[commentAction.commentId] = true // 表示已点赞
    } else if (commentAction.action === 2) {
      dislike.value[commentAction.commentId] = true // 表示已点踩
    } else if (commentAction.action === 3) {
      like.value[commentAction.commentId] = false // 表示未点赞
      dislike.value[commentAction.commentId] = false // 表示未点踩
    }
  }
}

const likeStatus = (commentId) => {
  return commentActionsList.value.some(
    (action) => action.commentId === commentId && action.action === 1
  )
}

const dislikeStatus = (commentId) => {
  return commentActionsList.value.some(
    (action) => action.commentId === commentId && action.action === 2
  )
}

const toggleLikeOrDislike = async (commentId, actionType) => {
  if (actionType === 1) {
    if (likeStatus(commentId)) {
      // 如果已点赞，取消点赞
      await handleLike(commentId, 3)
    } else {
      // 否则，点赞
      await handleLike(commentId, 1)
    }
  } else if (actionType === 2) {
    if (dislikeStatus(commentId)) {
      // 如果已点踩，取消点踩
      await handleDislike(commentId, 3)
    } else {
      // 否则，点踩
      await handleDislike(commentId, 2)
    }
  }
  // 更新点赞/点踩状态
  queryLikeOrDislike()
  // 更新评论列表
  queryComments(params.value)
}
// 举报
const openReportDialog = ref()
const handleReport = (commentId) => {
  openReportDialog.value.open(commentId)
}
const emit = defineEmits(['returnComments'])
</script>

<template>
  <div class="comment-page">
    <div class="comment-headerPlaceholder">
      <div class="comment-headerWrap">
        <el-tabs>
          <el-tab-pane label="宝贝评价">
            <div class="comment-conditions">
              <div class="comment-tagList">
                <el-button @click="queryAll()" type="primary" size="large" round="true" class="detail-btn">
                  全部
                </el-button>
                <el-button @click="queryGood()" type="success" size="large" round="true" class="detail-btn">
                  好评
                </el-button>
                <el-button @click="queryBad()" type="danger" size="large" round="true" class="detail-btn">
                  差评
                </el-button>
                <el-button type="info" @click="addComment" size="large" round="true" class="detail-btn">
                  发表评论
                </el-button>
              </div>
              <div class="comment-sort">
                <el-select v-model="commentSort" @change="handleSortChange" placeholder="请选择">
                  <el-option label="默认排序" :value="1"></el-option>
                  <el-option label="时间排序" :value="2"></el-option>
                </el-select>
              </div>
            </div>
            <div class="comment-comments" v-if="commentsList !== null && commentsList !== undefined && commentsList.length > 0">
              <div v-for="item in commentsList" :key="item.id">
                <div class="comment-root">
                  <div class="comment-header">
                    <div class="comment-avatar">
                      <img :src="require('@/assets/uploadAvatar/' + item.avatar)" />
                    </div>
                    <div class="comment-userInfo">
                      <div class="username">
                        {{ isBusinessman(item.userId, item.username) }}
                      </div>
                      <div class="comment-time">
                        {{ item.createTime }}
                      </div>
                    </div>
                  </div>
                  <div class="comment-content">
                    {{ item.content }}
                  </div>
                  <div class="comment-reply" v-for="subComment in subCommentList.get(item.id)" :key="subComment.id">
                    <div class="comment-reply-content">
                      {{ isBusinessman(subComment.userId, subComment.username) }}回复： {{ subComment.content }}
                    </div>
                    <div class="comment-time">
                      {{ subComment.createTime }}
                    </div>
                    <div class="comment-reply-footer">

                      <div class="comment-reply-like">
                        <el-button @click="toggleLikeOrDislike(subComment.id, 1)">
                          <svg v-if="!like[subComment.id]" t="1713448542848" class="icon" viewBox="0 0 1024 1024"
                            version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2463" width="12" height="12">
                            <path
                              d="M621.674667 408.021333c16.618667-74.24 28.224-127.936 34.837333-161.194666C673.152 163.093333 629.941333 85.333333 544.298667 85.333333c-77.226667 0-116.010667 38.378667-138.88 115.093334l-0.586667 2.24c-13.728 62.058667-34.72 110.165333-62.506667 144.586666a158.261333 158.261333 0 0 1-119.733333 58.965334l-21.909333 0.469333C148.437333 407.808 106.666667 450.816 106.666667 503.498667V821.333333c0 64.8 52.106667 117.333333 116.394666 117.333334h412.522667c84.736 0 160.373333-53.568 189.12-133.92l85.696-239.584c21.802667-60.96-9.536-128.202667-70.005333-150.186667a115.552 115.552 0 0 0-39.488-6.954667H621.674667zM544.256 149.333333c39.253333 0 59.498667 36.48 49.888 84.928-7.573333 38.144-21.984 104.426667-43.221333 198.666667-4.512 20.021333 10.56 39.093333 30.912 39.093333h218.666666c6.101333 0 12.16 1.066667 17.909334 3.168 27.445333 9.984 41.674667 40.554667 31.776 68.266667l-85.568 239.573333C744.981333 838.026667 693.301333 874.666667 635.402667 874.666667H223.498667C194.314667 874.666667 170.666667 850.784 170.666667 821.333333V503.498667c0-17.866667 14.144-32.448 31.829333-32.821334l21.866667-0.469333a221.12 221.12 0 0 0 167.381333-82.56c34.346667-42.602667 59.146667-99.306667 74.869333-169.877333C482.101333 166.336 499.552 149.333333 544.266667 149.333333z"
                              fill="#000000" p-id="2464"></path>
                          </svg>
                          <svg v-else t="1713507215488" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="5476" width="12" height="12">
                            <path
                              d="M621.674667 408.021333c16.618667-74.24 28.224-127.936 34.837333-161.194666C673.152 163.093333 629.941333 85.333333 544.298667 85.333333c-77.226667 0-116.010667 38.378667-138.88 115.093334l-0.586667 2.24c-13.728 62.058667-34.72 110.165333-62.506667 144.586666a158.261333 158.261333 0 0 1-119.733333 58.965334l-21.909333 0.469333C148.437333 407.808 106.666667 450.816 106.666667 503.498667V821.333333c0 64.8 52.106667 117.333333 116.394666 117.333334h412.522667c84.736 0 160.373333-53.568 189.12-133.92l85.696-239.584c21.802667-60.96-9.536-128.202667-70.005333-150.186667a115.552 115.552 0 0 0-39.488-6.954667H621.674667z"
                              fill="#000000" p-id="5477"></path>
                          </svg>
                          <span>有用({{ subComment.likeCount }})</span>
                        </el-button>
                      </div>
                      <!-- 踩 -->
                      <div class="comment-reply-dislike">
                        <el-button @click="toggleLikeOrDislike(subComment.id, 2)">
                          <svg v-if="!dislike[subComment.id]" t="1713486655240" class="icon" viewBox="0 0 1024 1024"
                            version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3473" width="12" height="12">
                            <path
                              d="M556.930612 929.959184c-27.167347 0-52.244898-8.881633-68.440816-25.6-26.644898-27.167347-38.138776-74.187755-50.155102-123.29796-6.791837-27.689796-14.628571-59.036735-22.465306-72.620408-21.942857-37.616327-68.963265-56.946939-82.546939-61.648979H257.044898c-27.167347 0-49.110204-21.942857-49.110204-49.110204v-397.061225c0-27.167347 21.942857-49.110204 49.110204-49.110204h71.57551c30.82449-16.195918 118.595918-56.946939 219.428572-56.946939h191.216326c31.346939 0 97.17551 11.493878 123.820408 55.902041C888.163265 191.216327 929.959184 512 929.959184 539.689796c0 60.081633-56.946939 106.579592-105.534694 106.579592h-125.910204c-4.179592 0-6.791837 2.612245-8.359184 3.657143-1.044898 1.567347-3.134694 4.702041-2.089796 8.881632 4.702041 21.420408 14.628571 77.844898 7.314286 137.404082-7.314286 61.126531-43.885714 108.669388-97.17551 126.432653-13.583673 5.22449-27.689796 7.314286-41.27347 7.314286zM257.044898 192.783673c-4.179592 0-7.314286 3.134694-7.314286 7.314286v397.061225c0 4.179592 3.134694 7.314286 7.314286 7.314285h83.069388l3.134694 1.044898c12.538776 4.179592 76.8 28.212245 108.146938 81.502041 10.971429 18.808163 18.808163 50.155102 27.167347 83.591837 10.44898 43.885714 20.897959 85.159184 39.706123 103.967347 13.583673 13.583673 40.75102 17.240816 66.873469 8.359184 37.616327-12.538776 63.738776-47.020408 68.963265-91.951021 4.702041-37.093878 2.089796-83.069388-6.791836-123.820408-3.134694-15.673469 0.522449-31.346939 10.448979-43.885714 9.926531-12.538776 24.555102-19.330612 40.751021-19.330613h125.910204c28.212245 0 63.738776-30.302041 63.738775-64.783673 0-42.840816-44.930612-340.636735-60.604081-368.326531-14.628571-24.555102-60.604082-35.526531-88.293878-35.52653h-191.216326c-96.653061 0-180.767347 41.273469-204.277551 54.334694l-4.702041 2.612244H257.044898z"
                              fill="#333333" p-id="3474"></path>
                            <path
                              d="M114.938776 629.55102c-11.493878 0-20.897959-9.404082-20.89796-20.897959v-428.408163c0-11.493878 9.404082-20.897959 20.89796-20.897959s20.897959 9.404082 20.897959 20.897959v428.408163c0 11.493878-9.404082 20.897959-20.897959 20.897959z"
                              fill="#333333" p-id="3475"></path>
                          </svg>
                          <svg v-else t="1713507292047" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="1416" width="12" height="12">
                            <path
                              d="M723.2 77.5c0-7.3-5.9-13.3-13.3-13.3H288.7c-1.5 0-3 0.1-4.5 0.5-38.3 1.6-73.4 22.5-92.4 55.5-0.5 0.9-1 1.9-1.4 2.9C186.3 133.4 89.6 376.9 70.2 449 47.8 532.4 97.5 618.5 181 640.9c12.3 3.3 25.1 4.8 40.4 4.8l104.8 0.4c-13 59.4-15.2 148.5-15.2 201.6 0 61.7 50.2 111.9 111.9 111.9S535 909.4 535 847.6v-22.4c0-107.3 75.9-197.1 176.7-218.8 6.7-1.4 11.5-7.4 11.5-14.3V77.5z m147.5-13.3h-81.5c-7.3 0-13.3 5.9-13.3 13.3v514.6c0 5.1 4.2 9.3 9.3 9.3h85.6c49.4 0 89.5-40.1 89.5-89.5V153.8c-0.1-49.4-40.2-89.6-89.6-89.6z"
                              fill="" p-id="1417"></path>
                          </svg>
                          <span>没用({{ subComment.dislikeCount }})</span>
                        </el-button>
                      </div>
                      <!-- 举报 -->
                      <div class="comment-reply-report">
                        <el-button @click="handleReport(subComment.id)">
                          <svg t="1713537420374" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="2717" width="12" height="12">
                            <path
                              d="M924.8 908H284v-32h640.8c8 0 15.2-4 20-11.2 4-7.2 4-15.2 0-22.4L532 128c-4-7.2-11.2-11.2-20-11.2-8 0-15.2 4-20 11.2l-320 555.2-28-16L464.8 112c9.6-16.8 27.2-27.2 47.2-27.2 20 0 37.6 10.4 47.2 27.2l412.8 714.4c9.6 16.8 9.6 37.6 0 54.4-9.6 17.6-27.2 27.2-47.2 27.2z"
                              fill="#666666" p-id="2718"></path>
                            <path d="M517.6 737.6m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#666666" p-id="2719">
                            </path>
                            <path
                              d="M517.6 672c-17.6 0-32-14.4-32-32V416c0-17.6 14.4-32 32-32s32 14.4 32 32v224c0 17.6-14.4 32-32 32z"
                              fill="#666666" p-id="2720"></path>
                            <path d="M158.4 675.2m-16 0a16 16 0 1 0 32 0 16 16 0 1 0-32 0Z" fill="#666666" p-id="2721">
                            </path>
                            <path d="M284 892m-16 0a16 16 0 1 0 32 0 16 16 0 1 0-32 0Z" fill="#666666" p-id="2722">
                            </path>
                            <path d="M208 892m-16 0a16 16 0 1 0 32 0 16 16 0 1 0-32 0Z" fill="#666666" p-id="2723">
                            </path>
                          </svg>
                          <span>举报</span>
                        </el-button>
                      </div>
                    </div>
                    <div style="height: 22px;"></div>
                  </div>
                  <div></div>
                  <div class="comment-footer">
                    <div class="comment-report">被举报{{ item.reportCount }}次</div>
                    <div class="comment-report-btn">
                      <el-button @click="handleReport(item.id)">
                        <svg t="1713537420374" class="icon" viewBox="0 0 1024 1024" version="1.1"
                          xmlns="http://www.w3.org/2000/svg" p-id="2717" width="12" height="12">
                          <path
                            d="M924.8 908H284v-32h640.8c8 0 15.2-4 20-11.2 4-7.2 4-15.2 0-22.4L532 128c-4-7.2-11.2-11.2-20-11.2-8 0-15.2 4-20 11.2l-320 555.2-28-16L464.8 112c9.6-16.8 27.2-27.2 47.2-27.2 20 0 37.6 10.4 47.2 27.2l412.8 714.4c9.6 16.8 9.6 37.6 0 54.4-9.6 17.6-27.2 27.2-47.2 27.2z"
                            fill="#666666" p-id="2718"></path>
                          <path d="M517.6 737.6m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#666666" p-id="2719">
                          </path>
                          <path
                            d="M517.6 672c-17.6 0-32-14.4-32-32V416c0-17.6 14.4-32 32-32s32 14.4 32 32v224c0 17.6-14.4 32-32 32z"
                            fill="#666666" p-id="2720"></path>
                          <path d="M158.4 675.2m-16 0a16 16 0 1 0 32 0 16 16 0 1 0-32 0Z" fill="#666666" p-id="2721">
                          </path>
                          <path d="M284 892m-16 0a16 16 0 1 0 32 0 16 16 0 1 0-32 0Z" fill="#666666" p-id="2722"></path>
                          <path d="M208 892m-16 0a16 16 0 1 0 32 0 16 16 0 1 0-32 0Z" fill="#666666" p-id="2723"></path>
                        </svg>
                        <span>举报</span>
                      </el-button>
                    </div>
                    <div class="reply-btn">
                      <el-button
                        @click="handleReply(userStoreInstance.user.id, props.goods.id, props.store.id, item.id)">
                        <svg t="1713487275691" class="icon" viewBox="0 0 1099 1024" version="1.1"
                          xmlns="http://www.w3.org/2000/svg" p-id="4468" width="12" height="12">
                          <path
                            d="M378.06 436.1c0 19.6 15.5 35.5 34.6 35.5 19.1 0 34.6-15.9 34.6-35.5s-15.5-35.5-34.6-35.5C393.56 400.6 378.06 416.5 378.06 436.1zM731.26 436.1c0-19.6-15.5-35.5-34.6-35.5-19.1 0-34.6 15.9-34.6 35.5s15.5 35.5 34.6 35.5C715.76 471.6 731.26 455.7 731.26 436.1zM772.36 665.9l79.2 0c11.7 0 17.2-8.8 17.2-18.6L868.76 231.7c0-21.3-11.6-34.2-35.3-34.2L269.66 197.5c-17.9 0-26.3 10-26.3 27.2l0 411.9c0 16.3 6.7 29.7 23.9 30l237.8-0.5 202.6 188.6c14.2 11.6 28.1 12.8 39.4 5.8 8.3-5.1 12.6-13.4 12.6-23.7 0-25.7 0-141.1 0-160.9C759.56 669.3 764.66 665.9 772.36 665.9zM703.46 783.7 542.26 627.9c-5.3-5.9-10.5-11.4-22.2-11.4L315.96 616.5c-15.7 0-23.3-7.9-23.3-24.1L292.66 273.6c0-16.2 7.9-25.2 23.6-25.2L797.16 248.4c15.7 0 22.8 7.4 22.8 23.5l0 332.7c0 12.8-4.8 13.5-16.7 13.5l-76.6 0c-10.5 0-14.5 4.7-14.4 13.7 0.2 15 0.1 137.6 0.1 146.4C712.46 789.1 710.86 791.2 703.46 783.7zM520.06 436.1c0 19.6 15.5 35.5 34.6 35.5 19.1 0 34.6-15.9 34.6-35.5s-15.5-35.5-34.6-35.5C535.56 400.6 520.06 416.5 520.06 436.1z"
                            p-id="4469"></path>
                        </svg>
                        <span>回复</span>
                      </el-button>
                    </div>
                    <div class="comment-like">
                      <el-button @click="toggleLikeOrDislike(item.id, 1)">
                        <svg v-if="!like[item.id]" t="1713448542848" class="icon" viewBox="0 0 1024 1024" version="1.1"
                          xmlns="http://www.w3.org/2000/svg" p-id="2463" width="12" height="12">
                          <path
                            d="M621.674667 408.021333c16.618667-74.24 28.224-127.936 34.837333-161.194666C673.152 163.093333 629.941333 85.333333 544.298667 85.333333c-77.226667 0-116.010667 38.378667-138.88 115.093334l-0.586667 2.24c-13.728 62.058667-34.72 110.165333-62.506667 144.586666a158.261333 158.261333 0 0 1-119.733333 58.965334l-21.909333 0.469333C148.437333 407.808 106.666667 450.816 106.666667 503.498667V821.333333c0 64.8 52.106667 117.333333 116.394666 117.333334h412.522667c84.736 0 160.373333-53.568 189.12-133.92l85.696-239.584c21.802667-60.96-9.536-128.202667-70.005333-150.186667a115.552 115.552 0 0 0-39.488-6.954667H621.674667zM544.256 149.333333c39.253333 0 59.498667 36.48 49.888 84.928-7.573333 38.144-21.984 104.426667-43.221333 198.666667-4.512 20.021333 10.56 39.093333 30.912 39.093333h218.666666c6.101333 0 12.16 1.066667 17.909334 3.168 27.445333 9.984 41.674667 40.554667 31.776 68.266667l-85.568 239.573333C744.981333 838.026667 693.301333 874.666667 635.402667 874.666667H223.498667C194.314667 874.666667 170.666667 850.784 170.666667 821.333333V503.498667c0-17.866667 14.144-32.448 31.829333-32.821334l21.866667-0.469333a221.12 221.12 0 0 0 167.381333-82.56c34.346667-42.602667 59.146667-99.306667 74.869333-169.877333C482.101333 166.336 499.552 149.333333 544.266667 149.333333z"
                            fill="#000000" p-id="2464"></path>
                        </svg>
                        <svg v-else t="1713507215488" class="icon" viewBox="0 0 1024 1024" version="1.1"
                          xmlns="http://www.w3.org/2000/svg" p-id="5476" width="12" height="12">
                          <path
                            d="M621.674667 408.021333c16.618667-74.24 28.224-127.936 34.837333-161.194666C673.152 163.093333 629.941333 85.333333 544.298667 85.333333c-77.226667 0-116.010667 38.378667-138.88 115.093334l-0.586667 2.24c-13.728 62.058667-34.72 110.165333-62.506667 144.586666a158.261333 158.261333 0 0 1-119.733333 58.965334l-21.909333 0.469333C148.437333 407.808 106.666667 450.816 106.666667 503.498667V821.333333c0 64.8 52.106667 117.333333 116.394666 117.333334h412.522667c84.736 0 160.373333-53.568 189.12-133.92l85.696-239.584c21.802667-60.96-9.536-128.202667-70.005333-150.186667a115.552 115.552 0 0 0-39.488-6.954667H621.674667z"
                            fill="#000000" p-id="5477"></path>
                        </svg>
                        <span>有用({{ item.likeCount }})</span>
                      </el-button>
                    </div>
                    <!-- 踩 -->
                    <div class="comment-dislike">
                      <el-button @click="toggleLikeOrDislike(item.id, 2)">
                        <svg v-if="!dislike[item.id]" t="1713486655240" class="icon" viewBox="0 0 1024 1024"
                          version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3473" width="12" height="12">
                          <path
                            d="M556.930612 929.959184c-27.167347 0-52.244898-8.881633-68.440816-25.6-26.644898-27.167347-38.138776-74.187755-50.155102-123.29796-6.791837-27.689796-14.628571-59.036735-22.465306-72.620408-21.942857-37.616327-68.963265-56.946939-82.546939-61.648979H257.044898c-27.167347 0-49.110204-21.942857-49.110204-49.110204v-397.061225c0-27.167347 21.942857-49.110204 49.110204-49.110204h71.57551c30.82449-16.195918 118.595918-56.946939 219.428572-56.946939h191.216326c31.346939 0 97.17551 11.493878 123.820408 55.902041C888.163265 191.216327 929.959184 512 929.959184 539.689796c0 60.081633-56.946939 106.579592-105.534694 106.579592h-125.910204c-4.179592 0-6.791837 2.612245-8.359184 3.657143-1.044898 1.567347-3.134694 4.702041-2.089796 8.881632 4.702041 21.420408 14.628571 77.844898 7.314286 137.404082-7.314286 61.126531-43.885714 108.669388-97.17551 126.432653-13.583673 5.22449-27.689796 7.314286-41.27347 7.314286zM257.044898 192.783673c-4.179592 0-7.314286 3.134694-7.314286 7.314286v397.061225c0 4.179592 3.134694 7.314286 7.314286 7.314285h83.069388l3.134694 1.044898c12.538776 4.179592 76.8 28.212245 108.146938 81.502041 10.971429 18.808163 18.808163 50.155102 27.167347 83.591837 10.44898 43.885714 20.897959 85.159184 39.706123 103.967347 13.583673 13.583673 40.75102 17.240816 66.873469 8.359184 37.616327-12.538776 63.738776-47.020408 68.963265-91.951021 4.702041-37.093878 2.089796-83.069388-6.791836-123.820408-3.134694-15.673469 0.522449-31.346939 10.448979-43.885714 9.926531-12.538776 24.555102-19.330612 40.751021-19.330613h125.910204c28.212245 0 63.738776-30.302041 63.738775-64.783673 0-42.840816-44.930612-340.636735-60.604081-368.326531-14.628571-24.555102-60.604082-35.526531-88.293878-35.52653h-191.216326c-96.653061 0-180.767347 41.273469-204.277551 54.334694l-4.702041 2.612244H257.044898z"
                            fill="#333333" p-id="3474"></path>
                          <path
                            d="M114.938776 629.55102c-11.493878 0-20.897959-9.404082-20.89796-20.897959v-428.408163c0-11.493878 9.404082-20.897959 20.89796-20.897959s20.897959 9.404082 20.897959 20.897959v428.408163c0 11.493878-9.404082 20.897959-20.897959 20.897959z"
                            fill="#333333" p-id="3475"></path>
                        </svg>
                        <svg v-else t="1713507292047" class="icon" viewBox="0 0 1024 1024" version="1.1"
                          xmlns="http://www.w3.org/2000/svg" p-id="1416" width="12" height="12">
                          <path
                            d="M723.2 77.5c0-7.3-5.9-13.3-13.3-13.3H288.7c-1.5 0-3 0.1-4.5 0.5-38.3 1.6-73.4 22.5-92.4 55.5-0.5 0.9-1 1.9-1.4 2.9C186.3 133.4 89.6 376.9 70.2 449 47.8 532.4 97.5 618.5 181 640.9c12.3 3.3 25.1 4.8 40.4 4.8l104.8 0.4c-13 59.4-15.2 148.5-15.2 201.6 0 61.7 50.2 111.9 111.9 111.9S535 909.4 535 847.6v-22.4c0-107.3 75.9-197.1 176.7-218.8 6.7-1.4 11.5-7.4 11.5-14.3V77.5z m147.5-13.3h-81.5c-7.3 0-13.3 5.9-13.3 13.3v514.6c0 5.1 4.2 9.3 9.3 9.3h85.6c49.4 0 89.5-40.1 89.5-89.5V153.8c-0.1-49.4-40.2-89.6-89.6-89.6z"
                            fill="" p-id="1417"></path>
                        </svg>
                        <span>没用({{ item.dislikeCount }})</span>
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <AddComment ref="openCommentDialog" @dialog="onDialog"></AddComment>
    <AddReport ref="openReportDialog" @dialog="onDialog"></AddReport>
  </div>
</template>

<style lang='less' scoped>
div {
  word-break: break-all;
}

.comment-page {
  width: 100%;
  height: 100%;
  background-color: #fff;
}

.comment-placeholder {
  width: 100%;
  height: 73px;
}

.comment-headerWrap {
  z-index: 10;
}

::v-deep(.el-tabs__item) {
  font-size: 1.2em;
}

.comment-tagList {
  display: inline-block;
}

.detail-btn {
  width: 100px;
}

.comment-sort {
  float: right;
  position: relative;
  width: 100px;
  display: inline-block;
  margin-right: 15px;
}

.comment-root {
  margin-bottom: 18px;
}

.comment-header {
  height: 37px;
}

.comment-avatar {
  float: left;
  margin-top: 2px;
}

.comment-avatar>img {
  height: 36px;
  width: 36px;
  border-radius: 18px;
  line-height: 39px;
  vertical-align: middle;
}

.comment-userInfo {
  height: 39px;
  float: left;
  margin-left: 7px;
}

.comment-username {
  font-family: PingFang SC;
  font-weight: 700;
  font-size: 17px;
  color: #000;
  line-height: 22px;
}

.comment-time {
  font-family: PingFang SC;
  font-size: 14px;
  color: #7a7a7a;
  line-height: 18px;
}

.comment-content {
  margin-top: 15px;
  font-family: PingFang SC;
  font-size: 16px;
  color: #000;
  line-height: 22px;
}

/* 子评论 */
.comment-reply-content {
  font-family: PingFang SC;
  font-size: 13px;
  color: #7a7a7a;
  line-height: 20px;
  margin-top: 15px;
}

.comment-reply-footer {
  position: relative;
  margin-top: 10;
}

.comment-reply-like {
  position: absolute;
  left: 0;
  top: 0;
  color: rgba(17, 31, 44, .72);
  margin-bottom: 10px;
}

.comment-reply-like>button {
  outline: 0;
  border: 0;
  background: #fff;
  cursor: pointer;
}

.comment-reply-like>button svg {
  margin-right: 3px;
  vertical-align: -2px;
}

.comment-reply-dislike {
  position: absolute;
  left: 80px;
  top: 0;
  color: rgba(17, 31, 44, .72);
  margin-bottom: 10px;
}

.comment-reply-dislike>button {
  outline: 0;
  border: 0;
  background: #fff;
  cursor: pointer;
}

.comment-dislike>button svg {
  margin-right: 3px;
  vertical-align: -2px;
}

.comment-reply-report {
  position: absolute;
  left: 160px;
  top: 0;
  color: rgba(17, 31, 44, .72);
  margin-bottom: 10px;
}

.comment-reply-report>button {
  outline: 0;
  border: 0;
  background: #fff;
  cursor: pointer;
}

.comment-reply-report>button svg {
  margin-right: 3px;
  vertical-align: -2px;
}

/* 父评论 */
.comment-footer {
  margin-top: 14px;
  position: relative;
}

.comment-report-btn {
  position: absolute;
  right: 230px;
  top: 0;
  color: rgba(17, 31, 44, .72);
}

.comment-report-btn>button {
  outline: 0;
  border: 0;
  background: #fff;
  cursor: pointer;
}

.comment-report,
.comment-like {
  font-family: PingFang SC;
  font-size: 13px;
  line-height: 18px;
}

.reply-btn {
  position: absolute;
  right: 160px;
  top: 0;
  color: rgba(17, 31, 44, .72);
}

.reply-btn>button {
  outline: 0;
  border: 0;
  background: #fff;
  cursor: pointer;
}

.reply-btn>button svg {
  margin-right: 3px;
  vertical-align: -1px;
}

.comment-like {
  position: absolute;
  right: 80px;
  top: 0;
  color: rgba(17, 31, 44, .72);
}

.comment-like>button {
  outline: 0;
  border: 0;
  background: #fff;
  cursor: pointer;
}

.comment-like>button svg {
  margin-right: 3px;
  vertical-align: -1px;
}

.comment-dislike {
  position: absolute;
  right: 0;
  top: 0;
  color: rgba(17, 31, 44, .72);
}

.comment-dislike>button {
  outline: 0;
  border: 0;
  background: #fff;
  cursor: pointer;
}

.comment-dislike>button svg {
  margin-right: 3px;
  vertical-align: -1px;
}
</style>
