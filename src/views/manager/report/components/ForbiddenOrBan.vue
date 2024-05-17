<script setup>
import { ref } from 'vue'
import { forbiddenWordOrBanConstant } from '@/constant/constants'
import { forbidOrBanUserService, managerUpdateForbiddenWord } from '@/api/manager'
import { ElMessage } from 'element-plus'
const dialogVisible = ref(false)
const params = ref({
  reportId: [],
  reportedUsername: '',
  forbiddenWordTime: undefined,
  banTime: undefined,
  reportedUserId: undefined
})
const tabName = ref('禁言')
// 是否是管理员禁言
const isManagerForbidden = ref(false)
const userId = ref()
const open = async (row, type) => {
  if (type === '举报') {
    dialogVisible.value = true
    row.children.forEach(report => {
      // 放入所有的举报id
      params.value.reportId.push(report.id)
    })
    params.value.reportedUsername = row.reportedUsername
    params.value.reportedUserId = row.reportedUserId
  } else if (type === '禁言') {
    // 说明是用户管理的禁言
    dialogVisible.value = true
    isManagerForbidden.value = true
    userId.value = row.id
  } else if (type === '解除禁言') {
    const res = await managerUpdateForbiddenWord({ reportedUserId: row.id, type: type })
    if (res.code === 1) {
      ElMessage.success('修改成功')
      emit('dialog')
    }
  }
}

const tabChange = () => {
  // 每次标签页改变时，都将清0
  params.value.forbiddenWordTime = undefined
  params.value.banTime = undefined
}

const onsubmit = async () => {
  // 如果现在是管理员对在用户管理界面对用户进行禁言操作
  if (isManagerForbidden.value) {
    const res = await managerUpdateForbiddenWord({
      reportedUserId: userId.value,
      type: '禁言',
      forbiddenWordTime: params.value.forbiddenWordTime
    })
    if (res.code === 1) {
      isManagerForbidden.value = false
      dialogVisible.value = false
      ElMessage.success('修改成功')
      emit('dialog')
      return
    }
  }
  // 否则就是在举报管理中进行禁言或者封禁
  params.value.type = tabName.value
  const res = await forbidOrBanUserService(params.value)
  if (res.code === 1) {
    ElMessage.success('操作成功')
    dialogVisible.value = false
    emit('dialog')
  }
}
const emit = defineEmits(['dialog'])
defineExpose({ open })
</script>

<template>
  <el-dialog v-model="dialogVisible" title="禁言或封禁账号" width="25%">
    <el-tabs v-model="tabName" @tab-change="tabChange">
      <el-tab-pane label="禁言" name="禁言">
        <el-form :model="params" label-width="80px">
          <el-form-item prop="forbiddenWordTime" label="禁言时间">
            <el-select v-model="params.forbiddenWordTime" autocomplete="off" placeholder="请选择禁言时间">
              <el-option v-for="item in forbiddenWordOrBanConstant.forbiddenWordTime" :key="item.value"
                :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="封禁" name="封禁" v-if="!isManagerForbidden">
        <el-form :model="params" label-width="80px">
          <el-form-item prop="banTime" label="封禁时间">
            <el-select v-model="params.banTime" autocomplete="off" placeholder="请选择封禁时间">
              <el-option v-for="item in forbiddenWordOrBanConstant.banTime" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="button-box">
      <el-button type="primary" @click="onsubmit">确 定</el-button>
      <el-button @click="() => dialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<style lang='less' scoped></style>
