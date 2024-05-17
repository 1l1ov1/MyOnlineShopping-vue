<script setup>
import { ref, onMounted } from 'vue'
import { DeleteBatchGoodsService, getGoodsListService, UpdateGoodsService } from '@/api/goods'
import { Edit, Delete } from '@element-plus/icons-vue'
import pageContainer from '@/components/PageContainer.vue'
import GoodsAddOrEdit from '../../components/GoodsAddOrEdit'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userStore } from '@/store'
import { getCategoryListService } from '@/api/category'
import { goodsConstant } from '@/constant/constants'
const userStoreInstance = userStore()
// 商品列表
const goodsList = ref([])
// 总条数
const total = ref(0)
// 定义请求参数对象
const params = ref({
  page: 1, // 当前页
  pageSize: 10, // 当前生效页的每页条数
  id: undefined, // 编号
  goodsName: undefined, // 商品名
  categoryName: undefined,
  categoryId: undefined,
  price: undefined, // 商品价格
  status: undefined, // 商品状态
  discount: undefined, // 商品折扣
  total: undefined, // 商品总数
  coverPic: '', // 商品封面
  storeId: userStoreInstance.user.store.id === null
    ? undefined
    : userStoreInstance.user.store.id,
  store: {
    storeName: '',
    userId: userStoreInstance.user.store === null ? undefined : userStoreInstance.user.store.userId
  }, // 商店
  sort: 0
})

// 请求加载
const loading = ref(false)
// 分页查询
const getGoodsList = async () => {
  // 开始加载，启动加载动画
  loading.value = true
  // 开始发送分页请求
  const res = await getGoodsListService(params.value)
  goodsList.value = res.data.data
  total.value = res.data.total
  // 在获得userList后，给每一行添加序号
  goodsList.value.forEach((item, index) => {
    item.serialNumber = (params.value.page - 1) * params.value.pageSize + index + 1
  })

  loading.value = false
}

const openDialog = ref()
// 添加商品
const onAddGoods = async () => {
  openDialog.value.open({})
}
// 修改商品
const onEditGoods = (row) => {
  openDialog.value.open(row)
}
// 搜索商品
const onSearch = () => {
  // 重置页
  params.value.page = 1
  getGoodsList()
}
// 重置
const onReset = () => {
  params.value.page = 1
  params.value.goodsName = undefined
  params.value.categoryId = undefined
  params.value.status = undefined
  params.value.store.storeName = undefined
  getGoodsList()
}

const onCurrentChange = (val) => {
  params.value.page = val
  getGoodsList()
}

const onSizeChange = (val) => {
  params.value.pageSize = val
  getGoodsList()
}

const onDialog = () => {
  getGoodsList()
}
// 被选中的数据
const selectedData = ref([])
// 给选择项绑定事件，当发生变化的时候就会触发该事件
const handleSelectionChange = (selected) => {
  selectedData.value = selected
}
// 批量修改
const patchDeleteGoods = () => {
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
    await DeleteBatchGoodsService(ids)
    getGoodsList()
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
// 单独删除
const onDeleteGoods = (row) => {
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
    await DeleteBatchGoodsService(row.id)
    getGoodsList()
  })
    .catch(() => {
      // 失败的函数
      ElMessage({
        message: '删除失败',
        type: 'error',
        showClose: true
      })
    })
}
const updateRef = ref()
const changeGoodsStatus = (row) => {
  updateRef.value = row
  const msg = goodsConstant.getReversGoodsStatusLabel(row.status)
  ElMessageBox.confirm(
    '确认是否修改编号' + row.id + '：' + row.goodsName + '的账号状态为' + msg,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    updateRef.value.status = updateRef.value.status === 0 ? 1 : 0
    // 确认的函数
    await UpdateGoodsService(updateRef.value)
    getGoodsList()
  })
    .catch(() => {
      // 失败的函数
    })
}

// 表格排序
// 排序
const sortTable = ({ column, prop, order }) => {
  if (order === 'ascending') {
    params.value.sort = 1
  } else if (order === 'descending') {
    params.value.sort = 0
  }
  getGoodsList()
}
const categoryList = ref()
const getCategoryList = async () => {
  // 由于类别不会有很多，所以就这样简单的写死
  const res = await getCategoryListService({ page: 1, pageSize: 100 })
  categoryList.value = res.data.data
}
onMounted(() => {
  getGoodsList()
  getCategoryList()
})
</script>

<template>
  <pageContainer title="商品管理">
    <template #extra>
      <el-button @click="onAddGoods" type="primary" ref="dialog">添加商品</el-button>
      <el-button @click="patchDeleteGoods()" type="primary">批量删除</el-button>
    </template>
    <!-- 行内表单 -->
    <el-form inline>
      <el-form-item label="商品搜索">
        <el-input v-model="params.goodsName" placeholder="商品名称" />
      </el-form-item>
      <el-form-item label="分类搜索" v-if="categoryList">
        <el-select style="width: 100px" v-model="params.categoryId" placeholder="请选择" clearable>
          <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品状态">
        <el-select style="width: 100px" v-model="params.status" placeholder="请选择" clearable>
          <el-option label="上架" :value="goodsConstant.goodsStatus.SHELVES.value" />
          <el-option label="下架" :value="goodsConstant.goodsStatus.TAKE_OFF_THE_SHELVES.value" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="店名搜索">
        <el-input v-model="params.store.storeName" placeholder="请输入店名" />
      </el-form-item> -->
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table v-if="goodsList.length !== 0" :data="goodsList" style="width: 100%" v-loading="loading"
      @selection-change="handleSelectionChange" :cell-style="tableRowStyle" @sort-change="sortTable"
      :sort-orders="['ascending', 'descending']">
      <el-table-column type="selection" width="40" />
      <el-table-column label="序号" prop="serialNumber" sortable="custom" width="100" align="center">
      </el-table-column>
      <!-- <el-table-column prop="avatar" label="头像" width="180" v-if="false" /> -->
      <el-table-column prop="goodsName" label="商品名" width="130" align="center" />
      <el-table-column prop="categoryName" label="分类" width="65" align="center"></el-table-column>
      <el-table-column prop="price" label="商品原价" width="110" align="center">
        <template #default="{ row }">
          ￥ {{ row.price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="商品折扣" width="80" align="center">
      </el-table-column>
      <el-table-column label="商品现价" width="120" align="center">
        <template #default="{ row }">
          ￥ {{ (row.price * row.discount).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="total" label="商品总数" width="110" align="center">
        <template #default="{ row }">
          {{ row.total }} 件
        </template>
      </el-table-column>
      <el-table-column prop="store.storeName" label="店名" width="140" align="center">
      </el-table-column>
      <el-table-column prop="store.coverPic" label="商品图片" width="100" align="center">
        <template #default="{ row }">
          <el-avatar :src="require('@/assets/uploadGoods/' + row.coverPic)" />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="商品创建时间" align="center" />
      <el-table-column prop="status" label="当前商品状态" width="105" align="center">

        <template #default="{ row }">
          <el-link :underline="false" type="primary" @click="changeGoodsStatus(row)">{{
        goodsConstant.getGoodsStatusLabel(row.status) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">

        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditGoods(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDeleteGoods(row)"></el-button>
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

    <GoodsAddOrEdit ref="openDialog" @dialog="onDialog"></GoodsAddOrEdit>
  </pageContainer>
</template>

<style lang="less" scoped></style>
