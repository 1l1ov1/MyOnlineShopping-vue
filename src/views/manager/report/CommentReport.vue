<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref, onMounted } from 'vue'
import { getReportListService } from '@/api/report'
import ForbiddenOrBan from './components/ForbiddenOrBan.vue'
const params = ref({
  page: 1,
  pageSize: 10,
  id: undefined,
  username: '', // 举报人用户名
  reportedUsername: '', // 被举报人用户名
  storeName: '',
  goodsName: '',
  storeId: undefined
})
// 举报列表
const loading = ref(false)
const reportList = ref([])
const total = ref(0)
const queryReportList = async () => {
  // 开始加载，启动加载动画
  loading.value = true
  const res = await getReportListService(params.value)
  reportList.value = res.data.data
  total.value = res.data.total

  reportList.value.forEach((item, index) => {
    item.serialNumber = (params.value.page - 1) * params.value.pageSize + index + 1
  })

  loading.value = false
}
// 将对待被举报多次的用户进行禁言或封禁
const ForbiddenOrBanRef = ref()
const handleReported = (row) => {
  ForbiddenOrBanRef.value.open(row)
}

const onDialog = () => {
  queryReportList()
}
onMounted(() => {
  queryReportList()
})
</script>

<template>
    <PageContainer title="评论举报管理">
        <el-form inline>
      <el-form-item>
        <el-input v-model="params.username" placeholder="举报人账号" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.reportedUsername" placeholder="被举报人账号" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.storeName" placeholder="商店名称" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.goodsName" placeholder="商品名称" />
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-if="reportList.length !== 0" :data="reportList"  style="width: 100%" v-loading="loading"
      @selection-change="handleSelectionChange" :cell-style="tableRowStyle"
      @sort-change="sortTable"
      :sort-orders="['ascending', 'descending']">
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" prop="serialNumber" sortable="custom"
        width="90" align="center"/>
      <el-table-column prop="id" label="ID" width="180" v-if="false" />
      <el-table-column prop="username" label="举报人" width="100"  align="center"/>
      <el-table-column prop="reason" label="举报原因" width="180"  align="center"/>
      <el-table-column prop="reportedUsername" label="被举报人" width="120"  align="center">
        <template #default="{row}" >
          <el-link @click="handleReported(row)" v-if="row.reportCount >= 1" type="primary" :underline="false">{{ row.reportedUsername }}</el-link>
          <span v-else>{{ row.reportedUsername }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="评论内容" width="180"  align="center"/>
      <el-table-column prop="reportCount" label="举报次数" width="90"  align="center"/>
      <el-table-column prop="storeName" label="商店名称" width="130"  align="center"/>
      <el-table-column prop="goodsName" label="商品名称" width="120"  align="center"/>
      <el-table-column prop="createTime" label="举报时间" width="160"  align="center"/>
      <el-table-column label="操作" width="150" align="center">
        <template #default="scope">
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="text" @click="handleHidden(scope.row)">隐藏</el-button>
        </template>
      </el-table-column>

    </el-table>

      <!-- 如果美没有数据，就显示空状态 -->
      <el-empty v-else :img-size="200"></el-empty>
    </PageContainer>

    <ForbiddenOrBan ref="ForbiddenOrBanRef" @dialog="onDialog"></ForbiddenOrBan>
</template>

<style lang='less' scoped>

</style>
