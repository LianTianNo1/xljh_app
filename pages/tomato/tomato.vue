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
		computed: {
			...tabbarState(['tabbar', 'todoObj']),
		},
		methods: {
			...mapMutations(['setChar']),
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
