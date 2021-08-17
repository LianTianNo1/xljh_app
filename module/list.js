/* list.js */
import {
	formatDate,
	req
} from '../utils/request.js'

const getters = {
	completed(state) {
		if (!state.todoList) return
		if (state.todoList.length < 1) return 0
		let tempArry = state.todoList.filter(item => {
			return item.isCompleted === true
		})
		return tempArry.length
	},
	nocompleted(state) {
		if (!state.todoList) return
		if (state.todoList.length < 1) return 0
		let tempArry = state.todoList.filter(item => {
			return item.isCompleted === false
		})
		return tempArry.length
	},
	totalcompleted(state) {
		return state.todoList.length
	},
}

const state = {
	todoList: [],
	// 用户数据
	userData: {},
	// 当前选择的时间
	chooseTime: formatDate(new Date()),
	// 上次的时间
	lastTime: null
}
const mutations = {
	// 更新Todo数据
	updateTime(state, payload) {
		state.lastTime = state.chooseTime
		state.chooseTime = payload
		// 两次不一样的时间
		if (state.lastTime !== state.chooseTime) {
			// 判断是否存在 UserData中
			let index = Object.keys(state.userData).findIndex(item => {
				return item === state.chooseTime
			})
			// 存在
			if (index !== -1) {
				// 从缓存中获取 TodoList
				let user = uni.getStorageSync('userData')
				state.todoList = user[state.chooseTime]
			} else {
				// 新的日期直接设置为空
				state.todoList = []
			}
			this.commit('list/updateUserDate', state.chooseTime)
			// console.log('改变的时间', state.chooseTime);
		}

	},
	// 设置 userData
	setUserData(state, payload) {
		state.userData = payload
	},
	// 用户数据
	async updateUserDate(state, payload) {
		// debugger;
		// 判断是否是当前的Todo
		let newTime = payload || state.chooseTime
		// console.log('当前选择的时间', newTime);
		if ((state.todoList.length > 0 || state.todoList.length == 0) && state.userData.size === 0 &&
			newTime === formatDate(new Date())) {
			// 存在直接修改替换哪一个信息 今天日期 用户信息
			state.userData[newTime] = state.todoList
			uni.setStorageSync('userData', state.userData)
			// console.log('第一次添加');
			// console.log(state.userData, uni.getStorageSync('userData'));
		}

		// 是否有缓存
		let user = await uni.getStorageSync('userData')

		if (user.size > 0) {
			// 把缓存中 userData 给到 vuex userData
			state.userData = user
		}
		// 缓存不存在直接使用 本地 userDate
		// index 用来判断是否存在这个日期的 信息
		let index = Object.keys(state.userData).findIndex(item => {
			return item === newTime
		})
		// 创建一个当前的时间 todo
		let todo
		// 存在当前日期的todoList
		if (index !== -1) {
			// console.log('存在当前日期');
			todo = state.todoList
		} else {
			// console.log('不存在当前日期', state.userData);

			todo = []
		}
		// 创建今天日期 用户信息
		// 存在直接修改替换哪一个信息
		state.userData[newTime] = todo
		state.todoList = todo
		// 保存数据
		uni.setStorageSync('userData', state.userData)
		// 如果登录了保存到云端
		let userInfo = uni.getStorageSync('user_info');
		if(userInfo){
			const res = await req('savaUserData', {
				userData: state.userData
			},true)
		}	
	},
	// 更新Todo数据
	updateTodoList(state, payload) {
		state.todoList = payload
		this.commit('list/updateUserDate')
	},
	// 修改 isCompleted
	updateIsCompleted(state, payload) {
		let index = payload[0]
		state.todoList[index].isCompleted = payload[1]
		this.commit('list/updateUserDate')
	},
	// 删除项目
	deleteItem(state, payload) {
		state.todoList.splice(payload, 1)
		this.commit('list/updateUserDate')
	},
	// 添加项目
	addItem(state, payload) {
		state.todoList.push(payload)
		this.commit('list/updateUserDate')
	}
}

//导出
export default {
	state,
	mutations,
	getters,
	namespaced: true,
}
