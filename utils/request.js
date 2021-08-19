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
function showToast(type, title, ele, url) {
	let ref = ele || this.$refs.uToast
	ref.show({
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

let uploadData = async (ele) => {
	let userData = uni.getStorageSync('userData')
	let userInfo = uni.getStorageSync('user_info');
	let tomatoData = uni.getStorageSync('tomatoData');
	// console.log(userData,tomatoData);
	if (JSON.stringify(userData) === '{}' || userData === '' || userData === undefined || userData === null) {
		uni.setStorageSync('userData', {})
		return showToast('error', '当前没有TodoList数据需要进行上传', ele)
	}
	if (JSON.stringify(tomatoData) === '{}' || tomatoData === '' || tomatoData === undefined || tomatoData === null) {
		uni.setStorageSync('tomatoData', {})
	}
	// 判断上传的数据是否为 对象类型
	if(!(Object.prototype.toString.call(userData)==="[object Object]")) return showToast('error', '上传的清单数据格式出现问题', ele)
	if(!(Object.prototype.toString.call(tomatoData)==="[object Object]")) return showToast('error', '上传的番茄数据格式出现问题', ele)
	if (userInfo) {
		// 主要得上传 todoList
		let res2 = await req('savaUserData', {
			username: userInfo.username,
			userData
		}, true)
		if (res2.code !== 0){
			if(res2.msg==='修改失败')return showToast('error', '清单数据无变化，所以就不上传了', ele)
			return showToast('error', res2.msg, ele)
		} 
		showToast('success', res2.msg, ele)
		// 番茄时间可有可无
		let res3 = await req('savatomatoData', {
			username: userInfo.username,
			tomatoData
		}, true)		
	} else {
		showToast('error', '尚未登录不能进行上传', ele)
	}
}

// 获取数据
let getUserData = async (vueCom) => {
	return `该方法废弃`
}

export {
	req,
	showToast,
	rd,
	formatDate,
	getUserData,
	uploadData
}
