<template>
	<view>
		<view class="uni-margin-wrap">
					<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
						:duration="duration">
						<swiper-item>
							<view style="background-color: bisque; width: 100%; height:  200px;">A</view>
						</swiper-item>
						<swiper-item>
							<view style="background-color: blue;width: 100%; height:  200px;">B</view>
						</swiper-item>
						<swiper-item>
							<view style="background-color: red;width: 100%; height:  200px;">C</view>
						</swiper-item>
					</swiper>
				</view>
				<text>标题</text>
		 <video 
			  style="width: 100%;  height: 300px;"
		      id="myVideo" 
		      :src=fileID></video>
			<button @tap="selectvideo" v-show="false">选择视频上传</button>
			<text>具体地点：山西省太原市xxxxx</text>
			<view>
				<text>价格：1000</text>
				<text>---月付</text>
				
			</view>
			<view>
				<text>详情：</text>
				<text>面积：---</text>
				<text>房型：---</text>
			</view>	
			<view>
				<text>设施：</text>
				<text>空调：---</text>
				<text>洗衣机：---</text>
				<text>冰箱：---</text>
				<text>厨房：---</text>
			</view>
			<view>
				<text>联系方式：</text>
				<text>微信：---</text>
				<text>手机号：---</text>
				
			</view>
			
			
			<button @tap="getvideo" v-show="false">获取视频</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fileID:'cloud://prod-7g3ji5ui73a4702f.7072-prod-7g3ji5ui73a4702f-1371216117/map/demo1.mp4',
				value: 0,
				  range: [
				          { value: 0, text: "月付" },
				          { value: 1, text: "季付" },
				          { value: 2, text: "半年付" },
				          { value: 3, text: "年付" },
				        ],
			}
		},
		// onLoad() {
		// 	   // 初始化云开发
		// 	    wx.cloud.init({
		// 	      env: 'prod-7g3ji5ui73a4702f', // 替换为你的实际环境ID
		// 	      traceUser: true // 是否记录用户访问
		// 	    })
		// },
		methods: {
			selectvideo(){
				wx.chooseMedia({
					count:3,
					maxDuration:60,
					success(res){
						 console.log(res.tempFiles[0].tempFilePath)
						
						    console.log(res.tempFiles[0].size)
							wx.cloud.uploadFile({
								cloudPath:"map/demo1.mp4",
								filePath:res.tempFiles[0].tempFilePath,
								 config: {
								    env: 'prod-7g3ji5ui73a4702f' // 微信云托管环境ID
								  },
								  success: console.log,
								    fail: console.error
							})
					} 
				})
			},
			getvideo(){
				wx.cloud.callFunction({
				  // 要调用的云函数名称
				  name: 'setvideojson',
				  // 传递给云函数的参数
				  data: {
				    x: 1,
				    y: 2,
				  },
				  success: res => {
					  console.log(res)
				    // output: res.result === 3
				  },
				  fail: err => {
				    // handle error
					console.log(res)
				  },
				  complete: () => {
				    // ...
				  }
				})
			}
			
		}
	}
</script>

<style>

</style>