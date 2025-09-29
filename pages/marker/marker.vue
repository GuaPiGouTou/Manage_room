<template>
  <view class="property-container">
	
    <!-- 顶部标题 -->
      <view class="header">
        <text class="title">{{ baseInfo.title || '未命名小区' }}</text>
        <text class="location">{{ baseInfo.location }}</text>
      </view>
      
      <!-- 小区基本信息卡片 -->
      <view class="info-card base-info">
        <view class="card-header">
          <text class="card-title">小区基本信息</text>
        </view>
        
        <view class="info-grid">
          <view class="info-item">
            <text class="info-label">地址:</text>
            <text class="info-value">{{ baseInfo.address || '暂无数据' }}</text>
          </view>
          
          <view class="info-item">
            <text class="info-label">面积:</text>
            <text class="info-value">{{ baseInfo.area || '0' }}㎡</text>
          </view>
          
          <view class="info-item">
            <text class="info-label">联系电话:</text>
            <text class="info-value">{{ baseInfo.phone || '暂无数据' }}</text>
          </view>
          
          <view class="info-item">
            <text class="info-label">微信:</text>
            <text class="info-value">{{ baseInfo.wechat || '暂无数据' }}</text>
          </view>
		  <view>
			  	<button type="primary" @click="insert_room(this.propertyId)">添加房间</button>
		  </view>
        </view>
      </view>
	  
	   <!-- 房间列表 -->
	      <view  class="info-card room-list">
	        <view class="card-header">
	          <text class="card-title" @tap="room">房源信息 ({{ baseInfo.roomcount }}间)</text>
	        </view>
	     
	        <!-- 房间卡片 -->
	       <view 
	          v-for="(room, index) in baseInfo.room" 
	          :key="index" 
	          class="room-card"
	        >
	          <view class="room-header">
	            <text class="room-number">{{ room.roomNumber || '未编号' }}</text>
	            <text class="room-type">{{ room.roomType || '未分类' }}</text>
	          </view>
	          
	          <view class="room-details">
	            <view class="detail-item">
	              <text class="detail-label">地址:</text>
	              <text class="detail-value">{{ room.roomAddress || '同小区地址' }}</text>
	            </view>
	            
	            <view class="detail-item">
	              <text class="detail-label">面积:</text>
	              <text class="detail-value">{{ room.roomArea || '0' }}㎡</text>
	            </view>
	            
	            <view class="detail-item">
	              <text class="detail-label">支付方式:</text>
	              <text class="detail-value">
	                {{ formatPayment(room.roomPayment) }}
	              </text>
	            </view>
	            
	            <view class="detail-item">
	              <text class="detail-label">家具配置:</text>
	              <text class="detail-value">
	                {{ formatFurniture(room.roomFurniture) }}
	              </text>
	            </view>
				<view >
					<button type="warn"  @click="delete_room(room.roomId,index)">删除房间</button>
				
				</view>
	          </view>
	          
	          <!-- 视频预览 -->
	        
	        </view>
	      </view>
	
  </view>
</template>

<script>
export default {
  data() { 
    return {
		propertyId:1,
      baseInfo: {
        address: '',
        longitude: 0,
        latitude: 0,
        wechat: '',
        phone: '',
        title: '',
        location: '',
        area: '',
        roomcount: 0,
        room: [{
        roomId: 101,
        roomNumber: "101",
        roomAddress: "主卧",
        roomArea: 45.5,
        roomType: "主卧室",
        roomPayment: {
          monthly: 8000,
          quarterly: 22000,
          yearly: 80000
        },
        roomFurniture: [true, true, true, false],
        roomVideo: ["video1", "video2"],
        propertyId: 1
      }]
      }
    }
  },
  created() {
    // 这里应该是从API或store获取数据
  
  },
  onLoad(res) {
  	console.log(res)
	this.propertyId = res.id
	this.getHouse(res.id)
  },
  methods: {
	  insert_room(id){
		  console.log(id)
		  uni.navigateTo({
		  	url:"/pages/marker/markerAddRoom?id="+id
		  })
	  },
	  delete_room(roomId,index){
		  console.log(roomId)
		  const res = wx.cloud.callContainer({
			  "config": {
			    "env": "prod-7g3ji5ui73a4702f"
			  },
			  "path": "/api/room/delete?RoomId="+roomId,
			  "header": {
			    "X-WX-SERVICE": "springboot-2wum",
			    "content-type": "application/json"
			  },
			  "method": "GET"
		  })
		  res.then((res)=>{
			  console.log(res)
			  	if(res.data.code ==="200")
				{
					uni.showToast({
						title:"删除成功！",
						icon:"success"
					})
					this.getHouse(this.propertyId)
					
				}else{
					uni.showToast({
						title:"删除失败！",
						icon:"error"
					})
				}
			
		  })
	  },
	  room(){
		console.log(this.baseInfo.room)  
	  },
	  apiget(){
		  this.baseInfo.title = "xxxx"
		  
	  },
	  getHouse(id){
		  const succ =  wx.cloud.callContainer({
		    "config": {
		      "env": "prod-7g3ji5ui73a4702f"
		    },
		    "path": "/api/house/gethouse?id="+39,
		    "header": {
		      "X-WX-SERVICE": "springboot-2wum",
		      "content-type": "application/json"
		    },
		    "method": "GET"
		  })
		  console.log(succ)
		  succ.then((res)=>{
		  	if(res.data.code ==="200")
		  	 this.baseInfo = res.data.data
		  	 
		  	console.log(this.baseInfo)})
		  
     
    },
	 formatPayment(payment) {
	      if (!payment) return '暂无数据'
	      const methods = []
		  console.log(payment)
	      if (payment.monthly) methods.push(`月付: ¥${payment.monthly}`)
	      if (payment.quarterly) methods.push(`半年付: ¥${payment.quarterly}`)
	      if (payment.yearly) methods.push(`年付: ¥${payment.yearly}`)
	      return methods.join(' / ') || '价格面议'
	    },
	    
	    formatFurniture(furniture) {
	      if (!furniture || !furniture.length) return '无'
	      const items = ["浴缸","花洒","冰箱","空调","微波炉","洗衣机","油烟机"]
	      return furniture
	        .map((hasItem, index) => hasItem ? items[index] : null)
	        .filter(Boolean)
	        .join('、') || '基础配置'
	    },
	    
	    previewVideo(videoUrl) {
	      uni.previewVideo({
	        current: 0,
	        urls: [videoUrl]
	      })
	    }
    
    
  }
}
</script>

<style>
/* 基础样式 */
.property-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  padding: 30rpx 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.location {
  font-size: 28rpx;
  color: #666;
}

/* 卡片样式 */
.info-card {
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  padding: 0 20rpx 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

/* 基本信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding-top: 20rpx;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 6rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333;
}

/* 房间卡片 */
.room-card {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #f9f9f9;
  border-radius: 12rpx;
  border: 1rpx solid #eee;
}

.room-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15rpx;
  padding-bottom: 10rpx;
  border-bottom: 1rpx dashed #ddd;
}

.room-number {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.room-type {
  font-size: 26rpx;
  color: #666;
  background-color: #e6f7ff;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

/* 房间详情 */
.room-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15rpx;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 26rpx;
  color: #888;
}

.detail-value {
  font-size: 28rpx;
  color: #333;
  word-break: break-all;
}

/* 视频区域 */
.video-section {
  margin-top: 20rpx;
  padding-top: 15rpx;
  border-top: 1rpx dashed #ddd;
}

.section-title {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 10rpx;
}

.video-thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.video-thumb {
  width: 200rpx;
  height: 120rpx;
  background-color: #f0f0f0;
  border-radius: 8rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.video-icon {
  width: 60rpx;
  height: 60rpx;
  opacity: 0.7;
}

.video-index {
  font-size: 24rpx;
  color: #666;
  margin-top: 10rpx;
}

/* 响应式调整 */
@media (min-width: 768px) {
  .property-container {
    max-width: 750px;
    margin: 0 auto;
  }
  
  .info-grid, .room-details {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>