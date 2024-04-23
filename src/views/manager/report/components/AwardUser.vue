<script setup>
import { ref } from 'vue'
import { awardAccountConstant } from '@/constant/constants'
import { managerAwardUserService } from '@/api/manager'
import { ElMessage } from 'element-plus'
const dialogVisible = ref(false)

const params = ref({
  userId: undefined,
  award: undefined,
  reportId: undefined
})

// 弹窗
const open = (row) => {
  dialogVisible.value = true
  params.value.userId = row.userId
  params.value.reportId = row.id
}

const onsubmit = async () => {
  const res = await managerAwardUserService(params.value)
  if (res.code === 1) {
    ElMessage.success(res.msg)
    dialogVisible.value = false
    params.value.userId = undefined
    params.value.award = undefined
    emit('dialog')
    emit('award')
  }
}

const emit = defineEmits(['award', 'dialog'])
defineExpose({ open })

</script>

<template>
    <el-dialog v-model="dialogVisible" title="奖励用户" width="25%">
        <el-form :model="params"  label-width="80px">
            <el-form-item prop="award" label="奖励金额">
                <el-select v-model="params.award" autocomplete="off" placeholder="请选择奖励金额">
                    <el-option v-for="item in awardAccountConstant.awardAccount"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="button-box">
            <el-button type="primary" @click="onsubmit">确 定</el-button>
            <el-button @click="() => dialogVisible = false">取 消</el-button>
        </div>
    </el-dialog>
</template>

<style lang='less' scoped>

</style>
