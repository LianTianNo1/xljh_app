<template>
	<view class="content">
		<u-navbar :is-back='false' title="番茄时间"></u-navbar>
		<view class="clock">
			<tomatotime class="time-down" :startTime="startTime" :endTime="enTime" />

		</view>
		<u-tabbar @change="beforeSwitch" :list="tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		createNamespacedHelpers
	} from 'vuex'
	const {
		mapState: tabbarState,
		mapMutations: tabbarMutations
	} = createNamespacedHelpers('tabbar')
	import tomatotime from "@/components/tomato-time/tomato-time"
	export default {
		data() {
			return {
				title: '番茄',
				startTime: '2020-01-01 00:00:00',
				enTime: '2020-01-01 00:30:00',
			}
		},
		onShow() {
			console.log('show');
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
		},
		computed: {
			...mapState(['tomatoData']),
			...tabbarState(['tabbar', 'todoObj']),
		},
		methods: {
			...mapMutations(['setChar', 'setTomatoData', 'setTomatoInfo']),
			// 切换 tabBar 调用
			beforeSwitch() {
				/* 	// 更新图表
					this.setChar() */
			},
		},
		components: {
			tomatotime
		},

	}
</script>

<style lang="scss">
	page {
		height: 100vh;
		width: 100vw;
		background-color: #ededed;
		display: flex;
		justify-content: center;
		// align-items: center;

	}
</style>
