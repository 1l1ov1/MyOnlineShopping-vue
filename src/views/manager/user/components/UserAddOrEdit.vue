<script setup>
import { ref, defineEmits } from 'vue'
import { userGetDetailService } from '@/api/user'
import SelectAddress from '@/components/selectAddress.vue'
import { ElMessage } from 'element-plus'
import { managerAddUserService, managerUpdateUserService } from '@/api/manager'
import {
  // regionData, // 省市区三级联动数据]
  codeToText
  // pcaTextArr // 省市区三级联动数据，纯汉字
} from 'element-china-area-data'

// 是否展示表单
const dialogFormVisible = ref(false)

// 表单实体
const defaultData = {
  id: undefined,
  username: '', // 账号
  password: '123456', // 密码
  phone: '', // 电话
  address: {
    userId: undefined, // 用户id
    provinceCode: '', // 省级编号
    provinceName: '', // 省名
    cityCode: '', // 市级编号
    cityName: '', // 市名
    districtCode: '', // 区级编号
    districtName: '', // 区名
    detail: ''
  }, // 地址
  avatar: '', // 头像
  addressList: [{}], // 地址
  status: undefined // 身份
}

// 设为默认
const formModel = ref(
  { ...defaultData }
)

// 表单引用
const formRef = ref({})
// 规则
const rules = ref({
  username: [
    {
      required: true,
      trigger: 'blur',
      max: 11,
      min: 5,
      message: '用户名必须是5-11位的字母或数字',
      pattern: /^[a-zA-Z0-9]{5,11}$/
    }],
  password: [
    {
      required: true,
      trigger: 'blur',
      max: 10,
      min: 6,
      message: '密码必须是6-10位的非空字符',
      pattern: /^\S{6,10}$/
    }
  ],
  phone: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入电话号码'
    },
    {
      min: 11,
      max: 11,
      trigger: true,
      message: '电话号码的长度错误，应为11位'
    },
    {
      pattern: /^1(3[0-9]|4[57]|5[0-35-9]|7[0678]|8[0-9])\d{8}$/,
      trigger: 'blur',
      message: '电话格式不正确'
    }
  ],
  status: [
    { required: true, trigger: 'blur', message: '请选择账号身份' }
  ],
  detail: [
    { required: true, trigger: 'blur', message: '请输入详细地址' },
    { max: 100, trigger: 'blur', message: '最大字符为100' }
  ]
})
const selectedOptions = ref([])
// 组件对外暴露一个方法 open， 基于open传来的参数，区分添加还是编辑
// open({}) => 表单无需渲染，说明添加
// open({id, username, ...}) => 表单需要渲染，说明是编辑
// open调用后，可以打开弹窗
const open = async (row) => {
  dialogFormVisible.value = true
  // 如果是编辑
  if (row.id) {
    // 得到该用户的默认地址 即唯一的地址
    const res = await userGetDetailService(row.id, 1)
    formModel.value = res.data
    // 如果地址列表的第0位为空， 即没有默认地址
    if (formModel.value.addressList[0] === null) {
      // Reflect.set(formModel.value, 'address', {
      //   userId: formModel.value.id, // 用户id
      //   provinceCode: '', // 省级编号
      //   provinceName: '', // 省名
      //   cityCode: '', // 市级编号
      //   cityName: '', // 市名
      //   districtCode: '', // 区级编号
      //   districtName: '', // 区名
      //   detail: ''// 详细地址
      // })
      // 就设置默认值
      formModel.value.addressList[0] = {
        detail: '',
        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        districtCode: '',
        districtName: ''
      }
      // 将选择选项清空
      selectedOptions.value[0] = ''
      selectedOptions.value[1] = ''
      selectedOptions.value[2] = ''
    } else {
      // 如果不空，就将地址赋值给selectOptions
      selectedOptions.value[0] = formModel.value.addressList[0].provinceCode
      selectedOptions.value[1] = formModel.value.addressList[0].cityCode
      selectedOptions.value[2] = formModel.value.addressList[0].districtCode
    }
  } else {
    // 需要重置数据
    formModel.value = { ...defaultData } // 基于默认的数据，重置form数据
    // 这里重置了表单数据，但是图片上传img地址，富文本编辑器内容 => 需要手动重置
  }
}
const emit = defineEmits(['dialog'])
const onSubmit = async () => {
  // 提交前先校验
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    console.log(formModel.value)
    await managerUpdateUserService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    // 添加默认密码
    formModel.value.password = '123456'
    await managerAddUserService(formModel.value)

    ElMessage.success('添加成功')
  }
  // 关闭对话框
  dialogFormVisible.value = false
  // 通知父组件
  emit('dialog')
}

// const options = ref(regionData)
// 选择完地址后的回调
// const handleChange = (val) => {
//   formModel.value.addressList[0].provinceCode = val[0]
//   formModel.value.addressList[0].provinceName = codeToText[val[0]]

//   formModel.value.addressList[0].cityCode = val[1]
//   formModel.value.addressList[0].cityName = codeToText[val[1]]

//   formModel.value.addressList[0].districtCode = val[2]
//   formModel.value.addressList[0].districtName = codeToText[val[2]]
// }
// 子组件回调
const chooseAddress = (val) => {
  formModel.value.addressList[0].provinceCode = val[0]
  formModel.value.addressList[0].provinceName = codeToText[val[0]]
  formModel.value.addressList[0].cityCode = val[1]
  formModel.value.addressList[0].cityName = codeToText[val[1]]
  formModel.value.addressList[0].districtCode = val[2]
  formModel.value.addressList[0].districtName = codeToText[val[2]]
}
// 向外暴露
defineExpose({
  open
})
</script>

<template>

  <el-dialog v-model="dialogFormVisible" :title="formModel.id === undefined ? '编辑用户' : '添加用户'" width="25%">
    <el-form ref="formRef" :model="formModel" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formModel.username" autocomplete="off" :disabled="formModel.id" />
      </el-form-item>
      <el-form-item label="默认密码" prop="username" v-if="!formModel.id">
        <el-input v-model="formModel.password" autocomplete="off" :disabled="true" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="formModel.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="默认地址" prop="address">
        <!-- <el-input v-model="formModel.address" autocomplete="off" /> -->
        <!--带isall参数和leave参数示例-->
        <!-- <elui-china-area-dht :leave="3" @change="writeAddress">
        </elui-china-area-dht> -->
       <!--  <el-cascader size="large" :options="options" clearable v-model="selectedOptions" placeholder="请选择地址"
          @change="handleChange" /> -->
          <SelectAddress :addressList="formModel.addressList" @chooseAddress="chooseAddress"></SelectAddress>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="formModel.addressList[0].detail" placeholder="请输入详细地址（精确到门牌号）" />
      </el-form-item>
      <el-form-item label="身份" prop="status">
        <el-select v-model="formModel.status" placeholder="请选择">
          <el-option label="管理员" :value="0" />
          <el-option label="普通用户" :value="1" />
          <el-option label="商家" :value="2" />
        </el-select>
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

<style lang="less" scoped>
.avatar-uploader {
  .avatar {
    width: 80%;
    height: 80%;
    display: block;
  }

  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }

}
</style>
