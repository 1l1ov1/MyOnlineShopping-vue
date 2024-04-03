<script setup>
import pageContainer from '@/components/PageContainer.vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { getCategoryListService, updateCategoryService, batchDeleteCategoryService } from '@/api/category'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddOrEditCategory from './components/AddOrEditCategory.vue'
const params = ref({
  page: 1,
  pageSize: 10,
  id: undefined,
  categoryName: '',
  categoryStatus: undefined,
  sort: 1
})
const categoryList = ref([])
const loading = ref(false)
const total = ref(0)
const getCategoryList = async () => {
  loading.value = true
  const res = await getCategoryListService(params.value)
  categoryList.value = res.data.data
  total.value = res.data.total
  categoryList.value.forEach((item, index) => {
    item.serialNumber = (params.value.page - 1) * params.value.pageSize + index + 1
  })
  loading.value = false
}
// 被选中的数据
const selectedData = ref([])

// 给选择项绑定事件，当发生变化的时候就会触发该事件
const handleSelectionChange = (selected) => {
  selectedData.value = selected
}
// 切换当前展示的页数 page-size 改变时触发
const onSizeChange = (val) => {
  params.value.pageSize = val
  getCategoryList()
}
// 切换页面 current-page 改变时触发
const onCurrentChange = (val) => {
  params.value.page = val
  getCategoryList()
}
// 搜索
const onSearch = () => {
  // 重置页
  params.value.page = 1
  getCategoryList()
}
// 重置
const onReset = () => {
  params.value.page = 1
  params.value.categoryName = ''
  params.value.categoryStatus = ''
  getCategoryList()
}
const updateRef = ref()
// 修改分类状态
const changeCategoryStatus = (row) => {
  updateRef.value = { id: row.id, categoryStatus: row.categoryStatus, categoryName: '' }
  const msg = row.categoryStatus === 0 ? '启用' : '禁用'
  ElMessageBox.confirm(
    '确认是否修改编号' + row.id + '：' + row.categoryName + '的分类状态为' + msg,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    updateRef.value.categoryStatus = updateRef.value.categoryStatus === 0 ? 1 : 0
    // 确认的函数
    await updateCategoryService(updateRef.value)
    ElMessage.success('修改成功')
    getCategoryList()
  })
    .catch(() => {
      // 失败的函数
    })
}

// 单独删除
const onDeleteCategory = async (row) => {
  ElMessageBox.confirm(
    '确认是否要删除数据？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    // 确认的函数
    await batchDeleteCategoryService(row.id)
    ElMessage.success('删除成功')
    getCategoryList()
  })
    .catch(() => {
      // 失败的函数
    })
}
// 批量删除
const batchDeleteCategory = async () => {
  // 如果没有选中一条数据
  if (selectedData.value.length === 0) {
    ElMessage({
      showClose: true,
      message: '请选中至少一条数据',
      grouping: true,
      type: 'warning'
    })
    return
  }

  ElMessageBox.confirm(
    '确认是否要删除这' + selectedData.value.length + '条数据吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      grouping: true,
      type: 'warning'
    }
  ).then(async () => {
    // 确认的函数
    // 从被选中的对象中得到id 形成ids数组
    const ids = selectedData.value.map(item => item.id).join(',')
    await batchDeleteCategoryService(ids)
    getCategoryList()
    ElMessage({
      showClose: true,
      message: '删除成功',
      grouping: true,
      type: 'success'
    })
  })
    .catch(() => {
      // 失败的函数
      ElMessage({
        showClose: true,
        message: '删除失败',
        grouping: true,
        type: 'error'
      })
    })
}
const openDialog = ref()
const onAddCategory = () => {
  openDialog.value.open({})
}
const onEditCategory = (row) => {
  openDialog.value.open(row)
}
// 接收子组件的通知后，就调用该方法
const onDialog = () => {
  getCategoryList()
}
// 排序
const sortTable = ({ column, prop, order }) => {
  if (order === 'ascending') {
    params.value.sort = 1
  } else if (order === 'descending') {
    params.value.sort = 0
  }
  getCategoryList()
}
onMounted(() => {
  getCategoryList()
})
</script>

<template>
    <pageContainer title="所有申请">
        <template #extra>
            <el-button @click="onAddCategory" type="primary" ref="dialog">添加分类</el-button>
            <el-button @click="batchDeleteCategory()" type="primary">批量删除</el-button>
        </template>
        <!-- 行内表单 -->
        <el-form inline>
            <el-form-item label="用户搜索">
                <el-input v-model="params.categoryName" placeholder="分类名称" />
            </el-form-item>
            <el-form-item label="分类状态">
                <el-select style="width: 100px" v-model="params.categoryStatus" placeholder="请选择" clearable>
                    <el-option label="禁用" :value="0" />
                    <el-option label="启用" :value="1" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="onSearch" type="primary">搜索</el-button>
                <el-button @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格区域 -->
        <el-table v-if="categoryList.length !== 0" :data="categoryList" style="width: 100%" v-loading="loading"
            @selection-change="handleSelectionChange" :cell-style="tableRowStyle" @sort-change="sortTable"
            :sort-orders="['ascending', 'descending']">
            <el-table-column type="selection" width="55" />
            <!-- <el-table-column sortable="true" label="序号" width="180" type="index" :index="indexMethod" /> -->
            <el-table-column label="序号" prop="serialNumber" sortable="custom" width="100" align="center">
                <!-- <template #default="row">
          {{ (params.page - 1) * params.pageSize + row.$index + 1 }}
        </template> -->
            </el-table-column>
            <el-table-column prop="id" label="ID" width="180" v-if="false" />
            <el-table-column prop="categoryName" label="分类名称" width="150" align="center" />
            <el-table-column prop="categoryStatus" label="当前分类状态" width="125" align="center">
                <template #default="{ row }">
                    <el-link :underline="false" type="primary" @click="changeCategoryStatus(row)">
                        {{
                        row.categoryStatus == 0 ? '禁用'
            : '启用' }}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="onEditCategory(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="onDeleteCategory(row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 如果美没有数据，就显示空状态 -->
        <el-empty v-else :img-size="200"></el-empty>
        <!-- 分页区域 -->
        <el-pagination v-model:current-page="params.page" v-model:page-size="params.pageSize"
            :page-sizes="[5, 10, 20, 40, 100]" layout="jumper, total, sizes, prev, pager, next" background
            :total="total" @size-change="onSizeChange" @current-change="onCurrentChange"
            style="margin-top: 20px; justify-content: flex-end" />

        <AddOrEditCategory ref="openDialog" @dialog="onDialog">
        </AddOrEditCategory>
    </pageContainer>
</template>

<style lang='less' scoped></style>
