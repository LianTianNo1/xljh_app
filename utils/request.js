// 封装请求
function req(action, params, flag) {
	if (!flag) {
		uni.showLoading({
			title: 'Loading...'
		})
	}

	return new Promise((resovle, reject) => {
		uniCloud.callFunction({
			name: 'langapi',
			data: {
				action,
				params
			},
			success: res => {
				if (!flag) {
					uni.hideLoading();
				}
				resovle(res.result)
			},
			fail: err => {
				if (!flag) {
					uni.hideLoading();
				}
				reject(err)
			}
		})
	})
}

// 显示 Toast
function showToast(type, title, url) {
	this.$refs.uToast.show({
		type,
		title,
		url: url ? url : '',
		position: 'top'
	})
}

// 随机数
function rd(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

// 格式化时间
function formatDate(date) {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	return y + '-' + m + '-' + d;
}

// 获取数据
let getUserData = async (vueCom) => {
	// 获取缓存中的数据
	let userData = await uni.getStorageSync('userData')
	// 缓存中的数据不为空
	if (userData) {
		// 更新到 vuex
		vueCom.setUserData(userData);
		let index = Object.keys(userData).findIndex(item => {
			return item === vueCom.chooseTime
		})
		// 设置对应日期的 todolist
		if (index !== -1) {
			vueCom.updateTodoList(userData[vueCom.chooseTime])
		}
	} else {
		// 本地没有缓存从云端获取
		const res = await vueCom.$req('getUser')
		if (res.code !== 0) {
			let userInfo = await uni.getStorageSync('user_info')
			if (userInfo) {
				await uni.removeStorageSync('user_info')
				await uni.removeStorageSync('uni_id_token')
				await uni.removeStorageSync('uni_id_token_expired')
			}
			return vueCom.$showt('error', res.msg)
		}
		let userData = res.userInfo.userData
		if(userData===''||typeof userData!== 'object'){
			userData = {}
		}
		// 更新到 vuex
		vueCom.setUserData(userData);
		let index = Object.keys(userData).findIndex(item => {
			return item === vueCom.chooseTime
		})
		// 设置对应日期的 todolist
		if (index !== -1) {
			vueCom.updateTodoList(userData[vueCom.chooseTime])
		}
	}
}

export {
	req,
	showToast,
	rd,
	formatDate,
	getUserData
}
