<template>
	<view>
		<map style="width: 100%; height: 600px;" 
		:longitude="longitude" :latitude="latitude" 
		:markers="covers" :include-points="inclde_covers"  @markertap="TapMarker"
		:scale="16" 
		:controls="controls" @controltap="returnPostion" @callouttap="TapMarker"
		></map>
		<button type="primary" @tap="addmarker">添加标记点</button>
		<button type="default" @tap="startrefresh">点击刷新</button>
		

	</view>
</template>

<script>
	export default {
		data() {
			return {
				msg:"demo",
				data:null,
				latitude: 1,
				longitude: 1,
				old_latitude: 1,
				old_longitude: 1,
				inclde_covers: [{
					id:1,
					latitude: 1,
					longitude: 1,
					iconPath: '../../static/map/redMarker.png',
					callout: {
						content: '',
						textAlign: 'center',
						color: '#00aa00',
						borderRadius: 10,
						borderWidth: 2,
						display: "ALWAYS",
					},
					label: {
						content: '当前位置',
						x:100,
						color: '#FB3109'
					},

					width: 30,
					height: 30
				}],
				covers: [{
					id:1,
					latitude: 1,
					longitude: 1,
					iconPath: '../../static/map/redMarker.png',
					callout: {
						content: '',
						textAlign: 'center',
						color: '#00aa00',
						borderRadius: 10,
						borderWidth: 2,
						display: "ALWAYS",
					},
					label: {
						content: '当前位置',
						x:100,
						color: '#FB3109'
					},

					width: 30,
					height: 30
				}],
				
				controls: [{
					id: 1,
					position: {
						left: 10,
						top: 570,
						width: 30,
						height: 30
					},
					iconPath: "/static/map/currentLocation_bule.png",
					clickable: true
				}],

			}
		},
		onLoad() {
			// 初始化云开发
			 wx.cloud.init({
			   env: 'prod-7g3ji5ui73a4702f', // 替换为你的实际环境ID
			   traceUser: true // 是否记录用户访问
			 })
			//获取定位权限并定位当前位置
			this.getSetting()
			//获取所有标记进行渲染
			this.getAllMark()
			
		},
		refreshMarkers() {
		  this.getAllMark();
		},
		onPullDownRefresh() {
			this.getAllMark()
			setTimeout(()=>{uni.stopPullDownRefresh()},3000)
		},
		 onShow() {
		    if (wx.canIUse('hideHomeButton')) {
		      wx.hideHomeButton()
		    }
		  },
		methods: {
			//点击刷新
			startrefresh(){
				uni.startPullDownRefresh()
			},
			// 将 API 数据转换为地图标记格式
			convertApiDataToMarkers(apiData) {
			  return apiData.map(item => {
			    return {
			      id: item.id, // 使用 API 返回的 id
			      latitude: item.latitude, // 使用 API 返回的 latitude
			      longitude: item.longitude, // 使用 API 返回的 longitude
			      iconPath: '../../static/map/buleMarker.png', // 根据 ID 获取图标
			      callout: {
			        content: item.title+"("+item.count+")", // 使用 API 返回的 title
			        textAlign: 'center',
			        color: '#00aa00',
			        borderRadius: 10,
			        borderWidth: 2,
			        display: "ALWAYS",
			      },
			      width: 30,
			      height: 30,
			    };
			  });
			},
			//获取所有标记
			getAllMark(){
				const res = wx.cloud.callContainer({
				  "config": {
				    "env": "prod-7g3ji5ui73a4702f"
				  },
				  "path": "/api/mark/get",
				  "header": {
				    "X-WX-SERVICE": "springboot-2wum",
				    "content-type": "application/json"
				  },
				  "method": "GET"
				})
				console.log(res)
				res.then(response=>{
			  // 检查 HTTP 状态码
			  if (response.statusCode === 200) {
				// 检查业务状态码
				if (response.data.code === "200") {
				  console.log("操作成功:", response.data.msg);
				 
				this.data = this.convertApiDataToMarkers(response.data.data)
				this.covers.push(...this.data)
				console.log(this.covers)
				} else {
				  console.error("业务错误:", response.data.msg);
				
				 this.$refs.error.open('center');
				}
			  } else {
				console.error("HTTP 错误:", response.statusCode);
				// 错误处理逻辑...
			  }
			}).catch(error => {
			  console.error("标记请求失败:", error);
			  
			  // 错误处理逻辑...
			});
			},
			//当前位置定位
			getSetting() {
				wx.getSetting({
					success: (res) => { // 改为箭头函数
						if (!res.authSetting['scope.userLocation']) {
							wx.authorize({
								scope: 'scope.userLocation',
								success: () => { // 改为箭头函数
									this.fetchLocation();
								}
							});
						} else {
							this.fetchLocation();
						}
					}
				});
			},
			fetchLocation() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						this.latitude = res.latitude;
						this.longitude = res.longitude;
						this.old_latitude = res.latitude;
						this.old_longitude = res.longitude;
						this.inclde_covers[0] = {
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath: '../../static/map/redMarker.png',
							width: 30,
							height: 30,
							callout: {
								content: '',
								textAlign: 'center',
								color: '#00aa00',
								borderRadius: 10,
								borderWidth: 2,
								display: "ALWAYS",

							},
							label: {
								content: '当前位置',
								x:-25,
								color: '#FB3109'
							},

						};
						 this.covers[0] =this.inclde_covers[0]
						console.log("坐标设置完毕");
					},
					fail: (err) => {
						console.error('定位失败:', err);
					}
				});
			},
			returnPostion() {
				console.log("cz")
				this.covers[0] = null
				this.inclde_covers[0] = null
				console.log(this.latitude + "\n" + this.longitude)
				this.fetchLocation()
			},
			TapMarker(e){
				console.log(e.markerId)
				wx.navigateTo({
					url:"/pages/marker/marker?id="+e.markerId,
					fail(e) {
						console.log(e)
					}
				})
			},
			addmarker(){
				uni.navigateTo({
					url:"/pages/marker/addMarker/addMarker"
				})
				// uni.chooseLocation({
				// 	success: function (res) {
				// 		console.log('位置名称：' + res.name);
				// 		console.log('详细地址：' + res.address);
				// 		console.log('纬度：' + res.latitude);
				// 		console.log('经度：' + res.longitude);
				// 	}
				// });
			},
			//----------------methods方法分割线-------------------
		}
	}
</script>

<style>

</style>