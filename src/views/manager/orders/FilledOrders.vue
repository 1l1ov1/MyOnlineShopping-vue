<script setup>
import { ref, onMounted, h } from 'vue'
import { getOrdersListService, batchDeleteOrdersService, updateOrdersService } from '@/api/orders'
import { Delete } from '@element-plus/icons-vue'
import pageContainer from '@/components/PageContainer.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const params = ref({
  page: 1, // 当前页
  pageSize: 10, // 当前生效页的每页条数
  id: undefined, // 编号
  goodsName: '', // 商品名
  coverPic: '',
  status: 2, // 订单状态
  store: {
    storeName: ''
  }, // 商店
  address: {}, // 用户接收地址
  username: '', // 用户名
  phone: '', // 购买者电话
  sort: 1
})
// 请求加载
const loading = ref(false)
const ordersList = ref([])
// 总条数
const total = ref(0)
const getOrdersList = async () => {
  loading.value = true
  const res = await getOrdersListService(params.value)
  ordersList.value = res.data.data
  total.value = res.data.total
  ordersList.value.forEach((item, index) => {
    item.serialNumber = (params.value.page - 1) * params.value.pageSize + index + 1
  })

  loading.value = false
}
// 被选中的数据
const selectedData = ref([])
const tableRef = ref()
// 给选择项绑定事件，当发生变化的时候就会触发该事件
const handleSelectionChange = (selected) => {
  selectedData.value = selected
}
// 切换当前展示的页数 page-size 改变时触发
const onSizeChange = (val) => {
  params.value.pageSize = val
  getOrdersList()
}
// 切换页面 current-page 改变时触发
const onCurrentChange = (val) => {
  params.value.page = val
  getOrdersList()
}
// 搜索
const onSearch = () => {
  // 重置页
  params.value.page = 1
  getOrdersList()
}
// 重置
const onReset = () => {
  params.value.page = 1
  params.value.username = ''
  params.value.status = ''
  params.value.store.storeName = ''
  getOrdersList()
  ElMessage({
    message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
      h('span', null, '重置成功')
    ])
  })
}
// 单独删除
const onDeleteOrders = (row) => {
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
    await batchDeleteOrdersService(row.id)
    ElMessage.success('删除成功')
    getOrdersList()
  })
    .catch(() => {
      // 失败的函数
    })
}
// 批量删除
const batchDeleteOrders = () => {
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
    await batchDeleteOrdersService(ids)
    getOrdersList()
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
// 当双击单元格
const editingRow = ref(null)
const elSelectRef = ref(null)
const handleDbClick = (index, row) => {
  editingRow.value = { index, status: row.status }
  elSelectRef.value.$el.focus() // 将焦点聚焦到 select 上
}
// 当选择框被修改时候
const handleSelectChange = (index, newValue) => {
  // 更新对应行的状态
  ordersList.value[index].status = newValue
  // 关闭编辑状态
  editingRow.value = null
  updateOrdersStatus(newValue, ordersList.value[index].id)
}
const updateOrdersStatus = async (status, id) => {
  await updateOrdersService(status, id)
  getOrdersList()
}
// 当选择框失去焦点的时候
const handleClickOutside = (event) => {
  if (elSelectRef.value && !elSelectRef.value.$el.contains(event.target)) {
    // 如果点击事件的目标不在 select 元素内部，则关闭编辑状态
    editingRow.value = null
  }
}

// 表格排序
// 排序
const sortTable = ({ column, prop, order }) => {
  if (order === 'ascending') {
    params.value.sort = 1
  } else if (order === 'descending') {
    params.value.sort = 0
  }
  getOrdersList()
}
onMounted(() => {
  getOrdersList()
})
</script>

<template>
    <pageContainer title="订单管理" @click="handleClickOutside">
        <template #extra>
            <!-- <el-button @click="onAddUser" type="primary" ref="dialog">添加用户</el-button> -->
            <el-button @click="batchDeleteOrders()" type="primary">批量删除</el-button>
        </template>
        <!-- 行内表单 -->
        <el-form inline>
            <el-form-item label="用户搜索">
                <el-input v-model="params.username" placeholder="用户账号" />
            </el-form-item>
            <!-- <el-form-item label="订单状态">
                <el-select style="width: 100px" v-model="params.status" placeholder="请选择" clearable>
                    <el-option label="未发货" value="1" />
                    <el-option label="已发货" value="2" />
                    <el-option label="退款" value="3" />
                </el-select>
            </el-form-item> -->
            <el-form-item label="商店名">
                <el-input v-model="params.store.storeName" placeholder="请输入商店名" />
            </el-form-item>
            <el-form-item>
                <el-button @click="onSearch" type="primary">搜索</el-button>
                <el-button @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格区域 -->
        <el-table v-if="ordersList.length !== 0" :data="ordersList" style="width: 100%" v-loading="loading"
            @selection-change="handleSelectionChange" :cell-style="tableRowStyle" @sort-change="sortTable"
            :sort-orders="['ascending', 'descending']"
            ref="tableRef">
            <el-table-column type="selection" width="40" />
            <!-- <el-table-column sortable="true" label="序号" width="180" type="index" :index="indexMethod" /> -->
            <el-table-column label="序号" prop="serialNumber" sortable="custom" width="90" align="center">
            </el-table-column>
            <el-table-column prop="id" label="ID" width="180" v-if="false" />
            <el-table-column prop="username" label="买家账号" width="150" align="center" />
            <el-table-column prop="phone" label="买家电话" align="center" />
            <el-table-column prop="goodsName" label="商品名" align="center"></el-table-column>
            <el-table-column prop="number" label="商品数量" align="center"></el-table-column>
            <el-table-column prop="totalPrice" label="支付价格" align="center"></el-table-column>
            <el-table-column prop="store.storeName" label="店名" align="center"></el-table-column>
            <el-table-column prop="address" label="买家收获地址">
                <template #default="{ row }">
                    {{ (row.address === null || row.address === undefined) ? '' : row.address.provinceName + '/' +
                row.address.cityName + '/' +
                row.address.districtName }}
                </template>
            </el-table-column>
            <el-table-column prop="address" label="买家详细地址">

                <template #default="{ row }">
                    {{ (row.address === null || row.address === undefined) ? '' : row.address.detail }}
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="订单创建时间" align="center" />
            <el-table-column prop="status" label="订单状态" width="110" align="center">
                <template #default="scope">
                    <div @dblclick="handleDbClick(scope.$index, scope.row)">
                        <span v-if="!editingRow || editingRow.index !== scope.$index">
                          {{ scope.row.status === 1 ? '未发货' : scope.row.status === 2
                            ? '已发货' : scope.row.status === 3 ? '退款' : scope.row.status === 4 ? '用户已签收' : '交易完成' }}
                        </span>
                        <el-select v-else ref="elSelectRef" v-model="scope.row.status" @change="handleSelectChange(scope.$index, $event)">
                            <el-option label="未发货" :value='1'></el-option>
                            <el-option label="已发货" :value='2'></el-option>
                            <el-option label="退款" :value='3'></el-option>
                            <el-option label="用户已签收" :value='4'></el-option>
                            <el-option label="交易完成" :value='5'></el-option>
                        </el-select>
                    </div>

                </template>
            </el-table-column>
            <el-table-column label="操作">

                <template #default="{ row }">
                    <!-- <el-button :icon="Edit" circle plain type="primary" @click="onEditUser(row)"></el-button> -->
                    <el-button :icon="Delete" circle plain type="danger" @click="onDeleteOrders(row)"></el-button>
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

        <!--       <UserAddOrEdit ref="openDialog" @dialog="onDialog"></UserAddOrEdit> -->
    </pageContainer>
</template>

<style lang="less" scoped></style>
