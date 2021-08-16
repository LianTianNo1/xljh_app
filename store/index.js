// 导入 Vue
import Vue from 'vue'
// 导入 Vuex 插件
import Vuex from 'vuex'
// 引入 tabbar login
import tabbar from '../module/tabbar.js'
import loginInfo from '../module/loginInfo.js'

// 把 Vuex 注册到Vue 上
Vue.use(Vuex)


export default new Vuex.Store({
	// 状态
	state: {
		nickname: '尚未设置昵称',
		username: '请登录',		
	},
	// 用来处理状态
	mutations: {},
	// 用于异步处理
	actions: {},
	// 用来挂载模块
	modules: {
		tabbar,
		loginInfo
	}
})
