<template>
	<view>
		<u-navbar :is-back='false' title="任务清单"></u-navbar>
		<u-toast ref="uToast" />
		<view>
			<u-modal :show-cancel-button="true" @confirm="addTodoList" title="添加任务" v-model="moShow">
				<view class="slot-content">
					<input
						:style="{'boxShadow': '0px 1px 1px 0px #CFD8DC','borderRadius':'50rpx','textAlign':'center','height': '90rpx','lineHeight':'1'}"
						type="text" v-model="title" />
				</view>
			</u-modal>
		</view>
		<view class="content">
			<!-- 日历 -->
			<view>
				<u-calendar v-model="show" @change="changeDate" :mode="mode"></u-calendar>
			</view>
			<view @click="openCalendar" class="calendar">
				<u-icon name="arrow-down-fill" color="#00BCD4" size="28"></u-icon>
				当前选择日期 {{ chooseTime }}
			</view>
			<view v-if="!todoList.length" class="no-task">
				<u-empty text="列表为空点击 '+' 添加一个吧" mode="list"></u-empty>
			</view>


			<!-- 未完成任务 -->
			<view v-if="nocompleted" class="todo-list">
				<view class="task">
					<u-icon name="pushpin" color="#f67504" size="28"></u-icon>
					未完成任务
				</view>
				<ul>
					<li v-if="!item.isCompleted" v-for="(item,index) in todoList" :key="index"
						:class="item.isCompleted? 'active':''">
						<text class="litext">{{item.title}}</text>
						<view class="operate">
							<u-switch @change="updateIsCompleted([index,!item.isCompleted])" active-color="#607D8B"
								size="40" :value="item.isCompleted">
							</u-switch>
							<u-icon @click="deleteItem(index)" name="trash-fill" color="#FF9800" size="48"></u-icon>
						</view>
					</li>
				</ul>
				<view class="statistics">
					<view> 总计任务： {{totalcompleted}}</view>
					<view>未完成： {{nocompleted}}</view>
				</view>
			</view>

			<!-- 完成任务 -->
			<view v-if="completed" class="todo-list">
				<view class="task">
					<u-icon name="pushpin-fill" color="#f67504" size="28"></u-icon>
					{{completed === totalcompleted? '太棒了！你已经完成所有任务':'已完成任务'}}
				</view>
				<ul>
					<li v-if="item.isCompleted" v-for="(item,index) in todoList" :key="index"
						:class="item.isCompleted? 'active':''">
						<text class="litext">{{item.title}}</text>
						<view class="operate">
							<u-switch @change="updateIsCompleted([index,!item.isCompleted])" active-color="#607D8B"
								size="40" :value="item.isCompleted">
							</u-switch>
							<u-icon @click="deleteItem(index)" name="trash-fill" color="#FF9800" size="48"></u-icon>
						</view>
					</li>
				</ul>
				<view class="statistics">
					<view> 总计任务： {{totalcompleted}}</view>
					<view> 已完成： {{completed}}</view>
				</view>
			</view>

		</view>
		<view class="add-item" @click="moShow=true">
			<u-icon name="plus" color="#79BEDB" size="38"></u-icon>
		</view>
		<u-tabbar @change="beforeSwitch" :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import {
		mapMutations,
		createNamespacedHelpers
	} from 'vuex'
	const {
		mapState: tabbarState,
		mapMutations: tabbarMutations
	} = createNamespacedHelpers('tabbar')
	const {
		mapState: listState,
		mapMutations: listMutations,
		mapGetters: listGetters
	} = createNamespacedHelpers('list')
	const {
		mapState: loginInfoState,
	} = createNamespacedHelpers('loginInfo')
	export default {
		name: 'todo',
		data() {
			return {
				show: false,
				mode: 'date',
				// 模态框
				moShow: false,
				// 任务标题
				title: '',
				noCompletedShow: true,
				CompletedShow: true
			}
		},
		computed: {
			...tabbarState(['tabbar', 'todoObj']),
			...loginInfoState(['user']),
			...listState(['todoList', 'userData', 'chooseTime']),
			...listGetters(['completed', 'nocompleted', 'totalcompleted'])
		},

		onLoad() {
			// 获取数据
			// vuex 用户信息为空 从缓存中获取信息
			if (JSON.stringify(this.userData) === "{}") {
				const _self = this;
				// 获取数据
				let userData = uni.getStorageSync('userData')
				if (userData) {
					// 从缓存中获取到 vuex
					_self.setUserData(userData)
					// 找出当天的 todolist 赋值
					let index = Object.keys(userData).findIndex(item => {
						return item === this.chooseTime
					})
					// 设置对应日期的 todolist
					if (index !== -1) {
						this.updateTodoList2(userData[this.chooseTime])
					}
				}
			}
		},
		mounted() {

		},
		async onPullDownRefresh() {},
		methods: {
			...mapMutations(['setChar']),
			...tabbarMutations(['setTodoObj']),
			...listMutations(['setUserData', 'updateTime', 'updateTodoList', 'updateIsCompleted', 'deleteItem',
				'addItem', 'updateTodoList2'
			]),
			// 切换 tabBar 调用
			beforeSwitch() {
				/* // 更新图表
				this.setChar() */
			},
			// 监听改变日期
			changeDate(e) {
				this.updateTime(e.result)
			},
			// 开启日历
			openCalendar() {
				this.show = true
			},
			// 添加item
			addTodoList() {
				// 获取一个不重复的 id
				if (!this.title.trim()) return this.$showt('error', '任务不能为空')
				let id = this.$rd(0, 100000)
				while (this.todoList.findIndex(item => {
						id === item.id
					}) !== -1) {
					id = this.$rd(0, 100000)
				}
				// 组装好新的 item
				const item = {
					id,
					title: this.title,
					isCompleted: false
				}
				// 调用 vuex 中添加
				this.addItem(item)
				// 清空 title
				this.title = ''
			},

		},

	}
</script>

<style lang="scss">
	page {
		height: 100vh;
		background-color: #ededed;

		.add-item {
			position: fixed;
			right: 20rpx;
			bottom: 40%;
			border-radius: 50%;
			width: 100rpx;
			height: 100rpx;
			background-color: #F8F9FC;
			box-shadow: 1px 1px 1px 1px #D0DFE6, -1px -1px 1px 1px #FAFAFA;

			display: flex;
			justify-content: center;
			align-items: center;
		}

		.content {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;

			.no-task {
				width: 90vw;
				height: 50vh;
				margin: 10rpx 10rpx 0;
				// font-weight: bold;
				color: #26C6DA;
				font-size: 40rpx;
				line-height: 1.5;
				// letter-spacing: 10rpx;
				// text-shadow: 2rpx 2rpx 0rpx #B0BEC5, -2rpx -2rpx 2rpx #FAFAFA;
				background-color: rgb(250, 250, 250);
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 20rpx;
				box-shadow: 0 2px 2px 2px #E8EAF6;
			}

			.calendar {
				padding: 20rpx;
				width: 90vw;
				border-radius: 20rpx;
				margin: 20rpx 0;
				background-color: #FAFAFA;
				box-shadow: 0 2px 2px 2px #E8EAF6;
				text-align: center;
				line-height: 1;
			}


			.todo-list {
				padding: 20rpx;
				width: 90vw;
				border-radius: 20rpx;
				margin: 10rpx 0;
				background-color: #FAFAFA;
				box-shadow: 0 2px 2px 2px #E8EAF6;

				.task {

					box-sizing: border-box;
					padding: 20rpx;
					width: 95%;
					border-radius: 20rpx;
					margin: 20rpx auto;
					background-color: #FAFAFA;
					box-shadow: 0 2px 2px 2px #E8EAF6;
				}

				.statistics {
					display: flex;
					flex-wrap: nowrap;
					justify-content: space-between;
					align-items: center;
				}

				ul {
					padding: 20rpx;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;

					li {
						width: 90vw;
						color: #3F51B5;
						box-sizing: border-box;
						list-style: none;
						display: flex;
						justify-content: space-between;
						flex-wrap: wrap;
						margin: 20rpx 0;
						padding: 20rpx 40rpx;
						border: 1px solid #ccc;
						border-top: none;
						border-radius: 45rpx 45rpx 0 45rpx;
						letter-spacing: 10rpx;
						box-shadow: 0 2px 2px 2px #E8EAF6;

						.operate {
							width: 200rpx;
							display: flex;
							justify-content: space-between;
							flex-wrap: wrap;
						}
					}

					li.active {
						background-color: #455A64;
						color: #80DEEA;
						border-radius: 0 45rpx 45rpx 45rpx;

						.litext {
							text-decoration: line-through;
						}

					}
				}
			}


		}
	}
</style>
