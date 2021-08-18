import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import store from './store/index.js'
// 导入自定义的请求模块
import {
	req,
	showToast,
	rd,
	formatDate,
	getUserData,
	uploadData
} from './utils/request.js'
// 使用 uView UI
Vue.use(uView);
// 隐藏生产环境提示
Vue.config.productionTip = false
// 注册我们的请求模块
Vue.prototype.$req = req
Vue.prototype.$showt = showToast
Vue.prototype.$rd = rd
Vue.prototype.$formatDate = formatDate
Vue.prototype.$getUserData = getUserData
Vue.prototype.$uploadData = uploadData
App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
