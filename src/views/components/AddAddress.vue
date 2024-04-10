<script setup>
import SelectAddress from '@/components/selectAddress.vue'
import { ref } from 'vue'
import { userStore } from '@/store/index.js'
import {
  // regionData, // 省市区三级联动数据]
  codeToText
  // pcaTextArr // 省市区三级联动数据，纯汉字
} from 'element-china-area-data'
import { userAddAddress } from '@/api/user'
import { ElMessage } from 'element-plus'
import { addressConstant } from '@/constant/constants'
const userStoreInstance = userStore()
const dialogFormVisible = ref(false)

// 表单实体
const defaultData = {
  id: undefined,
  address: {
    userId: userStoreInstance.user.id, // 用户id
    provinceCode: '', // 省级编号
    provinceName: '', // 省名
    cityCode: '', // 市级编号
    cityName: '', // 市名
    districtCode: '', // 区级编号
    districtName: '', // 区名
    isDefault: addressConstant.addressStatus.IS_NOT_DEFAULT.value,
    detail: '' // 详细地址'
  } // 地址
}
// 设为默认
const formModel = ref(
  { ...defaultData }
)
const open = () => {
  dialogFormVisible.value = true
  formModel.value = { ...defaultData }
}
const formRef = ref()
const rules = ref({
  'address.detail': [
    { required: true, trigger: 'blur', message: '请输入详细地址' },
    { max: 100, trigger: 'blur', message: '最大字符为100' }
  ],
  address: [
    { required: true, trigger: 'blur', message: '请选择地址' }
  ]
})

// 子组件回调
const chooseAddress = (val) => {
  formModel.value.address.provinceCode = val[0]
  formModel.value.address.provinceName = codeToText[val[0]]
  formModel.value.address.cityCode = val[1]
  formModel.value.address.cityName = codeToText[val[1]]
  formModel.value.address.districtCode = val[2]
  formModel.value.address.districtName = codeToText[val[2]]
}

const emit = defineEmits(['dialog'])

const onSubmit = async () => {
  await formRef.value.validate()
  const res = await userAddAddress(formModel.value.address)
  if (res.code === 1) {
    ElMessage.success('添加成功')
    dialogFormVisible.value = false
    emit('dialog')
  }
}
// 向外暴露
defineExpose({
  open
})
</script>

<template>
    <el-dialog v-model="dialogFormVisible" :title="formModel.id === undefined ? '编辑地址' : '添加地址'" width="25%">
    <el-form ref="formRef" :model="formModel" :rules="rules">
      <el-form-item label="默认地址" prop="address">
          <SelectAddress :defaultAddress="formModel.address" @chooseAddress="chooseAddress"></SelectAddress>
      </el-form-item>
      <el-form-item label="详细地址" prop="address.detail">
        <el-input v-model="formModel.address.detail" placeholder="请输入详细地址（精确到门牌号）" />
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
