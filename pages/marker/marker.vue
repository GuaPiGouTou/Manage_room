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
      </view>
    </view>
    
    <!-- 房间列表 -->
    <view class="info-card room-list">
      <view class="card-header">
        <text class="card-title">房源信息 ({{ baseInfo.room.length }}间)</text>
      </view>
      
      <!-- 房间卡片 -->
      <view 
        v-for="(room, index) in baseInfo.room" 
        :key="index" 
        class="room-card"
      >
        <view class="room-header">
          <text class="room-number">{{ room.RoomNumber || '未编号' }}</text>
          <text class="room-type">{{ room.RoomType || '未分类' }}</text>
        </view>
        
        <view class="room-details">
          <view class="detail-item">
            <text class="detail-label">地址:</text>
            <text class="detail-value">{{ room.RoomAddress || '同小区地址' }}</text>
          </view>
          
          <view class="detail-item">
            <text class="detail-label">面积:</text>
            <text class="detail-value">{{ room.RoomArea || '0' }}㎡</text>
          </view>
          
          <view class="detail-item">
            <text class="detail-label">支付方式:</text>
            <text class="detail-value">
              {{ formatPayment(room.RoomPayment) }}
            </text>
          </view>
          
          <view class="detail-item">
            <text class="detail-label">家具配置:</text>
            <text class="detail-value">
              {{ formatFurniture(room.RoomFurniture) }}
            </text>
          </view>
        </view>
        
        <!-- 视频预览 -->
        <view v-if="room.RoomVideo.length" class="video-section">
          <text class="section-title">房间视频 ({{ room.RoomVideo.length }}个)</text>
          <view class="video-thumbnails">
            <view 
              v-for="(video, idx) in room.RoomVideo" 
              :key="idx" 
              class="video-thumb"
              @click="previewVideo(video)"
            >
              <image 
                src="/static/video-icon.png" 
                mode="aspectFill"
                class="video-icon"
              />
              <text class="video-index">视频 {{ idx + 1 }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
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
        room: []
      }
    }
  },
  created() {
    // 这里应该是从API或store获取数据
    this.loadPropertyData()
  },
  methods: {
    loadPropertyData() {
      // 模拟数据加载
      this.baseInfo = {
        address: '北京市朝阳区朝阳公园路8号',
        longitude: 116.480881,
        latitude: 39.933363,
        wechat: 'example_wechat',
        phone: '13800138000',
        title: '朝阳花园小区',
        location: '朝阳区CBD核心区',
        area: '50000',
        roomcount: 2,
        room: [
          {
            RoomNumber: 'A-101',
            RoomAddress: '1号楼101室',
            RoomArea: 85,
            RoomType: '两室一厅',
            RoomFurniture: [true, false, true, true, false, false, true],
            RoomVideo: ['video1.mp4', 'video2.mp4'],
            RoomPayment: {
              monthly: '5000',
              quarterly: '4800',
              yearly: '4500'
            }
          },
          {
            RoomNumber: 'B-202',
            RoomAddress: '2号楼202室',
            RoomArea: 120,
            RoomType: '三室一厅',
            RoomFurniture: [true, true, true, true, true, false, true],
            RoomVideo: ['video3.mp4'],
            RoomPayment: {
              monthly: '8000',
              quarterly: '7500',
              yearly: '7000'
            }
          }
        ]
      }
    },
    
    formatPayment(payment) {
      if (!payment) return '暂无数据'
      const methods = []
      if (payment.monthly) methods.push(`月付: ¥${payment.monthly}`)
      if (payment.quarterly) methods.push(`季付: ¥${payment.quarterly}`)
      if (payment.yearly) methods.push(`年付: ¥${payment.yearly}`)
      return methods.join(' / ') || '价格面议'
    },
    
    formatFurniture(furniture) {
      if (!furniture || !furniture.length) return '无'
      const items = ['床', '沙发', '餐桌', '衣柜', '电视', '冰箱', '洗衣机']
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