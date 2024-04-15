<script setup>
import { ref, defineEmits, onMounted, onUnmounted } from 'vue'
import { userStore } from '@/store/index.js'
import { ElMessage } from 'element-plus'
import { AddStoreService, UpdateStoreService, GetStoreDetailService } from '@/api/store'
const userStoreInstance = userStore()
// 是否展示表单
const dialogFormVisible = ref(false)

// 表单实体
const defaultData = {
  id: undefined,
  storeName: '', // 店名
  username: '', // 用户名
  status: undefined, // 商店状态
  logo: ''
}

// 设为默认
const formModel = ref(
  { ...defaultData }
)

// 表单引用
const formRef = ref({})
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
  status: [
    { required: true, trigger: 'blur', message: '请选择账号身份' }
  ]
})

// 组件对外暴露一个方法 open， 基于open传来的参数，区分添加还是编辑
// open({}) => 表单无需渲染，说明添加
// open({id, username, ...}) => 表单需要渲染，说明是编辑
// open调用后，可以打开弹窗
const open = async (row) => {
  dialogFormVisible.value = true
  // 如果是编辑
  if (row.id) {
    // 得到该用户商店的信息
    const res = await GetStoreDetailService(row.id)
    formModel.value = res.data
  } else {
    // 需要重置数据
    formModel.value = { ...defaultData } // 基于默认的数据，重置form数据
  }
}
const emit = defineEmits(['dialog'])
const onSubmit = async () => {
  // 提交前先校验
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    await UpdateStoreService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    // 添加商店
    await AddStoreService(formModel.value)
    ElMessage.success('添加成功')
  }
  // 关闭对话框
  dialogFormVisible.value = false
  // 通知父组件
  emit('dialog')
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
  formModel.value.logo = res.data
  // 然后重新修改缓存中用户的图片路径
  userStoreInstance.user.store.logo = res.data
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
// 回车确定
const keyDown = (e) => {
  // 如果按键是回车
  if (e.keyCode === 13) {
    // 提交
    onSubmit()
  }
}

onMounted(() => {
  // 绑定监听事件
  window.addEventListener('keydown', keyDown)
})

onUnmounted(() => {
  // 销毁事件
  window.removeEventListener('keydown', keyDown, false)
})

// 向外暴露
defineExpose({
  open
})
</script>

<template>

    <el-dialog v-model="dialogFormVisible" :title="formModel.id ? '编辑商家' : '添加商家'" width="25%">
        <el-form ref="formRef" :model="formModel" :rules="rules">
          <el-text type="warning">图片自动上传，不用提交,只上传图片的话注意要重新刷新页面</el-text>
          <el-form-item label="商店Logo" prop="imageUrl">
            <!-- 此处需要关闭 element-plus的自动上传，不需要配置action等参数
            只需要做前端的本地预览即可，无需在提交之前上传图片
            语法：URL.createObjectURL(...) -->
            <el-upload class="avatar-uploader" drag :auto-upload="true" :show-file-list="false"
              action="/api/img/uploadStore" :on-change="onUploadFile" :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess" :headers="{ Authorization: userStoreInstance.token }">
              <img
                :src="(formModel.logo === undefined || formModel.logo === '' || formModel.logo === null) ?
        ((imgUrl === '' ? require('@/assets/试用商户.png') : imgUrl)) : require('@/assets/uploadStore/' + formModel.logo)"
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
            <el-form-item label="店名" prop="storeName">
                <el-input v-model="formModel.storeName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="formModel.username" autocomplete="off" :disabled="formModel.id" />
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
