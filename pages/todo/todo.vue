<template>
	<view>
		<u-tabbar :list="tabbar.tabbar" :mid-button="true"></u-tabbar>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				title: '清单',
			}
		},
		computed:{
			...mapState(['tabbar'])
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
