<template>
	<view>
		<u-navbar :is-back='false' title="任务清单"></u-navbar>
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
				选择日期
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
		<u-tabbar :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import {
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
			...tabbarState(['tabbar']),
			...listState(['todoList']),
			...listGetters(['completed', 'nocompleted', 'totalcompleted'])
		},
		methods: {
			...listMutations(['updateTime','updateTodoList', 'updateIsCompleted', 'deleteItem', 'addItem']),
			// test
			test() {
				console.log(111111);
			},
			// 改变日期
			changeDate(e) {
				this.updateTime(e.result)
				// console.log(e);
			},
			// 开启日历
			openCalendar() {
				this.show = true
			},
			// 添加item
			addTodoList() {
				// 获取一个不重复的 id
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
			},
			
		},
		onLoad() {
			let dateStr = this.$formatDate(new Date())
			console.log(dateStr);
			const _self = this;
			// 获取数据
			(async function() {
				let todoList = await uni.getStorageSync('todoList')
				if (todoList) {
					_self.updateTodoList(todoList)
				}
			})()
		}
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
			box-shadow: 1px 1px 1px 1px #D0DFE6;

			display: flex;
			justify-content: center;
			align-items: center;
		}

		.content {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;

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
