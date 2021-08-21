<template>
	<view class="tomato-wrap u-m-t-25" ref="tomatoWrap">
		<u-toast ref="uToast" />
		<view v-if="timeShow" class="countdown u-m-b-25 u-m-t-15">
			<!-- <view v-if="true" class="countdown u-m-b-25 u-m-t-55"> -->
			<view class="time">{{h<10?'0'+h:h}}</view>
			<text class="dot">:</text>
			<view class="time">{{m<10?'0'+m:m}}</view>
			<text class="dot">:</text>
			<view class="time">{{s<10?'0'+s:s}}</view>
		</view>
		<view class="btn-group" v-if="isSelected">
			<button v-if="switchBtn" type="default" @click="pauseTime">暂停</button>
			<button v-else type="default" @click="continueTime">继续</button>
			<button v-if="isSelected" type="default" @click="cancelTime">取消</button>
		</view>
		<view class="setting">
			<u-select @confirm="confirm" v-model="show" :list="list"></u-select>
			<button v-if="startChoose" @click="openList">选择专注时长</button>
			<button v-if="isOpenBtn" @click="detailedShow = true">了解番茄时间</button>
			<button v-if="isOpenBtn" @click="taskShow = true">设置任务</button>
			<view class="task-text u-m-b-20 u-m-t-20">
				<view>
					<u-icon name="clock" class="u-m-r-10" color="#E91E63" size="32"></u-icon>
					当前任务：
				</view>
				<view>{{nowtask===''?'暂未设置请先设置':nowtask}}</view>
			</view>

		</view>
		<image class="tomato-img" v-if="isOpenBtn" src="../../static/material/tomato.png" mode="widthFix"></image>
		<!-- 图表 -->
		<view  class="charts">
			<view class="charts-box">
				<qiun-data-charts type="pie" :chartData="chartData" background="none" />
			</view>
		</view>

		<view class="tomato-info">
			<view>
				<u-icon name="pushpin-fill" class="u-m-r-10" color="#E91E63" size="32"></u-icon>
				使用番茄 {{totalTime.len}} 天
				累计专注了{{ totalTime.totoTime }}分钟
			</view>
			<view>
				<u-icon name="pushpin" class="u-m-r-10" color="#E91E63" size="32"></u-icon>
				今日完成 {{ nowInfo.len }}个番茄任务
				总计 {{ nowInfo.total }} 分钟
			</view>
		</view>


		<view>
			<u-modal :show-cancel-button="true" @confirm="setTask" title="设置任务" v-model="taskShow">
				<view class="slot-content">
					<input
						:style="{'boxShadow': '0px 1px 1px 0px #CFD8DC','borderRadius':'50rpx','textAlign':'center','height': '90rpx','lineHeight':'1'}"
						class="update-nick" type="text" v-model="nowtask" />
				</view>
			</u-modal>
		</view>
		<view>
			<u-modal :content="detailed" @confirm="detailedShow = false" title="什么是番茄时间" v-model="detailedShow">
			</u-modal>
		</view>

	</view>

</template>

<script>
	import qiunDataCharts from '@/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			'qiun-data-charts': qiunDataCharts
		},
		props: {
			startTime: {
				type: String,
			},
			endTime: {
				type: String,
			},
		},
		computed: {
			...mapState(['tomatoData', 'tomatoInfo', 'chartData']),
			sTime() {
				return this.startTime
			},
			eTime() {
				return this.endTime
			},
			// 统计专注时间
			totalTime() {
				if (this.tomatoData.size === 0 || JSON.stringify(this.tomatoData) === '{}') return {
					len: 0,
					totoTime: 0
				}

				let arr = [].concat(...Object.values(this.tomatoData))
				let totoTime = 0
				arr.forEach(item => {
					totoTime += item.value
				})
				let obj = {}
				let tempArr = []
				obj.totoTime = totoTime.toFixed(2)
				tempArr = [...Object.keys(this.tomatoData)]

				if (tempArr.length) {
					obj.len = tempArr.length
				} else {
					obj.len = 0
				}
				return obj
			},
			// 今日专注信息
			nowInfo() {
				console.log('今日');
				if (this.tomatoData.size === 0 || JSON.stringify(this.tomatoData) === '{}') return {
					len: 0,
					total: 0
				}
				// 获取今天的番茄信息
				let nowInfo = this.tomatoData[this.nowTime]
				// console.log(nowInfo);
				if (nowInfo === "" || nowInfo === undefined || nowInfo === null) {
					nowInfo = []
				}

				let obj = {
					len: nowInfo.length,
					total: 0
				}
				// 统计今天的番茄时间
				let totalTaskTime = 0
				nowInfo.forEach(item => {
					totalTaskTime += item.value
				})
				obj.total = totalTaskTime.toFixed(2)
				return obj
			}
		},
		data() {
			return {
				// 今天日期
				nowTime: this.$formatDate(new Date()),
				// 开始选择时间
				startChoose: false,
				// 控制设置任务模态框
				taskShow: false,
				// 当前任务
				nowtask: '',
				// 定时器
				timer: null,
				d: 0,
				h: 0,
				m: 0,
				s: 0,
				// 需要多久时间
				time: 0,
				// 选择框显示
				show: false,
				// 控制时间显示
				timeShow: false,
				// 选择框选项
				list: [],
				// 开关
				switchBtn: true,
				// 是否开始倒计时了
				isSelected: false,
				// 控制 open按钮显示
				isOpenBtn: true,
				// 番茄样式
				tomatoStyle: {},
				// 控制详情显示与消失
				detailedShow: false,
				// 番茄工作介绍
				detailed: `番茄工作法是简单易行的时间管理方法。使用番茄工作法，选择一个待完成的任务，将番茄时间设为25分钟，专注工作，中途不允许做任何与该任务无关的事，直到番茄时钟响起，然后进行短暂休息一下（5分钟就行），然后再开始下一个番茄，每4个番茄时段多休息一会儿。 番茄工作法是一种简单易行的时间管理方法，在时间管理方面相对于更加微观。使用番茄工作法，选择一个待完成的任务，设定一个番茄时间，在番茄时间内专注工作，中途不允许做任何与该任务无关的事，直到番茄钟响起，然后在纸上画一个记号，记录下来；然后设定一个番茄休息时间，短暂休息一下。结束一天的工作后，根据记录对当日的工作学习情况进行复盘，同时可以对第二天的时间进行规划。`,
				// 前面的一些时间
				preTime: [{
					value: 5,
					label: `5 分钟`
				}, {
					value: 10,
					label: `10 分钟`
				}, {
					value: 15,
					label: `15 分钟`
				}, {
					value: 20,
					label: `20 分钟`
				}, {
					value: 25,
					label: `25 分钟`
				}, {
					value: 30,
					label: `30 分钟`
				}, {
					value: 35,
					label: `35 分钟`
				}, {
					value: 40,
					label: `40 分钟`
				}, {
					value: 45,
					label: `45 分钟`
				}]
			}
		},
		mounted() {
			// console.log(this.tomatoData);
			// 番茄信息为空 从缓存中获取信息
			if (JSON.stringify(this.tomatoData) === "{}") {
				const _self = this;
				// 获取数据
				let tempData = uni.getStorageSync('tomatoData')
				if (JSON.stringify(tempData) === '{}' || tempData === '') {
					this.setTomatoData({})
				} else {
					this.setTomatoData(tempData)
					let tempInfo = tempData[this.nowTime]
					if (!tempInfo || tempInfo === undefined || tempInfo === null || tempInfo === '') {
						this.setTomatoInfo([])
					} else {
						this.setTomatoInfo(tempInfo)
						// 更新图表
						this.setChar()
					}


				}
			}
			this.crateTime()
			this.list.unshift({
				value: 0.05,
				label: `3 s测试用`
			})
			this.list = [...this.preTime, ...this.list]
		},
		beforeDestroy() {
			clearInterval(this.timer);
			this.timer = null;
		},

		watch: {
			endTime() {
				clearInterval(this.timer);
				this.startT()
			}
		},
		methods: {
			...mapMutations(['setChar', 'setChartData', 'updateTomatoData', 'updateTomatoInfo', 'setTomatoData',
				'setTomatoInfo'
			]),
			// ...tomatoMutations(['updateTomatoData', 'updateTomatoInfo', 'setTomatoData', 'setTomatoInfo']),
			// 设置任务
			setTask() {
				if (this.nowtask.trim() === '') return this.$showt('error', '你输入的任务为空', this.$refs.uToast)
				this.isOpenBtn = false
				this.startChoose = true
			},
			// 打开列表
			openList() {
				this.show = true
			},
			// 选择时间
			confirm(e) {
				clearInterval(this.timer);
				this.time = e[0].value * 60
				this.getCountdownTime(this.time)
				this.isSelected = true
				this.isOpenBtn = false
				this.timeShow = true
				this.startChoose = false
			},
			// 生成时间，我懒得一个一个改。。
			crateTime() {
				let list = [];
				for (let i = 1; i <= 60; i++) {
					list.push({
						value: i,
						label: `${i}  分钟`
					})

				}
				this.list = list
			},
			// 取消时间
			cancelTime() {
				this.time = 0
				this.d = 0
				this.h = 0
				this.m = 0
				this.s = 0
				this.isSelected = false
				this.switchBtn = true
				this.isOpenBtn = true
				this.timeShow = false
				this.nowtask = ''
				clearInterval(this.timer);
			},
			// 暂停时间
			pauseTime() {
				this.switchBtn = false
				clearInterval(this.timer)
			},
			// 继续
			continueTime() {
				this.switchBtn = true
				this.getCountdownTime(this.time)
			},
			startT() {
				let leftTime = this.GetDateDiff(this.sTime, this.eTime)
				this.getCountdownTime(leftTime)
			},
			//计算两个时间差
			GetDateDiff(startTime, endTime) {
				//将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
				startTime = startTime.replace(/\-/g, "/");
				endTime = endTime.replace(/\-/g, "/");
				//将计算间隔类性字符转换为小写
				var sTime = new Date(startTime);
				var eTime = new Date(endTime);
				return parseInt((eTime.getTime() - sTime.getTime()) / 1000);
			},
			//计算活动结束时间
			getCountdownTime(leftTime) {
				this.time = leftTime
				let savaTime = leftTime
				if (this.time > 0) {
					this.timer = setInterval(() => {
						if (this.time == 0) {
							clearInterval(this.timer)
							this.h = 0
							this.m = 0
							this.s = 0
							this.timeShow = false
							this.isSelected = false
							this.switchBtn = true
							this.isOpenBtn = true
							clearInterval(this.timer);
							// 记录本次番茄时间

							this.updateTomatoInfo({
								'name': this.nowtask,
								'value': savaTime / 60
							})

							this.nowtask = ''
							// 添加记录
							this.updateTomatoData([this.nowTime, this.tomatoInfo])
							// 更新图表
							this.setChar()
							// 保存到缓存
							uni.setStorageSync('tomatoData', this.tomatoData)
							console.log('tomatoInfo:',this.tomatoInfo);
							// 震动手机
							uni.vibrateLong({
								success: function() {
									console.log('震动success');
								}
							});
						} else {
							this.d = parseInt(leftTime / 3600 / 24);
							this.h = parseInt((this.time / 3600) % 24);
							this.m = parseInt((this.time / 60) % 60);
							this.s = parseInt(this.time % 60);
							this.time--
						}
					}, 1000)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100vw;
		display: flex;
		justify-content: center;

		.charts-box {
			width: 100%;
			height: 300px;
		}

		.tomato-wrap {
			width: 95vw;
			border-radius: 20rpx;
			background-color: rgb(250,250,250);
			box-shadow: 2rpx 2rpx 2rpx 2rpx #CFD8DC, -2rpx -2rpx 2rpx 2rpx #FAFAFA;
			box-sizing: border-box;
			padding: 10rpx 0 20rpx;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;

			.tomato-img {

				// width: 300rpx;
				width: 0rpx;
				height: 0rpx;
				margin: 5rpx 0;
			}

			.setting {
				display: flex;
				justify-content: center;
				flex-wrap: wrap;


			}


			.task-text {
				display: flex;
				justify-content: space-around;
				flex-wrap: nowrap;
				box-sizing: border-box;
				padding: 10rpx 40rpx;
				border-radius: 15rpx;
				box-shadow: 2rpx 2rpx 2rpx 2rpx #CFD8DC, -2rpx -2rpx 2rpx 2rpx #FAFAFA;
			}

			button {
				width: 660rpx;
				margin: 20rpx 0;
				color: #5C6BC0;
				background-color: #E0F7FA;
				letter-spacing: 10rpx;
				background-image: url(../../static/material/wave.svg);
				// background-repeat: no-repeat;
				/* background-repeat: repeat-x;
				background-size: 100% 100%;
				background-position: center; */
			}

			.countdown {
				width: 90vw;
				height: 40vw;
				// background-color: #FF5722;
				background-color: #B2EBF2;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 20rpx;
				box-shadow: 2rpx 2rpx 2rpx 2rpx #607D8B, -2rpx -2rpx 2rpx 2rpx #F5F5F5;
				background-image: url(../../static/material/wave.svg);
				background-repeat: repeat-x;
				background-position: 50% bottom;

				.time {
					box-sizing: border-box;
					width: 25vw;
					height: 25vw;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 20rpx;
					padding: 20rpx;
					font-size: 120rpx;
					// background-color: #4CAF50;
					color: #FDFFFC;
					text-shadow: 4rpx 4rpx 4rpx #385F71, -1rpx -1rpx 4rpx #d4edf4;
					background-color: #EF5350;
					box-shadow: 4rpx 4rpx 4rpx 1rpx #385F71, -1rpx -1rpx 4rpx 1rpx #d4edf4;
				}

				.dot {
					font-size: 50rpx;
					font-weight: bolder;
					margin: 0 10rpx;
					color: #606060;
				}
			}

		}



	}
</style>
