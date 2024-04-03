<script setup>
import { ref, watch } from 'vue'
import { getApplyDetailService, updateApply } from '@/api/apply'
import SelectAddress from '@/components/selectAddress'
import {
  // regionData, // 省市区三级联动数据]
  codeToText
  // pcaTextArr // 省市区三级联动数据，纯汉字
} from 'element-china-area-data'
import { ElMessage } from 'element-plus'
const props = defineProps({
  isRejection: Boolean
})

const statusIsRejection = ref(false)
watch(
  () => props.isRejection,
  (newValue) => {
    if (newValue) {
      statusIsRejection.value = newValue
    }
  }
)
// 表单实体
const defaultData = {
  id: undefined,
  storeName: '', // 店名
  username: '', // 用户名
  password: '',
  status: undefined, // 申请状态
  address: {},
  reason: ''
}
// 设为默认
const formModel = ref(
  { ...defaultData }
)
// 规则
const rules = ref({
  storeName: [
    { required: true, trigger: 'blur', message: '请输入店名' },
    {
      max: 15,
      min: 2,
      message: '店名必须是2-15位的非空字符',
      pattern: /^\S{2,15}$/
    }
  ],
  username: [
    {
      required: true,
      trigger: 'blur',
      max: 11,
      min: 5,
      message: '用户名必须是5-11位的字母或数字',
      pattern: /^[a-zA-Z0-9]{5,11}$/
    }],
  'address.detail': [
    {
      required: true,
      trigger: 'blur',
      max: 200,
      message: '请输入详细地址'
    }
  ]
})
const defaultAddress = ref(null)
const dialogFormVisible = ref(false)
const open = async (row) => {
  dialogFormVisible.value = true
  // 如果是编辑
  if (row.id) {
    // 得到该用户商店的信息
    const res = await getApplyDetailService(row.id)
    defaultAddress.value = res.data.address
    formModel.value = res.data
    console.log(formModel.value)
  } else {
    // 需要重置数据
    formModel.value = { ...defaultData } // 基于默认的数据，重置form数据
  }
}
// 子组件回调
const chooseAddress = (val) => {
  formModel.value.address.provinceCode = val[0]
  formModel.value.address.provinceName = codeToText[val[0]]
  formModel.value.address.cityCode = val[1]
  formModel.value.address.cityName = codeToText[val[1]]
  formModel.value.address.districtCode = val[2]
  formModel.value.address.districtName = codeToText[val[2]]
}
const formRef = ref()
const onSubmit = async () => {
  // 提交前先校验
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    // 如果此时是拒绝的
    if (statusIsRejection.value) {
      // 就一定要输入拒绝原因
      if (formModel.value.reason.trim() === '' ||
        formModel.value.reason === undefined ||
        formModel.value.reason === null) {
        ElMessage.error('请输入拒绝原因')
        return
      }
    }
    formModel.value.status = 2
    await updateApply(formModel.value)
    emit('rejection')
    ElMessage.success('编辑成功')
  }
  // 关闭对话框
  dialogFormVisible.value = false
  // 通知父组件
  emit('dialog')
}

const emit = defineEmits(['rejection'])
// 向外暴露
defineExpose({
  open
})
</script>

<template>

    <el-dialog v-model="dialogFormVisible" :title="formModel.id ? '编辑申请' : '添加申请'" width="25%">
        <el-form ref="formRef" :model="formModel" :rules="rules">、
            <el-form-item label="用户名" prop="username">
                <el-input v-model="formModel.username" autocomplete="off" :disabled="formModel.id" />
            </el-form-item>
            <el-form-item label="店名" prop="storeName">
                <el-input v-model="formModel.storeName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="店的地址" prop="address">
                  <SelectAddress :defaultAddress="defaultAddress" @chooseAddress="chooseAddress"></SelectAddress>
            </el-form-item>
            <el-form-item label="详细地址" prop="address.detail">
                <el-input type="textarea" autosize style="width: 264px;" resize="none" row="4"
                    v-model="formModel.address.detail" placeholder="请输入商店的详细地址" maxlength="200"></el-input>
            </el-form-item>
            <el-form-item label="拒绝原因" prop="reason">
                <el-input type="textarea" autosize style="width: 264px;" resize="none" row="4"
                    v-model="formModel.reason" placeholder="请输入拒绝原因" maxlength="200" :disabled="!isRejection"></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="onSubmit">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style lang='less' scoped>

</style>
