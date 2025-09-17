<template>
  <view class="container">
    <!-- 位置选择区域 -->
    <view class="section">
      <view class="section-title">位置信息</view>
      <button class="location-btn" @tap="chooseLocation">
        <text>选择地图坐标</text>
      </button>
      
      <view v-if="locationName" class="location-info">
        <text class="info-label">位置名称：</text>
        <text class="info-value">{{MarkerData.locationName}}</text>
        
        <view class="coords-container">
          <view class="coord-item">
            <text class="info-label">经度：</text>
            <text class="info-value">{{MarkerData.longitude}}</text>
          </view>
          <view class="coord-item">
            <text class="info-label">纬度：</text>
            <text class="info-value">{{MarkerData.latitude}}</text>
          </view>
        </view>
      </view>
    </view>
	<!-- 联系方式 -->
    <view class="section">
      <view class="section-title">联系方式</view>
      <input class="input" placeholder="微信" v-model="MarkerData.wechat" />
      <input class="input" placeholder="手机号" v-model="MarkerData.phone" type="number" />
    </view>
    <!-- 房源基本信息 -->
    <view class="section">
      <view class="section-title">房源信息</view>
      <input class="input" placeholder="房源标题" v-model="MarkerData.title" />
      <input class="input" placeholder="具体地点" v-model="MarkerData.location" />
      <input class="input" placeholder="面积（平方米）" v-model="MarkerData.area" />
      <view ><text style="margin-left: 10rpx; margin-bottom: 10rpx; font-weight: 500;">房间数量</text>
	  <input class="input" placeholder="" v-model="MarkerData.count" type="number" /></view>
    </view>
	
	<!-- 下一步按钮 -->
    <button class="submit-btn" @tap="nextroom">下一步</button>
  </view>
</template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex'
  export default {
    data() {
      return {
		MarkerData:{
	                    locationName: '',
	                    longitude: 0,
	                    latitude: 0,
	                    wechat: '',
	                    phone: '',
	                    title: '',
	                    location: '',
	                    area: '',
	                    count: 0
	                }, 
        // 位置信息
        locationName: 's',
        longitude: 0,
        latitude: 0,
		//视频信息
        msg:"成功上传",
		uid:[],
		filepath:[],
        // 房源基本信息
        swiperIds: [],
        title: '',
        videoId: '',
        location: '',
        area: '',
        houseType: '',
        count: 0,
        
        // 设施信息
        houseFacilities: [false, false, false, false,false,false,false], // 空调,洗衣机,冰箱,厨房
        houseName:["浴缸","花洒","冰箱","空调","微波炉","洗衣机","油烟机"],
        // 联系方式
        wechat: '',
        phone: '',
        
        // 支付选项
        paymentOptions: {
          '月付': 0,
          '半年付': 0,
          '年付': 0
        }
      }
    },
	onLoad() {
			this.MarkerData  = this.$store.state.baseInfo
	},
	computed:{
	
		// ...mapState(['baseInfo'])
		
	},
	// watch: {
	//     // 监听基本信息变化并保存到Vuex
	//     baseInfo: {
	//       deep: true,
	//       handler(newVal) {
	//         this.$store.dispatch('saveBaseInfo',newVal)
	//       }
	//     }
	//   },
	//页面卸载时
	onUnload(){
		//将MarkerData提交到store中
		this.$store.commit('UPDATE_BASE_INFO',this.MarkerData)
	},
    methods: {
		nextroom(){
		
			 // this.$store.dispatch('saveBaseInfo',baseInfo)
			uni.navigateTo({
				url:"/pages/marker/addMarker/NextRoom"
			})
		},
		//删除视频路径
		deleteFilePath(index){
			this.filepath.splice(index, 1)
		},
		//点击家具
		onhouse(index){
			this.houseFacilities[index] = !this.houseFacilities[index];
		},
		//关闭弹窗
		successbvideo_close(){
			 this.$refs.success.close('center');
		},
		successbvideo_toMap(){
			 this.$refs.success.close('center');
			  uni.navigateTo({
			               	url:"/pages/map/map"
			               })
		},
		//上传视频
		selectvideo(){
			// 将视频选择完毕后的路径保存并展示出
			var flag  = true
			wx.chooseMedia({
				count:3,
				mediaType:["video"],
				maxDuration:60,
				success:(res)=> {
					console.log("chooseMedia_Success")
					console.log(res.tempFiles[0].size/1048576)
					const that = this;
					that.filepath.push(...res.tempFiles)
					
				},
				fail:(res)=>{
					console.log("chooseMedia")
					flag=false	
				}
			})
			if(flag){
				
			}
		},
      // 选择地图位置
      chooseLocation() {
        uni.authorize({
          scope: 'scope.userLocation',
          success: () => {
            uni.chooseLocation({
              type: 'gcj02',
              success: (res) => {
                this.locationName = res.name;
                this.longitude = res.longitude;
                this.latitude = res.latitude;
                
                // 自动填充具体地点
                  this.location = res.address;
                
              },
              fail: (err) => {
                uni.showToast({
                  title: '位置选择失败',
                  icon: 'none'
                });
              }
            });
          },
          fail: () => {
            uni.showModal({
              title: '权限提示',
              content: '需要位置权限才能选择地点，请开启权限',
              confirmText: '去设置',
              success: (res) => {
                if (res.confirm) {
                  uni.openSetting();
                }
              }
            });
          }
        });
      },
      
      // 添加支付方式
      addPaymentOption() {
        uni.showModal({
          title: '添加支付方式',
          content: '输入支付方式名称（如：半年付）',
          editable: true,
          success: (res) => {
            if (res.confirm && res.content) {
              const key = res.content.trim();
              if (key && !this.paymentOptions[key]) {
                this.$set(this.paymentOptions, key, 0);
              }
            }
          }
        });
      },
      
      // 提交房源信息
      submitHouseInfo() {
		  
		  // 1. 位置信息验证
		   if (!this.locationName || !this.longitude || !this.latitude) {
		     uni.showToast({ title: '请先选择地图位置', icon: 'none' });
		     return;
		   }
		 
		   // 2. 房源基本信息验证
		   const basicInfoErrors = [];
		   if (!this.title) basicInfoErrors.push('房源标题');
		   if (!this.location) basicInfoErrors.push('具体地点');
		   if (!this.area || isNaN(this.area) || Number(this.area) <= 0) {
		     basicInfoErrors.push('有效面积');
		   }
		   if (!this.houseType) basicInfoErrors.push('房型信息');
		   if (!this.count || isNaN(this.count) || Number(this.count) <= 0) {
		     basicInfoErrors.push('房间数量');
		   }
		   
		   if (basicInfoErrors.length > 0) {
		     uni.showToast({
		       title: `请填写${basicInfoErrors.join('、')}`,
		       icon: 'none',
		       duration: 3000
		     });
		     return;
		   }
		 
		   // 3. 联系方式验证
		   const contactErrors = [];
		   if (!this.wechat && !this.phone) {
		     contactErrors.push('至少填写一种联系方式');
		   }
		   if (this.phone && !/^1[3-9]\d{9}$/.test(this.phone)) {
		     contactErrors.push('手机号格式不正确');
		   }
		   
		   if (contactErrors.length > 0) {
		     uni.showToast({
		       title: contactErrors.join('，'),
		       icon: 'none',
		       duration: 3000
		     });
		     return;
		   }
		 
		   // 4. 支付选项验证
		   const validPayments = Object.values(this.paymentOptions)
		     .filter(amount => amount > 0);
		   
		   if (validPayments.length === 0) {
		     uni.showToast({
		       title: '请至少设置一种有效的支付价格',
		       icon: 'none',
		       duration: 3000
		     });
		     return;
		   }
		 
		   // 5. 媒体文件验证
		   if (this.filepath.length === 0) {
		     uni.showToast({
		       title: '请至少上传一个视频文件',
		       icon: 'none',
		       duration: 3000
		     });
		     return;
		   }

		  //视频上传
		  const that = this;
			for(let i = 0;i<that.filepath.length;i++)
			{
				wx.cloud.uploadFile({
				cloudPath:"map/"+this.title+i+".mp4",
				filePath:that.filepath[i].tempFilePath,
				 config: {
					env: 'prod-7g3ji5ui73a4702f' // 微信云托管环境ID
				  },
				  success(res){
						console.log("uploadFile_success")
						
					  that.uid[i]  = res.fileID
				
				  },
					fail(res){
						console.log("uploadFile_fail")
						
						}
			})	
			}
			
			 // 准备提交给后端的数据
			  const houseData = {
			    longitude: parseFloat(this.longitude), // 改为普通浮点数
			    latitude: parseFloat(this.latitude),   // 改为普通浮点数
			    address: this.locationName,          
			    title: this.title,
			    location: this.location,        // 具体地点
			    area: this.area.toString(),
			    houseType: this.houseType,
			    roomCount: parseInt(this.count), // 转换为整数
			    wechat: this.wechat.toString(),
			    phone: this.phone.toString(),
			    paymentOptions: this.paymentOptions,
			    houseFacilities: this.houseFacilities,
			    videoIds: this.uid // 提取文件路径
			  };
			  // console.log(houseData)
			  const res = wx.cloud.callContainer({
			    "config": {
			      "env": "prod-7g3ji5ui73a4702f"
			    },
			    "path": "/api/house/submit",
			    "header": {
			      "X-WX-SERVICE": "springboot-2wum",
			      "content-type": "application/json"
			    },
			    "method": "POST",
			    "data": houseData,
				
			  })
			  console.log(res)
			  res.then(response => {
			  // 在这里可以访问 response 对象
			  console.log("API 响应:", response);
			  
			  // 检查 HTTP 状态码
			  if (response.statusCode === 200) {
				// 检查业务状态码
				if (response.data.code === "200") {
				  console.log("操作成功:", response.data.msg);
				 this.msg = response.data.msg;
				 this.$refs.success.open('center');
				} else {
				  console.error("业务错误:", response.data.msg);
				 this.msg = response.data.msg;
				 this.$refs.error.open('center');
				}
			  } else {
				console.error("HTTP 错误:", response.statusCode);
				// 错误处理逻辑...
			  }
			}).catch(error => {
			  console.error("请求失败:", error);
			  // 错误处理逻辑...
			});
      },
      // // 处理支付选项格式
      // processPaymentOptions() {
      //   const processed = {};
      //   for (const [key, value] of Object.entries(this.paymentOptions)) {
      //     processed[key] = Number(value) || 0;
      //   }
      //   return processed;
      // }
    }
  }
</script>

<style>
	.houseitem{
		display: flex; 
		flex-direction: column; 
		width: 120rpx;
		height: 120rpx;
		margin: 5rpx;
		align-items: center;
	}
	
	.prop {
	  width: 280px; 
	  height: 250px; 
	  background-color: aliceblue; 
	  border-radius: 10px; 
	  display: flex;
	  flex-direction: column;
	  align-items: center;       /* 水平居中 */
	  justify-content: center;   /* 垂直居中 */
	  padding: 20px 0;           /* 调整内边距 */
	  font-size: 20px;
	}
	.prop image {
	  width: 50px; 
	  height: 50px; 
	  margin-bottom: 30px;      /* 图片下间距 */
	}
	.prop text {
	  text-align: center;       /* 文本居中 */
	}
	.prop button {
	  width: 80%; 
	  margin-top: 30px;         /* 按钮上间距 */
	}
  .container {
    padding: 20rpx;
    background-color: #f5f5f5;
  }
  
  .section {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
  }
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 24rpx;
    color: #333;
  }
  
  .location-btn {
    background-color: #07c160;
    color: white;
    border-radius: 12rpx;
    font-size: 28rpx;
    margin-bottom: 20rpx;
  }
  
  .location-info {
    background-color: #f9f9f9;
    padding: 20rpx;
    border-radius: 12rpx;
    margin-top: 16rpx;
  }
  
  .coords-container {
    display: flex;
    margin-top: 16rpx;
  }
  
  .coord-item {
    flex: 1;
  }
  
  .info-label {
    font-weight: bold;
    color: #666;
    margin-right: 10rpx;
  }
  
  .info-value {
    color: #333;
  }
  
  .input {
    height: 80rpx;
    border: 1rpx solid #eee;
    border-radius: 12rpx;
    padding: 0 20rpx;
    margin-bottom: 24rpx;
    font-size: 28rpx;
  }
  
  .payment-item {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
  }
  
  .payment-input {
    flex: 1;
    height: 70rpx;
    border: 1rpx solid #eee;
    border-radius: 12rpx;
    padding: 0 20rpx;
    margin-right: 16rpx;
    font-size: 28rpx;
  }
  
  .payment-label {
    width: 120rpx;
    font-size: 26rpx;
    color: #666;
  }
  
  .add-payment {
    background-color: #f0f0f0;
    color: #666;
    font-size: 26rpx;
    margin-top: 10rpx;
  }
  
  .submit-btn {
    background-color: #07c160;
    color: white;
    border-radius: 12rpx;
    font-size: 32rpx;
    margin-top: 30rpx;
  }
  
  .houseclass{
  	display: flex;
  	flex-direction: row;
  	flex-wrap: wrap;
  }
</style>