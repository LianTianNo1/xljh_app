'use strict';
const uniID = require('uni-id')
const uniCaptcha = require('uni-captcha')
const db = uniCloud.database();
// 获取 uni-id-users 集合的引用
const collection = db.collection('uni-id-users');

exports.main = async (event, context) => {
	// 返回结果
	let res = {}
	// 请求哪种url
	const action = event.action

	// 请求参数
	let params = event.params
	// 存放 user
	let user = {}

	// 这些请求不用验证 token 
	const ignoreArr = ['login', 'register', 'createCaptcha', 'refresh', 'getUserInfo']

	// uniCloud.logger.log(exitValue(action,ignoreArr))
	// 登录 和 注册 不用检查 token
	let payload = {}
	if (!exitValue(action, ignoreArr)) {
		// 检查token
		payload = await uniID.checkToken(event.uniIdToken)
		const {
			code,
			token,
			tokenExpired
		} = payload
		user.uid = payload.uid
		if (code) return payload //code 不为 0 代表token 未通过
	}
	// uniCloud.logger.log(payload.uid)


	switch (action) {
		// 设置昵称
		case 'setNickName': {
			res = await uniID.updateUser({
			    uid: user.uid,
			    nickname: params.nickname
			  })
			break;
		}
		// 保存数据
		case 'savaUserData2': {
			// uniCloud.logger.log(payload.uid,user.id,params.userData)
			res = await uniID.updateUser({
			    uid: payload.uid,
			    userData: params.userData
			  })
			break;
		}
		// 保存番茄数据
		case 'savatomatoData': {
			const { username,tomatoData } = params
			res = await collection.where({username}).update({tomatoData})
			if(res.affectedDocs===0){			
				res.code = 9999
				res.msg = '修改失败'
			}else {
				res.code = 0
				res.msg = '上传成功'
			}
			break;
		}
		// 保存数据
		case 'savaUserData': {
			const { username,userData } = params
			res = await collection.where({username}).update({userData})
			if(res.affectedDocs===0){			
				res.code = 9999
				res.msg = '修改失败'
			}else {
				res.code = 0
				res.msg = '上传成功'
			}
			// uniCloud.logger.log(res)
			break;
		}
		// 获取 TodoList 数据
		case 'getUserData': {
			// uniCloud.logger.log(params.username)
			res = await collection.where({username:params.username}).field('userData').get()
			break;
		}
		// 设置头像
		case 'setAvatar': {
			res = await uniID.setAvatar({
				uid: user.uid,
				avatar: params.avatar
			})
			break;
		}
		// 获取用户信息
		case 'getUser': {
			res = await uniID.getUserInfo({
				uid: user.uid			
			})
			break;
		}

		// 创建验证码
		case 'createCaptcha': {
			const {
				scene
			} = event.params;
			res = await uniCaptcha.create({
				scene,
				size: 5,
				expiresDate: 270,
				height: 50,
				width: 100,
				backgroundColor: rdColor()
			});
			break;
		}
		// 刷新验证码
		case 'refresh': {
			const {
				scene
			} = event.params;
			res = await uniCaptcha.refresh({
				scene,
				size: 5,
				expiresDate: 270,
				height: 50,
				width: 100,
				backgroundColor: rdColor()
			});
			break;
		}
		// 登出
		case 'logout': {
			uniCloud.logger.log("登出",event.uniIdToken)
			res = await uniID.logout(event.uniIdToken);
			break;
		}
		// 登录
		case 'login': {
			const {
				scene,
				code,
				username,
				password,
			} = params
			const result = await uniCaptcha.verify({
				scene,
				captcha: code
			})
			// 验证成功进行登录
			if (result.code === 0) {
				res = await uniID.login({
					username,
					password
				})
			} else {
				// 返回验证错误的信息
				return result
			}

			break;
		}
		// 注册
		case 'register': {
			const {
				scene,
				code,
				username,
				password
			} = params
			const result = await uniCaptcha.verify({
				scene,
				captcha: code
			})
			uniCloud.logger.log(result)
			// 验证成功进行登录
			if (result.code === 0) {
				res = await uniID.register({
					username,
					password
				})
			} else {
				// 返回验证错误的信息
				return result
			}

			break;
		}
	}

	return res

};
let colorList = ['#eb8a3c', '#59c8df', '#90a9c6', '#66a4ac', '#AEC5EB', '#57BE85', '#bac2c6']
// 是否存在数组中
function exitValue(ele, arr) {
	return arr.find(item => item === ele)
}

// 获取随机数
function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

// 获取随机颜色
function rdColor() {
	return colorList[random(0, colorList.length - 1)]
}
