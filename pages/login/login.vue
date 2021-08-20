<template>
	<view class="content">
		<u-navbar back-text="返回" title="登录/注册"></u-navbar>
		<!-- Toast -->
		<u-toast ref="uToast" />
		<!-- 表单 -->
		<u-form :model="form" class="form" ref="uForm">
			<u-form-item label-width="150rpx" class="input-item" left-icon="account" label="账号" prop='username'
				label-position="left">
				<u-input :maxlength="20" class="input" v-model="form.username" placeholder="账号" type="text"
					:custom-style="inputStyle" />
			</u-form-item>
			<u-form-item label-width="150rpx" class="input-item" left-icon="lock" label="密码" prop='password'
				label-position="left">
				<u-input :maxlength="20" class="input" v-model="form.password" placeholder="密码" type="password"
					:custom-style="inputStyle" />
			</u-form-item>
			<u-form-item label-width="150rpx" class="input-item" left-icon="more-circle" label="验证码"
				label-position="left" prop='code'>
				<u-input class="input" v-model="form.code" placeholder="验证码" type="text" :custom-style="inputStyle" />
			</u-form-item>
			<u-image class="code-img" @click="refresh()" :src="form.codeImg" width="100%" height="300rpx"></u-image>
			<!-- <image class="code-img" @click="refresh()" :src="form.codeImg" mode="widthFix"></image> -->
		</u-form>
		<!-- 按钮区域 -->
		<view class="footer-btn">
			<u-button class="button" :ripple="true" ripple-bg-color="#FFFFFF" type="primary" @click="login()"
				shape="square" size="default">登录
			</u-button>
			<u-button class="button" :ripple="true" ripple-bg-color="#FFFFFF" type="warning" @click="register()"
				shape="square" size="default">注册
			</u-button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		createNamespacedHelpers
	} from 'vuex'
	const {
		mapState: loginState,
		mapMutations: loginMutations,
	} = createNamespacedHelpers('loginInfo')
	const {
		mapState: listState,
		mapMutations: listMutations,
		mapGetters: listGetters
	} = createNamespacedHelpers('list')
	export default {
		computed: {
			...loginState(['user']),
			...listState(['todoList', 'userDate', 'chooseTime']),
		},
		data() {
			return {
				// 表单信息
				form: {
					username: '浪亓',
					password: '123456',
					code: '',
					codeImg: ''
				},
				// 输入框样式
				inputStyle: {
					'color': '#03A9F4',
					// 'borderBottom': '1px solid #03A9F4',
					'paddingLeft': '25rpx',
					'letterSpacing': '10px',
					'boxShadow': '0px 5px 10px 1px #CFD8DC',
					'borderRadius': '20rpx'
				},
				// 验证码场景
				scene: 'login',
				// 验证规则
				rules: {
					username: [{
						required: true,
						message: '请输入账号',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					password: [{
						required: true,
						min: 6,
						message: '密码不能少于5个字',
						trigger: ['change', 'blur'],
					}],
					code: [{
						required: true,
						message: '请输入验证码',
						trigger: ['change', 'blur'],
					}]
				}


			}
		},
		onReady() {
			// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad() {
			// 获取验证码
			this.createCaptcha()
		},
		methods: {
			...listMutations(['setUserData', 'updateTodoList2', 'setChooseTime']),
			...mapMutations(['setTomatoData', 'setTomatoInfo', 'setChar']),
			...loginMutations(['updateUser']),

			// 刷新验证码
			async refresh(scene) {
				const res = await this.$req('refresh', {
					scene: scene ? scene : this.scene
				})
				// 刷新验证码成功
				if (res.code !== 0) return this.$showt('error', res.msg)
				this.$showt('success', res.msg)
				this.form.codeImg = res.captchaBase64
				console.log(res);
			},
			// 创建验证码
			async createCaptcha(scene) {
				const res = await this.$req('createCaptcha', {
					scene: scene ? scene : this.scene
				})
				// 获取验证码成功
				if (res.code !== 0) return this.$showt('error', res.msg)
				this.$showt('success', res.msg)
				this.form.codeImg = res.captchaBase64
				// console.log(res);
			},
			// 获取用户信息
			async getUser(VueComponent) {
				const res = await this.$req('getUser')
				// console.log('用户信息', res);
				if (res.code !== 0) return console.log('获取用户数据失败');
				console.log('获取用户数据成功');
				// 保存用户信息
				this.updateUser(res.userInfo)
				await uni.setStorageSync('user_info', res.userInfo)
				// 获取列表数据
				let userData = res.userInfo.userData
				let tomatoData = res.userInfo.tomatoData
				// console.log('我是 userData',userData);
				if (tomatoData === '' || tomatoData === undefined || tomatoData === null) {
					console.log('居然为空。。。不是吧');
					tomatoData = {}
				}


				if (userData === '' || userData === undefined || userData === null) {
					console.log('居然为空。。。不是吧');
					userData = {}
				}


				// 更新到 vuex
				this.setUserData(userData);
				this.setTomatoData(tomatoData)
				// 获取数据
				let tempInfo = tomatoData[this.$formatDate(new Date())]
				if (!Array.isArray(tempInfo) || !tempInfo || tempInfo === undefined || tempInfo === null || tempInfo === '') {
					this.setTomatoInfo([])
				} else {
					this.setTomatoInfo(tempInfo)
					
				}
				// 更新图表
				this.setChar()
				uni.setStorageSync('userData', userData)
				uni.setStorageSync('tomatoData', tomatoData)
				this.setChooseTime(this.$formatDate(new Date()))
				let index = Object.keys(userData).findIndex(item => {
					return item === this.chooseTime
				})
				// 设置对应日期的 todolist
				if (index !== -1) {
					this.updateTodoList2(userData[this.chooseTime])
				}
			},
			// 登录
			async login() {
				if (!this.form.username || !this.form.password) {
					return this.$showt('error', '请不要输入空信息')
				}
				const res = await this.$req('login', {
					username: this.form.username,
					password: this.form.password,
					scene: 'login',
					code: this.form.code
				})
				// 是否登录成功
				if (res.code !== 0) {
					// 刷新验证码
					this.refresh('login')
					return this.$showt('error', res.msg)
				}
				this.$showt('success', res.msg)
				// 保存token
				uni.setStorageSync('uni_id_token', res.token)
				uni.setStorageSync('uni_id_token_expired', res.tokenExpired)
				// 返回个人中心
				uni.navigateBack({
					success: (res) => {
						// 删除之前的记录
						uni.removeStorageSync('userData')
						this.getUser(this)

					}
				})

				// console.log(res);
			},
			// 注册
			async register() {
				if (!this.form.username || !this.form.password) {
					return this.$showt('error', '请不要输入空信息')
				}
				const res = await this.$req('register', {
					username: this.form.username,
					password: this.form.password,
					scene: 'login',
					code: this.form.code
				})
				// 是否注册成功
				if (res.code !== 0) {
					// 刷新验证码
					this.refresh('login')
					return this.$showt('error', res.msg)
				}
				this.$showt('success', res.msg)
				// console.log(res)
			}

		}
	}
</script>

<style lang="scss">
	page {
		height: 100vh;
		background-color: #f9f8fd;

		.content {
			height: 100%;

			.form {
				margin: 20rpx 20rpx;
				border-radius: 40rpx;
				padding: 40rpx 0;
				background: #FFFFFF;
				box-shadow: 0px 1px 10px 4px #EAEAEA;
			}

			.input-item {
				border-radius: 20rpx;
				padding: 20rpx 30rpx;
				margin: 20rpx 0;
			}

			.input {
				outline: none;
				// width: 50rpx !important;
				color: rgb(255, 153, 0) !important;
				margin: 0rpx 0 !important;
				letter-spacing: 6rpx;
			}

			.code-img {
				box-sizing: border-box;
				margin: 30rpx 0rpx 0rpx;
				border-radius: 35rpx;
			}

			.footer-btn {
				padding: 40rpx;
				width: 95%;
				border-radius: 40rpx;
				position: absolute;
				left: 50%;
				transform: translate(-50%, 0);
				bottom: 2%;
				height: 22vh;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: center;

				background: #FFFFFF;
				box-shadow: 0px 1px 10px 4px #EAEAEA, -0px -1px 10px 4px #EAEAEA;

				.button {
					width: 250rpx;
					height: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 8px;

					box-shadow: 0px 2px 5px 1px #CFD8DC;
				}
			}

		}

	}
</style>
