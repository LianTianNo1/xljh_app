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
	}
}

//导出
export default {
	state,
	mutations,
	namespaced: true,
}
