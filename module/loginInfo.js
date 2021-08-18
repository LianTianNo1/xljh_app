/* login.js */


const state = {
	user: {
	}
}
const mutations = {
	// 更新用户数据
	async updateUser(state, payload) {
		state.user = payload
		await uni.setStorageSync('user_info',state.user)
	},
	// 不缓存
	async updateUser2(state, payload) {
		state.user = payload
	}
}

//导出
export default {
	state,
	mutations,
	namespaced: true,
}
