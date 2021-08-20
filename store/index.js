// 导入 Vue
import Vue from 'vue'
// 导入 Vuex 插件
import Vuex from 'vuex'
// 引入 tabbar login
import tabbar from '../module/tabbar.js'
import loginInfo from '../module/loginInfo.js'
import list from '../module/list.js'

// 把 Vuex 注册到Vue 上
Vue.use(Vuex)


export default new Vuex.Store({
	// 状态
	state: {
		nickname: '尚未设置昵称',
		username: '请登录',
		// 用来储存 番茄记录
		tomatoData: {},
		// 每一个番茄
		tomatoInfo: [],
		// 图表数据
		chartData: {
			categories: [],
			series: [{
				data: []
			}]
		},
	},
	// 用来处理状态
	mutations: {
		// 设置图表
		setChar(state) {
			state.chartData.series[0].data = [...state.tomatoInfo]
			console.log('触发了', state.chartData.series[0].data);
		},
		// 设置图表数据
		setChartData(state, payload) {
			state.chartData.series[0].data = payload
		},
		// 更新番茄记录
		updateTomatoData(state, payload) {
			state.tomatoData[payload[0]] = payload[1]
		},
		// 更新番茄
		updateTomatoInfo(state, payload) {
			state.tomatoInfo.push(payload)
		},
		// 设置番茄记录
		setTomatoData(state, payload) {
			state.tomatoData = payload
		},
		// 设置番茄
		setTomatoInfo(state, payload) {
			state.tomatoInfo = payload
		},
	},
	// 用于异步处理
	actions: {},
	// 用来挂载模块
	modules: {
		tabbar,
		loginInfo,
		list
	}
})
