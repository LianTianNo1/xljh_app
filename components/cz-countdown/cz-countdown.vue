<template>
	<view>
		<view class="countdown u-m-b-25 u-m-t-55">
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
		<view>
			<u-select @confirm="confirm" v-model="show" :list="list"></u-select>
			<button v-if="isOpenBtn" @click="openList">专注时间</button>
		</view>
	</view>

</template>

<script>
	export default {
		props: {
			startTime: {
				type: String,
			},
			endTime: {
				type: String,
			},
		},
		data() {
			return {
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
				// 选择框选项
				list: [],
				// 开关
				switchBtn: true,
				// 是否开始倒计时了
				isSelected: false,
				// 控制 open按钮显示
				isOpenBtn: true
			}
		},
		mounted() {
			this.crateTime()
		},
		beforeDestroy() {
			clearInterval(this.timer);
			this.timer = null;
		},
		computed: {
			sTime() {
				return this.startTime
			},
			eTime() {
				return this.endTime
			}
		},
		watch: {
			endTime() {
				clearInterval(this.timer);
				this.startT()
			}
		},
		methods: {
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
				if (this.time > 0) {
					this.timer = setInterval(() => {
						if (this.time == 0) {
							clearInterval(this.timer)
							this.h = 0
							this.m = 0
							this.s = 0
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
	button {
		color: #F5F5F5;
		background-color: #C5CAE9;
		letter-spacing: 10rpx;
	}

	.countdown {
		width: 90vw;
		height: 40vw;
		background-color: #FF5722;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 20rpx;
		box-shadow: 2rpx 2rpx 2rpx 2rpx #607D8B, -2rpx -2rpx 2rpx 2rpx #F5F5F5;

		.time {
			color: #FDFFFC;
			text-shadow: 4rpx 4rpx 4rpx #385F71, -1rpx -1rpx 4rpx #d4edf4;
			padding: 8rpx;
			// background-color: #606060;
			background-color: #4CAF50;
			border-radius: 20rpx;
			box-sizing: border-box;
			padding: 20rpx;
			font-size: 120rpx;
			box-shadow: 4rpx 4rpx 4rpx 1rpx #385F71, -1rpx -1rpx 4rpx 1rpx #d4edf4;
		}

		.dot {
			font-size: 50rpx;
			font-weight: bolder;
			margin: 0 10rpx;
			color: #606060;
		}
	}
</style>
