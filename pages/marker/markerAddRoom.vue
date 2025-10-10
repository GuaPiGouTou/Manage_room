<template>
  <view class="container">
  

    <!-- 房源基本信息 -->
    <view class="section">
      <view class="section-title">房间信息</view>
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
        <text class="payment-label">{{key=="monthly"?"月付":key=="quarterly"?"半年付":"年付"}}</text>
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
	     v-for="(item,index) in this.filepath" 
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
    <button  class="submit-btn" @tap="submitHouseInfo">提交信息</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
		  submitflag:false,
		  roomdata:{
			  RoomNumber:'',
			  RoomAddress: '',        
			  RoomArea: '',
			  RoomType: '',
			  RoomPayment:{
				  'monthly': 0,
				  'quarterly': 0,
				  'yearly': 0
				},
			  RoomFurniture:  [false, false, false, false,false,false,false],
			  RoomVideo: [],// 提取文件路径
			  PropertyId:0
		  },
		roomCount:null,
		MaxCount:null,
        houseName:["浴缸","花洒","冰箱","空调","微波炉","洗衣机","油烟机"],
		filepath:[],
		msg:null,
		PropertyId:0
      }
    },
	onLoad(res) {
		this.roomdata.PropertyId = res.id
		this.PropertyId = res.id
	},
	
    methods: {

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
			  uni.redirectTo({
			               	url:"/pages/marker/marker"
			               })
		},
		//上传视频
		selectvideo(){
			if(this.roomdata.RoomVideo.length<3)
			{
				// 将视频选择完毕后的路径保存并展示出
				var flag  = true
				wx.chooseMedia({
					count:3,
					mediaType:["video"],
					maxDuration:60,
					success:(res)=> {
						
						console.log(res.tempFiles[0].size/1048576)
						this.filepath.push(...res.tempFiles)		
						
					},
					fail:(res)=>{
						flag=false	
					}
				})
				if(flag){
					
				}
			}
			
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
		   //验证信息
		  if(!this.roomsVerify()) return;
		  this.submitVideo().then(()=>{
			  // 上传表单
			  	console.log("-----submit----")
			  console.log(this.roomdata)
			  this.sumbit()
		  })
			
	
			  
      
      },
	  //视频上传
	async  submitVideo(){
		   uni.showLoading({ title: '视频上传中...', mask: true });
			let files= []
			  //视频上传
			  					  const that = this;
			  						for(let i = 0;i<that.filepath.length;i++)
			  						{
			  							let p = wx.cloud.uploadFile({
			  							cloudPath:"map/"+this.title+i+".mp4",
			  							filePath:that.filepath[i].tempFilePath,
			  							 config: {
			  								env: 'prod-7g3ji5ui73a4702f' // 微信云托管环境ID
			  							  },
			  							  success(res){
			  									console.log("uploadFile_success")
			  									that.roomdata.RoomVideo[i] = res.fileID
												
			  							
			  							  },
			  								fail(res){
			  									console.log("uploadFile_fail")
			  									
			  									}
			  						})	
									files.push(p)
			  						}

			
			await Promise.all(files)
			uni.hideLoading();
			uni.showToast({
				title:"上传成功",
				icon:'success'
			})  
		
	  },
	  
	
	 
	
	 //房间信息验证模块
	 roomsVerify(){
			// //1.所有房间支付选项验证
	
		   
		   	const validPayments = Object.values(this.roomdata.RoomPayment)
		   	  .filter(amount => amount > 0);
		   	
		   	if (validPayments.length === 0) {
		   	  uni.showToast({
		   		title: '请至少设置一种有效的支付价格',
		   		icon: 'none',
		   		duration: 3000
		   	  });
		   	   return false;
		   	}
			
			// 2. 媒体文件验证i
			
			if (this.filepath.length === 0) {
			  uni.showToast({
				title: '请至少上传一个视频文件',
				icon: 'none',
				duration: 3000
			  });
			  console.log("请至少上传一个视频文件")
			  return false;
			}
			return true;
		   
		   
		 
	 },
	 //上传表单信息
	 sumbit(){
		
		
		 const res = wx.cloud.callContainer({
		     "config": {
		       "env": "prod-7g3ji5ui73a4702f"
		     },
		     "path": "/api/room/insert",
		     "header": {
		       "X-WX-SERVICE": "springboot-2wum",
		       "content-type": "application/json"
		     },
		     "method": "POST",
		     "data": this.roomdata
		 	
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
		 
	 }
	 
	  
	  
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