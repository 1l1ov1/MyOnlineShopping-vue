import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import 'echarts'
import ECharts from 'vue-echarts'
// import 'amfe-flexible'
createApp(App).use(ElementPlus).component('v-chart', ECharts).use(router).use(pinia).mount('#app')
