<script setup>
import { ref, defineEmits } from 'vue'
import { getCategoryDetailService, updateCategoryService, addCategoryService } from '@/api/category'
import { ElMessage } from 'element-plus'
// 是否展示表单
const dialogFormVisible = ref(false)
const defaultData = {
  id: undefined,
  categoryName: '',
  categoryStatus: undefined
}

const formModel = ref(
  { ...defaultData }
)
const rules = ref({
  categoryName: [
    { required: true, trigger: 'blur', message: '请输入分类名称' },
    { min: 2, max: 6, trigger: 'blur', message: '名称长度应为2~6' },
    { pattern: /^\S{2,6}$/, trigger: 'blur', message: '不能出现空格' }
  ],
  categoryStatus: [
    { required: true, trigger: 'blur', message: '请选择分类状态' }
  ]
})
const formRef = ref()
// 组件对外暴露一个方法 open， 基于open传来的参数，区分添加还是编辑
// open({}) => 表单无需渲染，说明添加
// open({id, username, ...}) => 表单需要渲染，说明是编辑
// open调用后，可以打开弹窗
const open = async (row) => {
  dialogFormVisible.value = true
  // 如果是编辑
  if (row.id) {
    // 得到该用户的默认地址 即唯一的地址
    const res = await getCategoryDetailService(row.id)
    formModel.value = res.data
  } else {
    // 需要重置数据
    formModel.value = { ...defaultData } // 基于默认的数据，重置form数据
    // 这里重置了表单数据，但是图片上传img地址，富文本编辑器内容 => 需要手动重置
  }
}

const onSubmit = async () => {
  // 提交前先校验
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    await updateCategoryService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    // 添加分类
    await addCategoryService(formModel.value)
    ElMessage.success('添加成功')
  }
  // 关闭对话框
  dialogFormVisible.value = false
  // 通知父组件
  emit('dialog')
}
const emit = defineEmits(['dialog'])
// 向外暴露
defineExpose({
  open
})
</script>

<template>
     <el-dialog v-model="dialogFormVisible" :title="formModel.id === undefined ? '编辑分类' : '添加分类'" width="25%">
    <el-form ref="formRef" :model="formModel" :rules="rules">
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="formModel.categoryName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="分类状态" prop="categoryStatus">
        <el-select v-model="formModel.categoryStatus" placeholder="请选择">
          <el-option label="禁用" :value="0" />
          <el-option label="启用" :value="1" />
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

<style lang='less' scoped>

</style>
