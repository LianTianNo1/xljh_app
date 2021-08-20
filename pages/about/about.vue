<template>
	<view class="content">
		<u-navbar back-text="返回" title="关于"></u-navbar>
		<view class="info">
			各位用户你们好，很荣幸大家使用本软件<br>
			我是这个软件的开发者小浪<br>
			目前是一位大三学生<br>
			功能很简单，实现起来却是....<br>
			不说了都是头发<br>
			希望这个软件能够给您的生活提供便利<br>
			项目开源是用 uni-app 开发<br>
			下面是项目的地址 github <br>
			链接点击就可以复制<br>
			感兴趣的伙伴可以看看<br>
			欢迎大家 star<br>
			github 有时候抽风你可能访问不了<br>
			项目我会继续优化和更新<br>
			留个联系方式吧：QQ1584731441<br>
			或者通过 github 联系我<br>
			留下您宝贵的提议<br>
			欢迎大家交流<br>
			最下面是我的博客地址<br>
			欢迎大家访问<br>

		</view>
		<view class="address">
			<view class="gitAddree u-m-t-25 u-m-b-25">
				<u-icon class="u-m-r-15" name="github-circle-fill" color="#000000" size="38"></u-icon>
				<text @click="clipBoard">{{url}}</text>
			</view>
			<view class="gitAddree u-m-b-25 u-m-t-25">
				<image class="u-m-r-15" src="../../static/material/juejin.svg" mode="widthFix"></image>
				<text @click="clipBoard2">{{blogUrl}}</text>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: 'https://github.com/LianTianNo1/xljh_app',
				blogUrl: 'https://juejin.cn/user/4098610193243789/posts'
			}
		},
		methods: {
			clipBoard() {
				uni.setClipboardData({
					data: this.url,
					success: function() {
						console.log('设置剪切板成功');
					}
				});
				uni.getClipboardData({
					success: function(res) {
						console.log('获取剪切板成功');
					}
				});
			},
			clipBoard2() {
				uni.setClipboardData({
					data: this.blogUrl,
					success: function() {
						console.log('设置剪切板成功');
					}
				});
				uni.getClipboardData({
					success: function(res) {
						console.log('获取剪切板成功');
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 90vh;
		background-color: rgb(237, 237, 237);
		/* background-image: url('https://gitee.com/lang-tian/image_upload/raw/master/img/DFCC97D310F648EC7F7E3AA8A5E40EE7.jpg');
		background-size: 100% 100%;
		background-position: center; */
		// background-image: linear-gradient(180deg,red,blue);
		  background-image:linear-gradient(to bottom right,#AD18F9,#05DFC7);
		.content {
			height: 90vh;
			display: flex;
			justify-content: center;
			align-items: flex-start;
			flex-wrap: wrap;
			/*#ifdef H5*/
			margin-top: 100rpx;
			/*#endif*/
			/*#ifdef APP-PLUS*/
			margin-top: 170rpx;
			/*#endif*/
			.info {
				text-align: center;
				width: 97vw;
				padding: 20rpx;
				font-size: 30rpx;
				line-height: 1.5;
				letter-spacing: 5rpx;
				border-radius: 20rpx;
				color: #2E94B9;
				background-color: #F8F9FC;
				box-shadow: 2rpx 2rpx 1rpx 1rpx #C5CAE9, -1rpx -1rpx 1rpx 1rpx #f5f4e8;
				margin-bottom: 20rpx;
			}

			.address {
				width: 97vw;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				border-radius: 20rpx;
				background-color: #F5F7FA;
				box-shadow: 2rpx 2rpx 1rpx 1rpx #C5CAE9, -1rpx -1rpx 1rpx 1rpx #f5f4e8;

				view {
					display: flex;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;

					image {
						width: 40rpx;
					}
				}
			}
		}
	}
</style>
