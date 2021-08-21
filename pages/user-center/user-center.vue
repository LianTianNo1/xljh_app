<template>
	<view>
		<u-navbar :is-back='false' title="个人中心"></u-navbar>
		<u-toast ref="uToast" />
		<view  class="headPart u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10">
				<u-avatar :src="user.avatar?user.avatar:pic" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{user.nickname?user.nickname:'暂未设置昵称'}}</view>
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
			<u-modal content="退出将清空本地数据,请确认已经上传" :show-cancel-button="true" @confirm="confirmLogout" title="确认退出"
				v-model="logoutShow">
			</u-modal>
		</view>


		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item :arrow="false" @click="getInfo" icon="man-add" title="登录/注册"></u-cell-item>
				<u-cell-item :arrow="false" @click="uploadUserData" icon="hourglass-half-fill" title="上传数据">
				</u-cell-item>
				<u-cell-item :arrow="false" @click="openModal" icon="edit-pen" title="修改昵称"></u-cell-item>
				<u-cell-item :arrow="false" @tap="chooseAvatar" icon="edit-pen" title="修改头像"></u-cell-item>
				<u-cell-item :arrow="false" @click="checkUpdate" icon="download" title="检查更新"></u-cell-item>
				<u-cell-item :arrow="false" @click="logoutShow = true" icon="error-circle" title="退出账号"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item @click="jumpAbout" icon="info-circle" title="关于"></u-cell-item>
			</u-cell-group>
		</view>
		<u-tabbar @change="beforeSwitch()" :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>



<script>
	import upAPP from '../../uni_modules/uni-upgrade-center-app/utils/check-update.js'
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
		mounted() {


		},
		created() {
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', async path => {
				let bakcValue = await this.getInfo()
				if (bakcValue !== 'success') return this.$showt('error', '错误')
				let filePath = path
				//进行上传操作
				uniCloud.uploadFile({
					filePath: filePath,
					cloudPath: 'b.jpg',
					success: async (res2) => {
						const res3 = await this.$req('setAvatar', {
							avatar: res2.fileID
						})
						if (res3.code !== 0) return this.$showt('error',res3.msg,this.$refs.uToast)
						this.$showt('success', res3.msg,this.$refs.uToast)
						// 更新数据到本地
						this.getUser()
					},
					fail: (err) => {
						return this.$showt('error', "上传图片出错")
					}
				})
				

			})
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
			...mapMutations(['setChar', 'updateTomatoData', 'updateTomatoInfo', 'setTomatoData', 'setTomatoInfo']),
			...loginMutations(['updateUser', 'updateUser2']),
			...listMutations(['setUserData', 'clearList']),
			// 选择头像
			chooseAvatar() {
				this.$u.route({
					// 关于此路径，请见下方"注意事项"
					url: 'node_modules/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 300,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 200,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg',
					}
				})
			},
			// 打开模态框
			openModal() {
				this.modalShow = true
			},
			// 上传用户数据
			uploadUserData() {
				this.$uploadData(this.$refs.uToast)
			},
			// 检查更新
			async checkUpdate() {
				const {
					result
				} = await upAPP()
				if (result.code === -101) return this.$showt('error', result.message)
				this.$showt('success', result.message)
			},
			// 切换 tabBar 调用
			beforeSwitch() {
				/* // 更新图表
				this.setChar() */
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
				let bakcValue = await this.getInfo()
				if (bakcValue !== 'success') return
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
			// 跳转关于页面
			jumpAbout() {
				uni.navigateTo({
					url: '/pages/about/about'
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
						url: '/pages/login/login'
					})
				} else {
					this.$showt('success', '当前已经登录')
					return 'success'
				}
			},
			// 确认退出
			confirmLogout() {
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
				this.setChar()

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
