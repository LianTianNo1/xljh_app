<template>
	<view class="content" :style="{backgroundImage: 'url('+imageBase64+')'}">
		<!-- <view class="content" :style="{backgroundImage: imageBase64}"> -->
		<u-navbar back-text="返回" title="关于"></u-navbar>
		<view v-if="introduction" class="info" v-html="showStr" ref="aboutInfo"></view>

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
				blogUrl: 'https://juejin.cn/user/4098610193243789/posts',
				imageBase64: '/static/material/bg.jpg',
				str: `
					各位用户你们好，很荣幸大家使用本软件<br>
					我是这个软件的开发者小浪<br>
					目前是一位大三学生<br>
					功能很简单，实现起来却是....<br>
					不说了都是头发<br>
					希望这个软件能够给您的生活提供便利<br>
					本软件是用 uni-app 开发<br>
					项目开源下面是项目的地址 github <br>
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
				`,
				// imageBase64:'linear-gradient(to bottom right,#AD18F9,#05DFC7)',
				i: 0,
				timer: null,
				typewriter: null,
				showStr: '',
				introduction: false
			}

		},
		onShow() {
			// 打印文字
			this.printStrF()
		},
		methods: {
			// 具体打印文字
			typeing() {
				if (this.i <= this.str.length) {
					this.showStr = this.str.slice(0, this.i++) + '_'
					this.timer = setTimeout(() => {
						this.typeing()
					}, 100)
				} else {
					this.showStr = this.str
					clearTimeout(this.timer)
				}
			},

			// 打印文字入口
			printStrF() {
				this.introduction = true;
				setTimeout(() => {
					this.typewriter = this.$refs.aboutInfo.$el
					this.typeing()
				}, 100)
			},
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
		height: 100vh;

		.content {
			height: 100vh;
			display: flex;
			justify-content: center;
			align-items: flex-start;
			flex-wrap: wrap;
			/*#ifdef H5*/
			padding-top: 100rpx;
			/*#endif*/
			/*#ifdef APP-PLUS*/
			padding-top: 170rpx;

			/*#endif*/
			.info {
				text-align: center;
				width: 97vw;
				padding: 50rpx 20rpx;
				font-size: 30rpx;
				line-height: 1.5;
				letter-spacing: 5rpx;
				border-radius: 20rpx;
				color: #2E94B9;
				background-color: rgba($color: #50C1E9, $alpha: 0.1);
				box-shadow: 2rpx 2rpx 1rpx 1rpx #dddfe6, -1rpx -1rpx 1rpx 1rpx #f5f4e8;
				margin-bottom: 20rpx;
			}

			.address {
				width: 97vw;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				border-radius: 20rpx;
				background-color: #FFFFFF;
				box-shadow: 2rpx 2rpx 1rpx 1rpx #dddfe6, -1rpx -1rpx 1rpx 1rpx #f5f4e8;

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
