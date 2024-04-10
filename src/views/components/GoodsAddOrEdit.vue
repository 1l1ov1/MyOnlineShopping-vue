<script setup>
import { ref, defineEmits, onMounted, onUnmounted, computed } from 'vue'
import { userStore } from '@/store'
import { ElMessage } from 'element-plus'
import { AddGoodsService, UpdateGoodsService, GetGoodsDetailService } from '@/api/goods'
import { uploadGoodsFile } from '@/api/uploadImg'
import { UploadFilled } from '@element-plus/icons-vue'
import { getCategoryListService } from '@/api/category'
import { goodsConstant } from '@/constant/constants'
const userStoreInstance = userStore()
// 是否展示表单
const dialogFormVisible = ref(false)

// 表单实体
const defaultData = {
  id: undefined,
  goodsName: '', // 商品名
  price: undefined, // 商品价格
  discount: undefined, // 商品折扣
  description: '', // 商品描述
  coverPic: '', // 商品图片
  total: undefined, // 商品总量
  store: {
    storeName: userStoreInstance.user.store !== null ? userStoreInstance.user.store.storeName : null
  }, // 店
  status: undefined, // 商品状态
  categoryId: undefined // 分类id
}
const categoryList = ref()
// 设为默认
const formModel = ref({
  ...defaultData
}
)

// 表单引用
const formRef = ref({})
// 规则
const rules = ref({
  'store.storeName': [
    { required: true, trigger: 'blur', message: '请输入店名' },
    {
      max: 15,
      min: 2,
      message: '店名必须是2-15位的非空字符',
      pattern: /^\S{2,15}$/
    }
  ],
  goodsName: [
    { required: true, trigger: 'blur', message: '请输入商品名' },
    {
      max: 40,
      min: 1,
      message: '店名必须是1-40位的非空字符',
      pattern: /^\S{1,40}$/
    }
  ],
  status: [
    { required: true, trigger: 'blur', message: '请选择商品状态' }
  ],
  price: [
    { required: true, trigger: 'blur', message: '请输入商品价格' },
    // 1.00 ~ 9999.99之间 或者 10000.00 ~ 99998.99之间 或 99999.00
    {
      pattern: /^([1-9]{1}[0-9]{0,3}\.[0-9]{2})|([1-9]\d{3}[0-8]\.\d{2})|(9{5}\.0{2})$/,
      trigger: 'blur',
      message: '商品价格应在1.00 ~ 99999.00 之间'
    }
    // { validator: checkPrice, trigger: 'blur' }
  ],
  discount: [
    { required: true, trigger: 'blur', message: '请选择商品折扣' }
  ],
  total: [
    { required: true, trigger: 'blur', message: '请输入商品总量' },
    {
      pattern: /^([1-9]\d{0,5})$/,
      trigger: 'blur',
      message: '商品总量应在1 ~ 999999 之间'
    }
  ],
  description: [
    { required: true, trigger: 'blur', message: '请输入商品描述' }
  ],
  categoryId: [
    { required: true, trigger: 'blur', message: '请选择商品分类' }
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
    const res = await GetGoodsDetailService(row.id)
    formModel.value = res.data
    formModel.value.price = formModel.value.price.toFixed(2)
  } else {
    // 需要重置数据
    formModel.value = { ...defaultData } // 基于默认的数据，重置form数据
    imgUrl.value = ''
  }
}
const tempId = ref()
const emit = defineEmits(['dialog'])
const onSubmit = async () => {
  // 提交前先校验
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    await UpdateGoodsService(formModel.value)
    tempId.value = formModel.value.id
    ElMessage.success('编辑成功')
  } else {
    // 添加商店
    const res = await AddGoodsService(formModel.value)
    tempId.value = res.data
    ElMessage.success('添加成功')
  }
  // 如果修改了图片
  if (imgBinary.value !== undefined) {
    await uploadImg()
  }
  // 关闭对话框
  dialogFormVisible.value = false
  // 通知父组件
  emit('dialog')
}
// 折扣项
/* const discountItem = ref(
  [{
    label: '免费',
    value: 0
  }, {
    label: '1折',
    value: 0.1
  },
  {
    label: '1.5折',
    value: 0.15
  },
  {
    label: '2折',
    value: 0.2
  },
  {
    label: '2.5折',
    value: 0.25
  },
  {
    label: '3折',
    value: 0.3
  },
  {
    label: '3.5折',
    value: 0.35
  },

  {
    label: '4折',
    value: 0.4
  },
  {
    label: '4.5折',
    value: 0.44
  },
  {
    label: '5折',
    value: 0.5
  },
  {
    label: '5.5折',
    value: 0.55
  },
  {
    label: '6折',
    value: 0.6
  },
  {
    label: '6.5折',
    value: 0.65
  },
  {
    label: '7折',
    value: 0.7
  },
  {
    label: '7.5折',
    value: 0.75
  },
  {
    label: '8折',
    value: 0.8
  },
  {
    label: '8.5折',
    value: 0.85
  },
  {
    label: '9折',
    value: 0.9
  },
  {
    label: '9.5折',
    value: 0.95
  },
  {
    label: '原价',
    value: 1
  }]
) */
const imgUrl = ref('')
const imgModel = ref()
const imgBinary = ref()
// 图片状态改变的回调
const onUploadFile = (uploadFile) => {
  // 得到图片内存路径
  imgUrl.value = URL.createObjectURL(uploadFile.raw) // 预览图片
  // 立刻将图片对象，存入 formModel.value.avatar将来用于提交 现在是file对象
  // formModel.value.avatar = uploadFile.raw
  imgBinary.value = uploadFile.raw
}

// 图片回显
const handleAvatarSuccess = (res, file) => {
  imgUrl.value = res.data
}
// 上传图片前的回调
const beforeAvatarUpload = (rowFile) => {
  const type = rowFile.type === 'image/jpeg' ||
    rowFile.type === 'image/png' ||
    rowFile.type === 'image/jpg'
  if (!type) {
    ElMessage.error('图片格式必须是jpeg、png 或者 jpg格式')
    imgUrl.value = ''
    return false
  } else if (rowFile.size / 8 / 1024 > 500) {
    ElMessage.error('图片大小必须小于等于500KB!')
    return false
  }
  return true
}
const uploadImg = async () => {
  const fd = new FormData()
  fd.append('id', tempId.value)
  fd.append('file', imgBinary.value)
  const res = await uploadGoodsFile(fd)
  if (res.code === 1) {
    formModel.value.coverPic = '@/assets/uploadGoods/' + res.data.fileName
    // 上传成功清空文件
    imgModel.value.handleRemove(imgBinary.value)
  }
}
// 回车确定
const keyDown = (e) => {
  // 如果按键是回车
  if (e.keyCode === 13) {
    // 提交
    onSubmit()
  }
}
const getCategoryList = async () => {
  // 由于类别不会有很多，所以就这样简单的写死
  const res = await getCategoryListService({ page: 1, pageSize: 100 })
  categoryList.value = res.data.data
}

const coverPicUrl = computed(() => {
  // 首先检查 imgUrl 是否有值
  if (imgUrl.value) {
    return imgUrl.value
  }

  // 检查 formModel.coverPic 是否有有效的值
  const coverPic = formModel.value.coverPic
  if (coverPic === undefined || coverPic === '' || coverPic === null) {
    // 如果 formModel.coverPic 没有有效值，则返回备用图片
    return require('@/assets/avatar.jpg')
  }

  // 如果 formModel.coverPic 有有效值，则返回对应的图片
  return require('@/assets/uploadGoods/' + coverPic)
})
onMounted(() => {
  // 绑定监听事件
  window.addEventListener('keydown', keyDown)
  getCategoryList()
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

  <el-dialog v-model="dialogFormVisible" :title="formModel.id ? '编辑商品' : '添加商品'" width="25%">
    <el-form ref="formRef" :model="formModel" :rules="rules">
      <el-form-item label="商品图片" prop="coverPic" style="height: 300px;">
        <!-- 此处需要关闭 element-plus的自动上传，不需要配置action等参数
            只需要做前端的本地预览即可，无需在提交之前上传图片
            语法：URL.createObjectURL(...) -->
        <el-upload ref="imgModel" class="goods-uploader" drag :auto-upload="false" :show-file-list="false"
          :on-change="onUploadFile" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess"
          :headers="{ Authorization: userStoreInstance.token }" :http-request="handleUpload">
          <img
            :src="coverPicUrl"
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
      <el-form-item label="商品名" prop="goodsName">
        <el-input v-model="formModel.goodsName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input v-model="formModel.price" autocomplete="off" maxlength="8" />
      </el-form-item>
      <el-form-item label="商品总量" prop="total">
        <el-input v-model.number="formModel.total" aria-placeholder="请输入商品总量，最大为99万" autocomplete="off"
          maxlength="10" />
      </el-form-item>
      <el-form-item label="商品折扣" prop="discount">
        <el-select v-model="formModel.discount" placeholder="请选择商品折扣" style="width: 240px">
          <el-option v-for="item in goodsConstant.goodsDiscount" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品状态" prop="status">
        <el-select v-model="formModel.status" placeholder="请选择商品状态" style="width: 240px">
          <el-option label="上架" value="1" />
          <el-option label="下架" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品描述" prop="description">
        <el-input type="textarea" rows="4" resize="none" v-model="formModel.description" autocomplete="off"
          placeholder="请输入商品描述，最多200个字" maxlength="200" />
      </el-form-item>
      <!-- 管理员应该显示 商家不应该显示 -->
      <el-form-item label="商店名称" prop="store.storeName" v-if="userStoreInstance.user.store === null">
        <!-- 如果是编辑应该禁止修改 -->
        <el-input :disabled="formModel.id" v-model="formModel.store.storeName" autocomplete="off" maxlength="8" />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="formModel.categoryId" placeholder="请选择商品状态" style="width: 240px">
            <el-option v-for="item in categoryList" :key="item.id"
            :label="item.categoryName" :value="item.id"></el-option>
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
.goods-uploader {
  height: 250px;

  .avatar {
    width: 90%;
    height: 90%;
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
    width: 100px;
    height: 100px;
    text-align: center;
  }

}

/* 在对element-ui修改组件样式时，需要添加样式穿透（/deep/或>>>）才能生效 */
/deep/.el-upload.is-drag,
/deep/.el-upload-dragger {
  height: 100%;
}

.el-icon--upload {
  width: 50px;
  height: 50px;
}
</style>
