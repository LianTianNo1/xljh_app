<template>
	<view>
		<u-navbar :is-back='false' title="个人中心"></u-navbar>
		<u-toast ref="uToast" />
		<view @click="getInfo" class="headPart u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10">
				<u-avatar @click="setAvatar" :src="user.avatar?user.avatar:pic" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view @click="openModal" class="u-font-18 u-p-b-20">{{user.nickname?user.nickname:'暂未设置昵称'}}</view>
				<view class="u-font-14 u-tips-color">账号:{{user.username?user.username:'未登录'}}</view>
			</view>
		</view>
		<view>
			<u-modal :show-cancel-button="true" @confirm="updateNickName" title="修改昵称" v-model="modalShow">
				<view class="slot-content">
					<input
						:style="{'boxShadow': '0px 1px 1px 0px #CFD8DC','borderRadius':'50rpx','textAlign':'center','height': '90rpx','lineHeight':'1'}"
						class="update-nick" type="text" v-model="nickname" />
				</view>
			</u-modal>
		</view>
		<view>
			<u-modal content="退出将清空本地数据,请确认已经上传"  :show-cancel-button="true" @confirm="confirmLogout" title="确认退出" v-model="logoutShow">
			</u-modal>
		</view>


		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item @click="uploadUserData" icon="info" title="上传数据"></u-cell-item>
				<u-cell-item icon="photo" title="相册"></u-cell-item>
				<u-cell-item icon="setting" title="设置"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="error-circle" @click="logoutShow = true	" title="退出账号"></u-cell-item>
			</u-cell-group>
		</view>
		<u-tabbar @change="beforeSwitch()" :list="tabbar" :mid-button="true"></u-tabbar>
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
		mapState: tabbarState,
		mapMutations: tabbarMutations
	} = createNamespacedHelpers('tabbar')
	const {
		mapState: listState,
		mapMutations: listMutations,
		mapGetters: listGetters
	} = createNamespacedHelpers('list')
	export default {
		data() {
			return {
				// 头像
				pic: 'https://gitee.com/lang-tian/image_upload/raw/master/img/image-20210819134152332.png',
				show: false,
				// 模态框
				modalShow: false,
				// 退出模态框
				logoutShow: false,
				// 昵称
				nickname: ''
			}
		},
		onLoad() {
			// vuex 用户信息为空 从缓存中获取信息
			if (JSON.stringify(this.user) === "{}") {
				const _self = this;
				// 获取数据
				let userInfo = uni.getStorageSync('user_info')
				if (userInfo) {
					_self.updateUser(userInfo)
				}
			}

		},
		computed: {
			...loginState(['user']),
			...tabbarState(['tabbar', 'todoObj']),
		},

		methods: {
			...mapMutations(['updateTomatoData', 'updateTomatoInfo', 'setTomatoData', 'setTomatoInfo']),
			...loginMutations(['updateUser','updateUser2']),
			...listMutations(['setUserData','clearList']),
			// 打开模态框
			openModal() {
				this.moShow = true
			},
			// 上传用户数据
			uploadUserData() {
				this.$uploadData(this.$refs.uToast)
			},
			// 切换 tabBar 调用
			beforeSwitch() {
			},
			// 获取用户信息
			async getUser() {
				const res = await this.$req('getUser')
				if (res.code !== 0) return this.$showt('error', res.msg)
				this.updateUser(res.userInfo)
				// console.log(res);
			},
			// 设置昵称
			async updateNickName() {
				if (!this.nickname.trim()) return this.$showt('error', '昵称不能为空')
				if (this.nickname === this.user.nickname) return this.$showt('error', '昵称似乎毫无改变')
				const res = await this.$req('setNickName', {
					nickname: this.nickname
				})
				if (res.code !== 0) return this.$showt('error', res.msg)
				this.$showt('success', res.msg);
				this.getUser();
				// 设置昵称 为 ''
				this.nickname = '';
			},
			// 设置头像
			async setAvatar() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						console.log(res);
						if (res.tempFilePaths.length > 0) {
							let filePath = res.tempFilePaths[0]
							//进行上传操作
							const tempFiles = res.tempFiles[0]
							const absUrl = tempFiles.path + '/' + tempFiles.name
							console.log(absUrl);
							uniCloud.uploadFile({
								filePath: filePath,
								cloudPath: 'b.jpg',
								success: async (res2) => {
									console.log(res2);
									const res3 = await this.$req('setAvatar', {
										avatar: res2.fileID
									})
									if (res3.code !== 0) return this.$showt('error', res3.msg)
									this.$showt('success', res3.msg)
									// 更新数据到本地
									this.getUser()
									console.log(res3);
								},
								fail: (err) => {
									console.log(err);
									return this.$showt('error', "上传图片出错")
								}
							})

						}
					}
				})
			},
			// 点击信息详情
			async getInfo() {
				// 判断是否登录
				// 判断本地是否存在 token
				if (!(uni.getStorageSync('uni_id_token') && uni.getStorageSync('uni_id_token_expired'))) {
					this.$showt('error', '尚未登录')
					// 执行登出操作
					await this.logout()
					// 跳转到登录注册页面
					return uni.navigateTo({
						url: '/pages/user-center/login/login'
					})
				}
			},
			// 确认退出
			confirmLogout(){
				// 退出
				this.logout()
			},
			// 登出
			async logout() {
				
				const res = await this.$req('logout')
				// console.log(res);
				// 登出成功
				if (res.code !== 0) {
					let userInfo = await uni.getStorageSync('user_info')
					if (userInfo) {
						await uni.removeStorageSync('user_info')
						await uni.removeStorageSync('uni_id_token')
						await uni.removeStorageSync('uni_id_token_expired')
					}
					return this.$showt('error', res.msg)
				}
				this.$showt('success', res.msg)
				// 删除 token
				uni.removeStorageSync('uni_id_token')
				uni.removeStorageSync('uni_id_token_expired')
				uni.removeStorageSync('user_info')
				uni.removeStorageSync('userData')
				uni.removeStorageSync('tomatoData')
				// 清空列表
				this.updateUser2({})
				this.setUserData({})
				this.clearList()
				this.setTomatoData({})
				this.setTomatoInfo([])
			}

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ededed;

		.headPart {
			padding: 40rpx 0 0;
		}

		.update-nick {
			letter-spacing: 10rpx;
			margin: 40rpx 0;
			text-align: center;
		}
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}
</style>
