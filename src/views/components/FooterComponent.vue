<scripe setup>

</scripe>

<template>
    <div class="common-layout">
        <el-container>
            <el-footer>
                <el-row :gutter="20">
                    <el-col :span="4" :offset="3">
                        <div class="grid-content ep-bg-purple">
                            <svg t="1709366955821" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="5050" width="100" height="100">
                                <path
                                    d="M512 268.190476c134.656 0 243.809524 109.153524 243.809524 243.809524h-73.142857a170.666667 170.666667 0 1 0-176.518096 170.569143L512 682.666667c154.624 0 285.257143 102.814476 327.192381 243.809523h-77.287619c-39.009524-99.888762-136.192-170.666667-249.904762-170.666666s-210.895238 70.777905-249.904762 170.666666H184.807619a342.25981 342.25981 0 0 1 188.074667-214.259809A243.370667 243.370667 0 0 1 268.190476 512c0-134.656 109.153524-243.809524 243.809524-243.809524z m0-170.666666c180.077714 0 327.582476 139.459048 340.431238 316.245333A121.904762 121.904762 0 0 1 780.190476 633.904762l-158.47619 0.024381a60.952381 60.952381 0 1 1 0-73.142857l158.47619-0.024381a48.761905 48.761905 0 1 0 0-97.52381v-24.380952c0-148.114286-120.07619-268.190476-268.190476-268.190476s-268.190476 120.07619-268.190476 268.190476v24.380952a48.761905 48.761905 0 1 0 0 97.52381v73.142857a121.904762 121.904762 0 0 1-72.240762-220.111238C184.417524 236.982857 331.922286 97.52381 512 97.52381z"
                                    p-id="5051"></path>
                            </svg>
                            <div class="human-customer-service">
                                <el-link :underline="false" class="mx-2"  >人工客服</el-link>
                            </div>
                            <div class="phone-number" style="display: inline-block;">
                                <el-link :underline="false" class="mx-2">400-XX-X1X</el-link>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content ep-bg-purple">
                            <div class="help-center header">
                                <el-text :underline="false" class="mx-1" size="large">帮助中心</el-text>
                            </div>
                            <div class="help-center-item">
                                <el-link :underline="false" class="mx-2"  >账户管理</el-link>
                                <el-link :underline="false" class="mx-2"  >购物指南</el-link>
                                <el-link :underline="false" class="mx-2"  >订单操作</el-link>
                            </div>

                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content ep-bg-purple">

                            <div class="concern-us header">
                                <el-text :underline="false" class="mx-1" size="large">关注我们</el-text>
                            </div>
                            <div class="concern-us-item">
                                <el-link :underline="false" class="mx-2"  >新浪微博</el-link>
                                <el-link :underline="false" class="mx-2"  >官方微信</el-link>
                                <el-link :underline="false" class="mx-2"  >联系我们</el-link>
                            </div>

                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content ep-bg-purple">

                            <div class="In-line-stores header">
                                <el-text :underline="false" class="mx-1" size="large">线下门店</el-text>
                            </div>
                            <div class="concern-us-item">
                                <el-link :underline="false" class="mx-2"  >服务网点</el-link>
                                <el-link :underline="false" class="mx-2"  >授权体验店</el-link>
                            </div>

                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content ep-bg-purple">

                            <div class="about-us header">
                                <el-text :underline="false" class="mx-1" size="large">关于我们</el-text>
                            </div>
                            <div class="about-us-item">
                                <el-link :underline="false" class="mx-2"  >了解我们</el-link>
                                <el-link :underline="false" class="mx-2"  >加入我们</el-link>
                                <el-link :underline="false" class="mx-2"  >捐赠支持</el-link>
                            </div>

                        </div>
                    </el-col>
                </el-row>
                <div class="copy-right" style="text-align: center;">
                    <el-text type="primary" style="font-size: 20px;">copyright &copy; 2024 万一苇</el-text>
                </div>
            </el-footer>
        </el-container>
    </div>
</template>

<style lang="less" scoped>
.el-footer {
    margin-top: 20px;
    height: 100%;
}

.common-layout {
    background-color: #333;
}

.el-row {
    margin-bottom: 20px;
}

.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
    background-color: #333;
    width: 100px;
    font-size: 30px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
    width: 120px;
    height: auto;
}

.mx-1 {
    font-size: 30px;
}

.header {
    margin-bottom: 15px;
}
.mx-2 {
    font-size: 20px;
    margin-bottom: 10px;
}

</style>
