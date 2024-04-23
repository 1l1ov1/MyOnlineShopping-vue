<script setup>
import { ref } from 'vue'
import { addReportService } from '@/api/report'
import { ElMessage } from 'element-plus'
import { userStore } from '@/store'
const dialogVisible = ref(false)
const userStoreInstance = userStore()
const open = (commentId) => {
  dialogVisible.value = true
  params.value.commentId = commentId
  params.value.userId = userStoreInstance.user.id
}

const params = ref({
  reason: '',
  status: 1,
  isAward: 0
})
const onSubmit = async () => {
  const res = await addReportService(params.value)
  if (res.code === 1) {
    ElMessage.success('举报成功')
    dialogVisible.value = false
    // 清空举报内容
    params.value.reason = ''
    emit('dialog')
  }
}
const emit = defineEmits(['dialog'])
defineExpose({ open })
</script>

<template>
    <el-dialog v-model="dialogVisible" title="添加举报" width="500">
        <el-form v-model="params">
            <el-form-item prop="reason">
                <el-input v-model="params.reason" show-word-limit
                maxlength="300"
                type="textarea" placeholder="请输入举报内容"/>
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
