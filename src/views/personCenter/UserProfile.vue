<script setup>
import { userStore } from '@/store/index.js'
import { ElMessage } from 'element-plus'
import { ref, onMounted, nextTick } from 'vue'
import { userUpdateInfoService, updateAddressDefault, deleteAddress } from '@/api/user.js'
import pageContainer from '@/components/PageContainer.vue'
import { UploadFilled, Edit, Delete } from '@element-plus/icons-vue'
import {
  regionData, // 省市区三级联动数据]
  codeToText
  // pcaTextArr // 省市区三级联动数据，纯汉字
} from 'element-china-area-data'
import NavigationComponent from '../components/NavigationComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
import AddAddress from '@/views/components/AddAddress.vue'
const userStoreInstance = userStore()
// 得到仓库中的user

const formModel = ref({
  ...userStoreInstance.user
})
//
const rules = {
  phone: [
    { required: true, message: '请输入电话号码' },
    { min: 11, max: 11, message: '电话号码长度错误，应为11位' },
    { pattern: /^1(3[0-9]|4[57]|5[0-35-9]|7[0678]|8[0-9])\d{8}$/, trigger: 'blur', message: '电话格式不正确' }
  ]
}

const formRef = ref()
const onSubmit = async () => {
  const valid = await formRef.value.validate()
  if (valid) {
    await userUpdateInfoService(formModel.value)
    // 修改缓存中的user信息
    await userStoreInstance.getUser()
    ElMessage.success('修改成功')
  }
}

// 上传图片的路径
const imgUrl = ref('')
// imgUrl.value = '/api/img/uploadAvatar/' + formModel.value.avatar
// 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
const onUploadFile = (uploadFile) => {
  // 得到图片内存路径
  imgUrl.value = URL.createObjectURL(uploadFile.raw) // 预览图片
  // 立刻将图片对象，存入 formModel.value.avatar将来用于提交 现在是file对象
  // formModel.value.avatar = uploadFile.raw
}

// 图片回显
const handleAvatarSuccess = (res, file) => {
  imgUrl.value = res.data
  formModel.value.avatar = res.data
  // 然后重新修改缓存中用户的图片路径
  userStoreInstance.user.avatar = res.data
}

// 图片上传前先检查
const beforeAvatarUpload = (UploadRawFile) => {
  console.log(UploadRawFile.type)
  const type = UploadRawFile.type === 'image/jpeg' ||
    UploadRawFile.type === 'image/png' ||
    UploadRawFile.type === 'image/jpg'
  if (!type) {
    ElMessage.error('图片格式必须是jpeg、png 或者 jpg格式')
    imgUrl.value = ''
    return false
  } else if (UploadRawFile.size / 8 / 1024 > 500) {
    ElMessage.error('图片大小必须小于等于500KB!')
    return false
  }

  return true
}
const options = ref(regionData)
// 选择地址的数组
const selectedOptions = ref([])
// 选择完地址后的回调
// val 选中的值
// 索引下标
const handleChange = (val, index) => {
  console.log(val)
  formModel.value.addressList[index].provinceCode = val[0]
  formModel.value.addressList[index].provinceName = codeToText[val[0]]

  formModel.value.addressList[index].cityCode = val[1]
  formModel.value.addressList[index].cityName = codeToText[val[1]]

  formModel.value.addressList[index].districtCode = val[2]
  formModel.value.addressList[index].districtName = codeToText[val[2]]
  // 当修改完后，结束编辑，隐藏选择器
  isEditAddress.value = false
}
const isEditAddress = ref(false)
const columnDbClick = (row, column, cell, event) => {
  if (column.label === '详细地址') {
    // const oldValue = row[column.property]
    // 创建输入框
    const cellInput = document.createElement('textarea')
    // 设置输入框的值
    cellInput.value = row[column.property]
    event.target.innerHTML = ''
    // 设置css
    cellInput.style.height = 'auto'
    cellInput.style.padding = '0 16px'
    cellInput.style.lineHeight = '23px'
    cellInput.style.fontSize = '1em'
    cellInput.style.color = '#606266'
    cellInput.style.resize = 'none'
    // 将输入框添加到单元格中
    cell.appendChild(cellInput)
    // 聚焦
    cellInput.focus()
    // 失焦事件
    cellInput.onblur = function () {
      // 移除textarea
      cell.removeChild(cellInput)
      // 将里面的内容放到单元格中
      event.target.innerHTML = cellInput.value
      row[column.property] = cellInput.value
    }
  } else if (column.label === '收获地址') {
    // 开启选择器
    isEditAddress.value = true
  }
}
// 更改默认地址
const onEditAddress = async (row) => {
  const res = await updateAddressDefault(row)
  if (res.code === 1) {
    ElMessage.success('修改成功')
    updateData()
  }
}
// 删除地址
const onDeleteAddress = async (row) => {
  const res = await deleteAddress(row.id)
  if (res.code === 1) {
    ElMessage.success('修改成功')
    updateData()
  }
}
const openDialog = ref()
const addAddress = () => {
  openDialog.value.open()
}

const onDialog = () => {
  updateData()
}

const updateData = async () => {
// 重新刷新
  await userStoreInstance.getUser()
  nextTick(() => {
    // 更新数据
    formModel.value = { ...userStoreInstance.user }
  })
}
onMounted(() => {
  selectedOptions.value = formModel.value.addressList
})
</script>

<template>
  <NavigationComponent></NavigationComponent>
  <page-container title="基本资料">
    <el-row>
      <el-col :span="12">
        <el-form :model="formModel" :rules="rules" ref="formRef" label-width="100px" size="large">
          <el-form-item label="头像" prop="imageUrl">
            <!-- 此处需要关闭 element-plus的自动上传，不需要配置action等参数
            只需要做前端的本地预览即可，无需在提交之前上传图片
            语法：URL.createObjectURL(...) -->
            <el-upload class="avatar-uploader" drag :auto-upload="true" :show-file-list="false"
              action="/api/img/uploadAvatar" :on-change="onUploadFile" :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess" :headers="{ Authorization: userStoreInstance.token }">
              <img
                :src="(formModel.avatar === undefined || formModel.avatar === '' || formModel.avatar === null) ?
        ((imgUrl === '' ? require('@/assets/avatar.jpg') : imgUrl)) : require('@/assets/uploadAvatar/' + formModel.avatar)"
                class="avatar" />
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  jpeg/jpg/png files with a size less than 500kb
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="用户账户">
            <el-input v-model="formModel.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户电话" prop="phone">
            <el-input v-model="formModel.phone" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item label="账户创建时间" prop="createTime">
            <el-input v-model="formModel.createTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="账户余额" prop="money">
            <el-input v-model="formModel.money" disabled></el-input>
          </el-form-item>
          <el-form-item label="收货地址" prop="addressList">

            <el-table :data="formModel.addressList" border style="width: 100%" @cell-dblclick="columnDbClick">
              <el-table-column prop="address" label="收获地址">

                <template #default="scope">
                  <el-cascader v-if="isEditAddress" size="large" :options="options" clearable
                    v-model="selectedOptions[scope.$index]['districtCode']" placeholder="请选择地址"
                    @change="handleChange($event, scope.$index)" />
                  <div v-else>
                    {{ scope.row.provinceName + '/' + scope.row.cityName + '/' + scope.row.districtName }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="detail" label="详细地址">

                <template #default="{ row }">
                  {{ row.detail }}
                </template>
              </el-table-column>
              <el-table-column prop="address" label="是否是默认地址">

                <template #default="{ row }">
                  {{ row.isDefault === 1 ? '默认地址' : '普通收货地址' }}
                </template>
              </el-table-column>
              <el-table-column prop="address" label="设为默认地址">
                <template #default="{row}">
                  <div v-if="row.isDefault === 0">
                     <el-button :icon="Edit" circle plain type="primary" @click="onEditAddress(row)"></el-button>
                     <el-button :icon="Delete" circle plain type="danger" @click="onDeleteAddress(row)"></el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button @click="addAddress" type="primary">添加地址</el-button>
            <el-button @click="onSubmit" type="primary">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <AddAddress ref="openDialog" @dialog="onDialog"></AddAddress>
  </page-container>
  <FooterComponent></FooterComponent>
</template>

<style scoped lang="less">
.avatar-uploader {

  .avatar {
    width: 278px;
    height: 278px;
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
    width: 278px;
    height: 278px;
    text-align: center;
  }

}
</style>
