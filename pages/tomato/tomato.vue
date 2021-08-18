<template>
	<view class="content">
		<u-navbar :is-back='false' title="番茄时间"></u-navbar>
		<view class="clock">
			<countdown class="time-down" :startTime="startTime" :endTime="enTime" />

		</view>
		<u-tabbar @change="beforeSwitch" :list="tabbar" :mid-button="true"></u-tabbar>
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
	import countdown from "@/components/cz-countdown/cz-countdown.vue"
	export default {
		data() {
			return {
				title: '番茄',
				startTime: '2020-01-01 00:00:00',
				enTime: '2020-01-01 00:30:00',
			}
		},
		computed: {
			...tabbarState(['tabbar', 'todoObj']),
		},
		methods: {
			// 切换 tabBar 调用
			beforeSwitch() {
				let usrInfo = uni.getStorageSync('user_info')
				usrInfo && uni.removeStorageSync('userData')
				this.todoObj && this.$getUserData(this.todoObj);
			},
		},
		components: {
			countdown
		}
	}
</script>

<style lang="scss">
	page {
		height: 100vh;
		width: 100vw;
		background-color: #ededed;
		.content{
			width: 100%;
			height: 50vh;
			display: flex;
			justify-content: center;
			align-items: center;
			.clock{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 80vw;
				.time-down{
				}
			}
		}
		
	}
</style>
