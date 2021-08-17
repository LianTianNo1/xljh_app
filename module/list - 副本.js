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
			title: '下面',
			isCompleted: false
		},
		{
			id: 3,
			title: '吃饭',
			isCompleted: true
		},
		{
			id: 4,
			title: '吃饭',
			isCompleted: true
		},
	],
	// 用户数据
	userDate: [],
	// 当前选择的时间
	chooseTime: ''
}
const mutations = {
	// 更新Todo数据
	updateTime(state, payload) {
		state.chooseTime = payload
		this.commit('list/updateUserDate', state.chooseTime)
		console.log('改变的时间', state.chooseTime);
	},
	// 用户数据
	async updateUserDate(state, payload) {
		// debugger;
		// 判断是否是当前的Todo
		let newTime = payload || formatDate(new Date())
		// 是否有缓存
		let user;
		if (!state.userDate.length) {
			console.log('本地 userDate 为空');
			user = await uni.getStorageSync('userDate')
		}
		user = state.userDate
		// 没有默认重0开始
		let index = 0;
		if (user) {
			state.userDate = user
			console.log(user, state.userDate);
			index = state.userDate.findIndex(item => {
				return item.date === newTime
			})
		}

		console.log(index, user);
		if (index !== -1) {
			// 创建一个当前的时间 todo
			let todo;
			// console.log(state.todoList, user[index].todoList);
			// todo = (state.todoList.length > 0) ? state.todoList : user[index].todoList
			let userInfo = {
				id: user ? user[index].id : 0,
				date: newTime,
				todo:state.todoList,
			}
			// 存在
			state.userDate[index] = userInfo
			state.todoList = todo
		} else {
			// 创建一个当前的时间 todo,id+1
			let userInfo = {
				// 重新计算 id
				id: state.userDate.length,
				date: newTime,
				todo: [],
			}
			state.todoList = []
			uni.setStorageSync('todoList', state.todoList)
			state.userDate.push(userInfo)
		}
		// 保存数据
		uni.setStorageSync('userDate', state.userDate)
	},
	// 更新Todo数据
	updateTodoList(state, payload) {
		state.todoList = payload
		uni.setStorageSync('todoList', state.todoList)
		this.commit('list/updateUserDate')
	},
	// 修改 isCompleted
	updateIsCompleted(state, payload) {
		let index = payload[0]
		state.todoList[index].isCompleted = payload[1]
		uni.setStorageSync('todoList', state.todoList)
		this.commit('list/updateUserDate')
	},
	// 删除项目
	deleteItem(state, payload) {
		state.todoList.splice(payload, 1)
		uni.setStorageSync('todoList', state.todoList)
		this.commit('list/updateUserDate')
	},
	// 添加项目
	addItem(state, payload) {
		state.todoList.push(payload)
		uni.setStorageSync('todoList', state.todoList)
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
