<script setup>
import { ref, onMounted, watch } from 'vue'
import { queryFavoriteService, batchDeleteFavoriteService } from '@/api/favorite'
import { userStore } from '@/store'
import NavigationComponent from '@/views/components/NavigationComponent.vue'
import FooterComponent from '@/views/components/FooterComponent.vue'
import router from '@/router'
import { ElMessage, ElMessageBox } from 'element-plus'
const userStoreInstance = userStore()
const user = ref({
  ...userStoreInstance.user
})
const FavoriteType = {
  PRODUCT: 'product',
  STORE: 'store'
}
const isGoodsFavorite = ref(true)
const favoriteList = ref()
const goodsFavoriteList = ref()
const storeFavoriteList = ref()
const getUserFavorites = async () => {
  const res = await queryFavoriteService(user.value.id)
  favoriteList.value = res.data.favoriteList
  // 如果是商品 拥有goodsId和storeId,如果是商店只拥有storeId
  goodsFavoriteList.value = favoriteList.value.filter(item => item.goodsId !== null)
  storeFavoriteList.value = favoriteList.value.filter(item => item.storeId !== null && item.goodsId === null)
}
// 商品勾选框
const goodsCheckBox = ref([])
// 商店勾选框
const storeCheckBox = ref([])

// 当标签页转换的时候
const tabChange = (tabName) => {
  if (tabName !== '2') {
    isGoodsFavorite.value = !isGoodsFavorite.value
  }
}
// 离开标签页之前
const beforeLeave = (activeName, oldActiveName) => {
  // 阻止跳转删除和全选标签
  if (activeName === '2' || activeName === '3') {
    return false
  }
  // 其他标签, 清空
  selectedBox.value = []
  // 全部取消
  changeAll(FavoriteType.PRODUCT, false)
  changeAll(FavoriteType.STORE, false)
  // 统一改为全选
  all.value = '全选'
}
// 点击标签页
const all = ref('全选')

const tabClick = (tabPaneContext, event) => {
  const label = tabPaneContext.props.label
  // 提前判断是否为收藏类型
  const isProduct = isGoodsFavorite.value
  // 确定要操作的类型
  const favoriteType = isProduct ? FavoriteType.PRODUCT : FavoriteType.STORE
  // 如果点击的是删除
  if (label === '删除') {
    isProduct
      ? findSelected(goodsCheckBox.value, favoriteType)
      : findSelected(storeCheckBox.value, favoriteType)

    if (selectedBox.value.length === 0) {
      ElMessage.warning('请选择要删除的收藏')
      return
    }
    ElMessageBox.confirm(
      '确定要删除这些收藏吗？',
      '删除收藏',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      await deleteFavorite(favoriteType)
    }).catch(() => {})
  } else if (['全选', '取消'].includes(label)) {
    all.value = label === '全选' ? '取消' : '全选'
    // 使用三元运算符简化逻辑
    changeAll(favoriteType, label === '全选')
  }
}
// 删除
const deleteFavorite = async (target) => {
  const ids = selectedBox.value.join(',')
  const res = await batchDeleteFavoriteService(ids, target)
  if (res.code === 1) {
    ElMessage.success('删除成功')
    getUserFavorites()
  }
}
// 被选中的勾选框
const selectedBox = ref([])
// 查找勾选框中那些被选中
const findSelected = (checkBox, target) => {
  // 每次开始前都先清空
  selectedBox.value = []
  for (let i = 0; i < checkBox.length; i++) {
    if (checkBox[i]) {
      // 如果是商品
      if (target === FavoriteType.PRODUCT) {
        selectedBox.value.push(goodsFavoriteList.value[i].goodsId)
      } else if (target === FavoriteType.STORE) {
        selectedBox.value.push(storeFavoriteList.value[i].storeId)
      }
    }
  }
}
// 改变某种勾选框的全部状态
const changeAll = (target, flag) => {
  // 如果是商品
  if (target === FavoriteType.PRODUCT) {
    for (let i = 0; i < goodsCheckBox.value.length; i++) {
      goodsCheckBox.value[i] = flag
    }
  } else if (target === FavoriteType.STORE) {
    for (let i = 0; i < storeCheckBox.value.length; i++) {
      storeCheckBox.value[i] = flag
    }
  }
}

watch(
  () => favoriteList.value,
  (newValue) => {
    // 如果有值， 初始化
    goodsCheckBox.value = Array.from({ length: goodsFavoriteList.value.length }, () => false)
    storeCheckBox.value = Array.from({ length: storeFavoriteList.value.length }, () => false)
  }
)
onMounted(() => {
  getUserFavorites()
})
</script>

<template>
      <NavigationComponent ></NavigationComponent>
    <el-container class="goods-container" v-if="favoriteList">
        <el-header>
            <div class="hot-goods-title"><span class="hgt-title">您收藏的 {{ isGoodsFavorite ?
        '宝贝(全部' + goodsFavoriteList.length + ')' : '店铺(全部' + storeFavoriteList.length + ')' }}</span></div>
        </el-header>
        <el-tabs type="border-card" @tab-change="tabChange" :before-leave="beforeLeave" @tab-click="tabClick">
            <el-tab-pane label="宝贝" class="custom-tab-pane">
                <el-main>
                    <div class="goods-wrapper">
                        <div class="goods-list">
                            <div class="goods-item" v-for="(item, index) in goodsFavoriteList" :key="item.id"
                                style="display: inline-block;">
                                <div class="checkbox-wrapper" style="position: absolute; right: 0">
                                    <el-checkbox size="large" v-model="goodsCheckBox[index]"
                                        class="goodsCheckbox"></el-checkbox>
                                </div>
                                <a class="item-link" style="text-decoration: none;" target="_blank"
                                    @click="() => router.push('/goodsDetail/' + item.goodsId)">
                                    <div class="img-wrapper">
                                        <el-image lazy :src="(item.goods.coverPic !== null && item.goods.coverPic != undefined && item.goods.coverPic != '') ?
        require('@/assets/uploadGoods/' + item.goods.coverPic) : require('@/assets/默认商品图.png')" />
                                    </div>
                                    <div class="info-wrapper">
                                        <div class="title">{{ item.goods.goodsName }}</div>
                                    </div>
                                    <div class="price-wrapper">
                                        <span class="price-value">
                                            <em>￥</em>
                                            {{ (item.goods.price * item.goods.discount).toFixed(2) }}
                                            <span v-if="item.goods.total === 0">
                                                <strong>已售罄</strong>
                                            </span>
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </el-main>
            </el-tab-pane>
            <el-tab-pane label="商店" class="custom-tab-pane">
                <el-main>
                    <div class="goods-wrapper">
                        <div class="goods-list">
                            <div class="goods-item" v-for="(item, index) in storeFavoriteList" :key="item.id"
                                style="display: inline-block;">
                                <div class="checkbox-wrapper" style="position: absolute; right: 0">
                                    <el-checkbox size="large" v-model="storeCheckBox[index]"
                                        class="storeCheckbox"></el-checkbox>
                                </div>
                                <a class="item-link" style="text-decoration: none;" target="_blank"
                                    @click="() => router.push('/storeDetail/' + item.storeId)">
                                    <div class="img-wrapper">
                                        <el-image :src="(item.store.logo !== null
        && item.store.logo !== undefined
        && item.store.logo !== '') ?
        require('@/assets/uploadStore/' + item.store.logo) : require('@/assets/试用商户.png')" />
                                    </div>
                                    <div class="info-wrapper">
                                        <div class="title">{{ item.store.storeName }}</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </el-main>
            </el-tab-pane>
            <el-tab-pane label="删除"></el-tab-pane>
            <el-tab-pane :label="all"></el-tab-pane>
        </el-tabs>
    </el-container>
    <el-empty v-else description="暂无结果" />
    <FooterComponent></FooterComponent>
</template>

<style lang='less' scoped>
.el-container {
    margin: auto;
}
/deep/.el-tabs__item {
  font-size: 1.2em;
}
.goods-container {
    box-sizing: border-box;
}

.hot-goods-title {
    height: 24px;
    margin-bottom: 20px;
    margin-left: 6px;
}

.hot-goods-title .hgt-title {
    float: left;
    color: #111;
    font-weight: bold;
    font-size: 24px;
    line-height: 24px;
}

.goods-wrapper {
    margin-left: -16px;
}

.goods-list {
    margin-left: -18px;
}

.goods-item {
    position: relative;
    float: left;
    width: 372px;
    height: 174px;
    margin: 0 0 18px 18px;
    overflow: hidden;
    color: #333;
    background-color: #f7f9fa;
    border: 1px solid #f7f9fa;
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    border-radius: 12px;
    cursor: pointer;
    -webkit-transition: all 0.5s;
    -o-transition: all 0.5s;
    -moz-transition: all 0.5s;
    transition: all 0.5s;
}

.item-link {
    display: inline-block;
    width: 100%;
    height: 100%;
    padding: 11px;
    cursor: pointer;
}

.goods-item .img-wrapper {
    position: absolute;
    width: 150px;
    height: 150px;
    overflow: hidden;
    background-color: rgba(27, 23, 67, 0.03);
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
}

.goods-item .img-wrapper img {
    display: block;
    width: 100%;
    height: 100%;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;

    background: #fff;
    opacity: .9;
    -webkit-transition: all .2s;
    -moz-transition: all .2s;
    -o-transition: all .2s;
    transition: all .2s;
}

.goods-item .info-wrapper {
    height: 116px;
    margin-left: 162px;
    overflow: hidden;
}

.info-wrapper .title {
    display: inline-block;
    max-height: 46px;
    margin: 6px 0 2px 0;
    overflow: hidden;
    color: #333;
    font-size: 16px;
    line-height: 23px;
}

.price-wrapper {
    margin-left: 162px;
    color: #ff5000;
}

.price-wrapper .price-value {
    display: inline-block;
    font-size: 22px;
    line-height: 22px;
}

.price-wrapper .price-value em {
    margin-right: 4px;
    font-size: 14px;
    font-family: "Microsoft Yahei";
    vertical-align: middle;
}

.goodsCheckbox {
    zoom: 150%
}

.storeCheckbox {
    zoom: 150%;
}
</style>
