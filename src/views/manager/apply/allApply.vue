<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import pageContainer from '@/components/PageContainer.vue'
import { getApplyListService, batchDeleteApplyService, updateApply } from '@/api/apply'
import { ref, onMounted } from 'vue'
import ApplyEditDialog from './components/ApplyEdit'
import { applyConstant } from '@/constant/constants'
const params = ref({
  page: 1, // 当前页
  pageSize: 10, // 当前生效页的每页条数
  id: undefined, // 编号
  username: '', // 账号
  status: undefined,
  storeName: '',
  address: {},
  sort: 1
})
// 请求加载
const loading = ref(false)
const applyList = ref([])
// 总条数
const total = ref(0)
const getApplyList = async () => {
  loading.value = true
  const res = await getApplyListService(params.value)
  total.value = res.data.total
  applyList.value = res.data.data
  applyList.value.forEach((item, index) => {
    item.serialNumber = (params.value.page - 1) * params.value.pageSize + index + 1
  })

  loading.value = false
}

// 搜索
const onSearch = () => {
  // 重置页
  params.value.page = 1
  getApplyList()
}
// 重置
const onReset = () => {
  params.value.page = 1
  params.value.username = ''
  params.value.status = ''
  params.value.storeName = ''
  getApplyList()
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
  getApplyList()
}
// 切换页面 current-page 改变时触发
const onCurrentChange = (val) => {
  params.value.page = val
  getApplyList()
}

// 当双击单元格
const editingRow = ref(null)
const elSelectRef = ref(null)
const handleDbClick = (index, row) => {
  // 如果是通过或者拒绝就不允许修改
  if (row.status === applyConstant.applyStatus.APPROVED || row.status === applyConstant.applyStatus.REVIEW_REJECTION) {
    return
  }
  editingRow.value = { index, status: row.status }
  // elSelectRef.value.$el.focus() // 将焦点聚焦到 select 上
}
// 当选择框被修改时候
const isRejection = ref(false)
const handleSelectChange = async (index, newValue) => {
  // 关闭编辑状态
  editingRow.value = null
  // 如果是拒绝的
  if (newValue === 2) {
    ElMessage('请输入拒绝原因')
    isRejection.value = true
    openDialog.value.open(applyList.value[index])
  } else {
    // 更新对应行的状态
    applyList.value[index].status = newValue
    // updateApplyStatus(newValue, applyList.value[index].id)
    // 清空拒绝理由
    applyList.value[index].reason = ''
    await updateApply(applyList.value[index])
  }
}
// 当是拒绝原因被填入，修改
const handleRejection = () => {
  // 修改状态
  isRejection.value = false
  getApplyList()
}

/* const updateApplyStatus = async (status, id) => {
  const res = await updateApplyService(status, id)
  if (res.code === 1) {
    ElMessage.success('修改成功')
  }
  getApplyList()
} */
// 当选择框失去焦点的时候
const handleClickOutside = (event) => {
  if (elSelectRef.value && !elSelectRef.value.$el.contains(event.target)) {
    // 如果点击事件的目标不在 select 元素内部，则关闭编辑状态
    editingRow.value = null
  }
}

// 删除
const onDeleteApply = (row) => {
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
    await batchDeleteApplyService(row.id)
    ElMessage.success('删除成功')
    getApplyList()
  })
    .catch(() => {
      // 失败的函数
    })
}

const batchDeleteApply = () => {
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
    await batchDeleteApplyService(ids)
    getApplyList()
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
// 对话框
const openDialog = ref()
const onEditApply = (row) => {
  openDialog.value.open(row)
}
// 排序
const sortTable = ({ column, prop, order }) => {
  if (order === 'ascending') {
    params.value.sort = 1
  } else if (order === 'descending') {
    params.value.sort = 0
  }
  getApplyList()
}
onMounted(() => {
  getApplyList()
})
</script>

<template>
  <pageContainer title="所有申请" @click="handleClickOutside">
    <template #extra>
      <!-- <el-button @click="onAddUser" type="primary" ref="dialog">添加用户</el-button> -->
      <el-button @click="batchDeleteApply()" type="primary">批量删除</el-button>
    </template>
    <!-- 行内表单 -->
    <el-form inline>
      <el-form-item label="用户搜索">
        <el-input v-model="params.username" placeholder="用户账号" />
      </el-form-item>
      <el-form-item label="申请状态">
        <el-select style="width: 100px" v-model="params.status" placeholder="请选择" clearable>
          <el-option label="待审核" :value="applyConstant.applyStatus.UNDER_REVIEW.value" />
          <el-option label="已通过" :value="applyConstant.applyStatus.APPROVED.value" />
          <el-option label="被拒绝" :value="applyConstant.applyStatus.REVIEW_REJECTION.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="商店搜索">
        <el-input v-model="params.storeName" placeholder="商店名称" />
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table v-if="applyList.length !== 0" :data="applyList" style="width: 100%" v-loading="loading"
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
      <el-table-column prop="avatar" label="头像" width="180" v-if="false" />
      <el-table-column prop="username" label="用户账号" width="150" align="center" />
      <el-table-column prop="storeName" label="商店名称" align="center" />
      <el-table-column prop="address" label="商店地址" width="180" align="center">

        <template #default="{ row }">
          {{ (row.address === null || row.address === undefined) ? '' :
    row.address.provinceName + '/' + row.address.cityName + '/' +
    row.address.districtName }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="详细地址" width="150" align="center">

        <template #default="{ row }">
          {{ (row.address === null || row.address === undefined) ? '' : row.address.detail }}
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="拒绝原因" align="center">
        <template #default={row}>
          {{ (row.reason === '' || row.reason === null) ? '暂无' : row.reason }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" align="center" />
      <el-table-column prop="status" label="当前申请状态" width="125" align="center">

        <template #default="scope">
          <div @dblclick="handleDbClick(scope.$index, scope.row)">
            <span v-if="!editingRow || editingRow.index !== scope.$index">
              {{ applyConstant.getApplyStatusLabel(scope.row.status) }}
            </span>
            <el-select v-else ref="elSelectRef" v-model="scope.row.status"
              @change="handleSelectChange(scope.$index, $event)">
              <el-option label="待审核" :value="applyConstant.applyStatus.UNDER_REVIEW.value" />
              <el-option label="已通过" :value="applyConstant.applyStatus.APPROVED.value" />
              <el-option label="被拒绝" :value="applyConstant.applyStatus.REVIEW_REJECTION.value" />
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditApply(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDeleteApply(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 如果美没有数据，就显示空状态 -->
    <el-empty v-else :img-size="200"></el-empty>
    <!-- 分页区域 -->
    <el-pagination v-model:current-page="params.page" v-model:page-size="params.pageSize"
      :page-sizes="[5, 10, 20, 40, 100]" layout="jumper, total, sizes, prev, pager, next" background :total="total"
      @size-change="onSizeChange" @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end" />

    <ApplyEditDialog ref="openDialog" @rejection="handleRejection" :isRejection="isRejection" @dialog="onDialog">
    </ApplyEditDialog>
  </pageContainer>
</template>

<style lang='less' scoped></style>
