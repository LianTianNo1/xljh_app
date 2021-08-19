/* tomato.js */


const state = {
	// 用来储存 番茄记录
	tomatoData: {},
	// 每一个番茄
	tomatoInfo: [],
}
const mutations = {
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
}

//导出
export default {
	state,
	mutations,
	namespaced: true,
}
