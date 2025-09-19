<template>
  <view class="container">
  

    <!-- 房源基本信息 -->
    <view class="section">
      <view class="section-title">房间信息</view>
	   <view class="section-title">房间数：{{roomCount+1}}/{{MaxCount}}</view>
      <input class="input" placeholder="房间号" v-model="roomdata.RoomNumber" />
      <input class="input" placeholder="具体地址" v-model="roomdata.RoomAddress" />
      <input class="input" placeholder="面积（平方米）" v-model="roomdata.RoomArea" />
      <input class="input" placeholder="房型（如：2室1厅）" v-model="roomdata.RoomType" />
    </view>

    <!-- 支付选项 -->
    <view class="section">
      <view class="section-title">支付选项</view>
      <view v-for="(value, key, index) in roomdata.RoomPayment" :key="index" class="payment-item">
        <input class="payment-input" type="number" :placeholder="`${key}价格`" v-model="roomdata.RoomPayment[key]" />
        <text class="payment-label">{{key}}</text>
      </view>
      <!-- <button class="add-payment" @tap="addPaymentOption">+ 添加支付方式</button> -->
    </view>
	<!-- 家电选项 -->
    <view class="section">
      <view class="section-title">家具选项</view>
		<view  class="houseclass"  >
			<view v-for="index in 7" :key="index"	>
				<view @click="onhouse(index)" >
					<view class="houseitem" v-if="roomdata.RoomFurniture[index]">
					<text style="color: #4db0e4;">{{houseName[index-1]}}</text>
					<image style="width: 80rpx; height: 100rpx;"  :src="`/static/map/furniture/select/${index}.png`"  ></image>
					</view>
					
					<view class="houseitem" v-else>
					<text>{{houseName[index-1]}}</text>
					<image style="width: 80rpx; height: 100rpx;"  :src="`/static/map/furniture/de/${index}.png`"  ></image>
					</view>
				</view>
			</view>
		
			
		</view>
    </view>
	
	
	 <!-- 上传按钮 -->
	<view class="section">
      <view class="section-title">媒体上传</view>
      <button class="location-btn" @tap="selectvideo">
        <text>上传视频</text>
      </button>
	
	
	 <view style="display: flex; flex-wrap: wrap; padding: 10px;">
	   <view 
	     v-for="(item,index) in filepath" 
	     :key="index" 
	     style="width: 40%; margin: 0 5% 10px 5%;"
	   >
	     <image 
	       :src="item.thumbTempFilePath" 
	       mode="scaleToFill" 
	       style="width: 100%; height: 100px; background-color: #f5f5f5; border-radius: 4px;" 
	     />
	     
	     <view style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
	       <text style="font-size: 12px; color: #666;">
	         {{(item.size/1048576).toFixed(2)}}MB
	       </text>
	       
	       <button 
	         @click="deleteFilePath(index)" 
	         type="warn" 
	         style="
	           width: 80px; 
	           height: 30px; 
	           padding: 0;
	           display: flex;
	           justify-content: center;
	           align-items: center;
	           font-size: 12px;
	           border-radius: 4px;
	         ">
	         删除
	       </button>
	     </view>
	   </view>
	 </view>
	  
	
		<uni-popup ref="error" type="bottom" border-radius="10px 10px 0 0">
			<view class="prop">
			<image src="/static/index/error.png" ></image>
				<text>{{msg}}</text>
					<button @tap="successbvideo_close " type="primary">返回</button>
				
			</view>
		</uni-popup>
		<uni-popup ref="success" type="bottom" border-radius="10px 10px 0 0">
			<view class="prop">
			<image src="/static/index/success.png" ></image>
				<text>{{msg}}</text>
					<button @tap="successbvideo_toMap " type="primary">完成</button>
				
			</view>
		</uni-popup>
		
		
    </view>

	<!-- 下一个房间页面按钮 -->
	
    <button  v-if="roomCount+1-MaxCount==0" class="submit-btn" @tap="NextRoom">提交信息</button>
    <button  v-else class="submit-btn" @tap="NextRoom">下一步</button>
    <button class="submit-btn" @tap="ReturnRoom">上一步</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
		  roomdata:{
			  RoomNumber:'',
			  RoomAddress: '',        
			  RoomArea: '',
			  RoomType: '',
			  RoomPayment:{
				  '月付': 0,
				  '半年付': 0,
				  '年付': 0
				},
			  RoomFurniture:  [false, false, false, false,false,false,false],
			  RoomVideo: []// 提取文件路径
		  },
		roomCount:null,
		MaxCount:null,
        houseName:["浴缸","花洒","冰箱","空调","微波炉","洗衣机","油烟机"],
		filepath:null,
		msg:null
      }
    },
	onLoad() {
		this.roomCount =  this.$store.state.currentRoomIndex
		this.MaxCount  =  this.$store.state.baseInfo.count
		console.log("onLoad")
		console.log(this.$store.state.rooms)
		if(this.$store.state.rooms[this.roomCount] !=null)
		{
			this.roomdata  =  this.$store.state.rooms[this.roomCount]  
			
		}
		
	},
	onUnload() {
		// 准备提交给后端的数据
			// console.log("houseData")
		 // const houseData = {
		 //   RoomNumber: this.roomdata.RoomNumber, 
		 //   RoomAddress: this.roomdata.RoomAddress,          
		 //   RoomArea: this.roomdata.RoomArea,
		 //   RoomType: this.roomdata.RoomType,
		 //   RoomPayment: this.roomdata.RoomPayment,
		 //   RoomFurniture: this.roomdata.RoomFurniture,
		 //   RoomVideo: this.uid // 提取文件路径
		 // };
		 console.log(this.roomdata)
		 if(this.roomdata.RoomNumber.trim()!=null||this.roomdata.RoomAddress.trim()!=null||this.roomdata.RoomType.trim()!=null)
		 {
			 	this.$store.commit('UPDATE_ROOM',{index:this.roomCount,data:this.roomdata})
		 }
	
	},
    methods: {
		//跳转上一个房间
		ReturnRoom(){
		if(this.roomCount+1>1)
		{
			this.$store.commit('SET_CURRENT_ROOM_INDEX',this.roomCount-1)
			uni.redirectTo({
				url:"/pages/marker/addMarker/NextRoom"
			})
		}else{
			uni.redirectTo({
				url:"/pages/marker/addMarker/addMarker"
			})
		}
		
		},
		//跳转下一个房间
		NextRoom(){
			if(this.roomCount+1<this.MaxCount)
			{	console.log(this.roomdata)
				if(this.roomdata.RoomNumber.trim()!=null&&this.roomdata.RoomAddress.trim()!=null&&this.roomdata.RoomType.trim())
				{
				
					this.$store.commit('SET_CURRENT_ROOM_INDEX',this.roomCount+1)
					uni.redirectTo({
						url:"/pages/marker/addMarker/NextRoom"
					})
				}else{
					this.msg = "当前房间未完成填写"
					this.$refs.error.open("center")
				}
				
			}else{
				this.msg = "当前房间已经为最后一个房间！"
				this.$refs.error.open("center")
			}
			
		},
		//删除视频路径
		deleteFilePath(index){
			this.filepath.splice(index, 1)
		},
		//点击家具
		onhouse(index){
			this.roomdata.RoomFurniture[index] = !this.roomdata.RoomFurniture[index];
		},
		//关闭弹窗
		successbvideo_close(){
			 this.$refs.error.close('center');
		},
		successbvideo_toMap(){
			 this.$refs.success.close('center');
			  uni.navigateTo({
			               	url:"/pages/map/map"
			               })
		},
		//上传视频
		selectvideo(){
			if(filepath.length<3)
			{
				// 将视频选择完毕后的路径保存并展示出
				var flag  = true
				wx.chooseMedia({
					count:3,
					mediaType:["video"],
					maxDuration:60,
					success:(res)=> {
						console.log("chooseMedia_Success")
						console.log(res.tempFiles[0].size/1048576)
						this.filepath.push(...res.tempFiles)
						
					},
					fail:(res)=>{
						console.log("chooseMedia")
						flag=false	
					}
				})
				if(flag){
					
				}
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
                this.RoomAddress = res.name;
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
              if (key && !this.RoomFurniture[key]) {
                this.$set(this.RoomFurniture, key, 0);
              }
            }
          }
        });
      },
      
      // 提交房源信息
      submitHouseInfo() {
		  
		  // 1. 位置信息验证
		   if (!this.RoomAddress || !this.longitude || !this.latitude) {
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
		   if (!this.RoomType) basicInfoErrors.push('房型信息');
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
		   const validPayments = Object.values(this.RoomFurniture)
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
			    address: this.RoomAddress,          
			    title: this.title,
			    location: this.location,        // 具体地点
			    area: this.area.toString(),
			    RoomType: this.RoomType,
			    roomCount: parseInt(this.count), // 转换为整数
			    wechat: this.wechat.toString(),
			    phone: this.phone.toString(),
			    RoomFurniture: this.RoomFurniture,
			    RoomFurniture: this.RoomFurniture,
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
      // processRoomFurniture() {
      //   const processed = {};
      //   for (const [key, value] of Object.entries(this.RoomFurniture)) {
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