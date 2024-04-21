<script setup>
import { ref } from 'vue'
import { addCommentService } from '@/api/comment'
import { ElMessage } from 'element-plus'
const dialogVisible = ref(false)
const isBusiness = ref(false)
const user = ref()
const open = (value, goodsId, storeId, parentCommentId) => {
  dialogVisible.value = true
  user.value = value
  params.value.userId = value.id
  params.value.username = value.username
  params.value.avatar = (value.avatar === null ||
  value.avatar === undefined ||
  value.avatar === '')
    ? '@/assets/avatar.jpg'
    : value.avatar

  params.value.goodsId = goodsId
  params.value.storeId = storeId
  params.value.parentCommentId = parentCommentId

  // 如果当前用户是商家，就不需要评分
  if (user.value.store.id === storeId) {
    isBusiness.value = true
  }
}

const params = ref({
  content: '',
  star: 5
})
const onSubmit = async () => {
  const res = await addCommentService(params.value)
  if (res.code === 1) {
    ElMessage.success('评论成功')
    dialogVisible.value = false
    // 清空评论内容
    params.value.content = ''
    emit('dialog')
  }
  isBusiness.value = false
}
const emit = defineEmits(['dialog'])
defineExpose({ open })
</script>

<template>
    <el-dialog v-model="dialogVisible" title="添加评论" width="500">
        <el-form v-model="params">
            <el-form-item v-if="!isBusiness" prop="star" label="请给商品评分：">
               <el-rate v-model="params.star" allow-half />
            </el-form-item>
            <el-form-item prop="content">
                <el-input v-model="params.content" show-word-limit
                maxlength="300"
                type="textarea" placeholder="请输入评论内容"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                 @click="onSubmit">提交</el-button>
                 <el-button type="info"
                 @click="dialogVisible = false">取消</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>
</template>

<style lang='less' scoped>
::v-deep(.el-textarea__inner) {
    height: 150px;
}
</style>
