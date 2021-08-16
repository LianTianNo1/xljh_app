export {
	req,
	showToast
}

// 封装请求
function req(action, params) {
	uni.showLoading({
		title: '请求中'
	})
	return new Promise((resovle, reject) => {
		uniCloud.callFunction({
			name: 'langapi',
			data: {
				action,
				params
			},
			success: res => {
				uni.hideLoading();
				resovle(res.result)
			},
			fail: err => {
				uni.hideLoading();
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
