<template>
	<view>
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
	export default {
		data() {
			return {
				title: '番茄',
			}
		},
		computed: {
			...tabbarState(['tabbar', 'todoObj']),
		},
		methods: {
			// 切换 tabBar 调用
			beforeSwitch() {
				this.todoObj && this.$getUserData(this.todoObj);
			},
		}
	}
</script>

<style>

</style>
