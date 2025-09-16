<!-- pages/agreement/index.vue -->
<template>
  <view class="agreement-page">
    <view class="header">
      <text class="title">用户协议及隐私政策</text>
      <uni-icons type="closeempty" size="28" @click="goBack"></uni-icons>
    </view>
    <scroll-view scroll-y class="content">
      <!-- 这里放置实际的协议内容 -->
      <text class="section-title">一、总则</text>
      <text class="text">
        1. 本协议是用户（以下简称"用户"）与房源管理助手小程序（以下简称"本平台"）之间关于使用本平台服务所订立的协议。
        2. 用户在注册及使用本平台前应仔细阅读本协议，并按照页面提示完成注册程序。如用户不同意本协议，请立即停止注册或停止使用本平台服务。
      </text>
      
      <text class="section-title">二、服务内容</text>
      <text class="text">
        1. 本平台提供房源信息管理、发布、浏览等服务。
        2. 房东可以通过本平台管理自己的房源信息。
        3. 用户可以浏览平台上的房源信息。
      </text>
      
      <!-- 添加更多协议内容 -->
    </scroll-view>
    
    <view class="footer">
      <button class="agree-btn" @click="goBack">我知道了</button>
    </view>
  </view>
</template>

<script>
  export default {
    methods: {
      goBack() {
        uni.navigateBack();
      }
    }
  }
</script>

<style scoped>
  .agreement-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 30rpx;
    background-color: #fff;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 30rpx;
    border-bottom: 1rpx solid #eee;
  }
  
  .title {
    font-size: 38rpx;
    font-weight: bold;
    color: #333;
  }
  
  .content {
    flex: 1;
    margin-top: 30rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
  }
  
  .section-title {
    display: block;
    font-size: 34rpx;
    font-weight: bold;
    margin: 40rpx 0 20rpx;
    color: #333;
  }
  
  .text {
    display: block;
    font-size: 30rpx;
    line-height: 1.6;
    color: #666;
    margin-bottom: 20rpx;
  }
  
  .footer {
    padding: 30rpx 0;
  }
  
  .agree-btn {
    background-color: #07C160;
    color: #ffffff;
    font-size: 34rpx;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;
  }
</style>