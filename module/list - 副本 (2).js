/* list.js */
import {
	formatDate
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
	todoList: [{
			id: 1,
			title: '吃饭',
			isCompleted: true
		},
		{
			id: 2,
			title: '睡觉',
			isCompleted: false
		},
		{
			id: 3,
			title: '玩',
			isCompleted: true
		},
		{
			id: 4,
			title: '代码',
			isCompleted: true
		},
	],
	// 用户数据
	userData: [],
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
		if(state.lastTime!==state.chooseTime){
			
			
			state.todoList = []
		}
		this.commit('list/updateUserDate', state.chooseTime)
		console.log('改变的时间', state.chooseTime);
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
		console.log('当前选择的时间', newTime);
		if ((state.todoList.length > 0 || state.todoList.length == 0) && state.userData.length === 0 &&
			newTime === formatDate(new Date())) {
			// 创建今天日期 用户信息
			let userInfo = {
				id: 0,
				date: newTime,
				todo:state.todoList,
			}
			// 存在直接修改替换哪一个信息
			state.userData[0] = userInfo
			uni.setStorageSync('userData', state.userData)
			console.log('第一次添加');
			console.log(state.userData,uni.getStorageSync('userData'));
		}

		// 是否有缓存
		let user = await uni.getStorageSync('userData')

		if (user.length > 0) {
			// 把缓存中 userData 给到 vuex userData
			state.userData = user
		}
		// 缓存不存在直接使用 本地 userDate
		// index 用来判断是否存在这个日期的 信息
		let index = state.userData.findIndex(item => {
			return item.date === newTime
		})

		// console.log(index, user);
		// 存在当前日期的todoList
		if (index !== -1) {
			console.log('存在当前日期');
			// 创建一个当前的时间 todo
			let todo;
			// 判断是否是当前的时间
			console.log(newTime,formatDate(new Date()));
			if (newTime === formatDate(new Date())) {
				console.log('是今天',state.userData);
				// 当前日期就todo 直接去 本地 TodoList 去拿过来
				todo = state.todoList
			} else {
				console.log('不是今天',state.userData);
				// 判断 user 有无
				todo = user[index].todo
			}

			// 创建今天日期 用户信息
			let userInfo = {
				id: index,
				date: newTime,
				todo,
			}
			// 存在直接修改替换哪一个信息
			state.userData[index] = userInfo
			state.todoList = todo
		} else {
			// 不存在这个日期的用户信息 创建一个当前的时间 todo,id+1
			// TodoList = []
			let todo = []
			let userInfo = {
				// 重新计算 id
				id: state.userData.length,
				date: newTime,
				todo,
			}
			state.todoList = todo
			// 不存在直接追加
			state.userData.push(userInfo)
			console.log('不存在当前日期',state.userData);
		}
		// 保存数据
		uni.setStorageSync('userData', state.userData)
	},
	// 更新Todo数据
	updateTodoList(state, payload) {
		state.todoList = payload
		// uni.setStorageSync('todoList', state.todoList)
		this.commit('list/updateUserDate')
	},
	// 修改 isCompleted
	updateIsCompleted(state, payload) {
		let index = payload[0]
		state.todoList[index].isCompleted = payload[1]
		// uni.setStorageSync('todoList', state.todoList)
		this.commit('list/updateUserDate')
	},
	// 删除项目
	deleteItem(state, payload) {
		state.todoList.splice(payload, 1)
		// uni.setStorageSync('todoList', state.todoList)
		this.commit('list/updateUserDate')
	},
	// 添加项目
	addItem(state, payload) {
		state.todoList.push(payload)
		// uni.setStorageSync('todoList', state.todoList)
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
