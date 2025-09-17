<template>
  <view class="login-container">
    <!-- 顶部LOGO区域 -->
    <view class="login-header">
      <image class="logo" src="/static/logo.png"></image>
      <text class="app-name">房源管理助手</text>
    </view>
  
 
    <!-- 微信授权登录 -->
	<view style="background-color: beige; border-radius: 300px;">
		<button type="primary"  style="border-radius: 30rpx;" @tap="openLoing">微信授权登录</button>
		<button type="primary"  style="border-radius: 30rpx;" @tap="ToMap1()">add</button>
	</view>
	<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">
		
		<view class="prop">
		<image src="/static/index/success.png" ></image>
			<text>{{msg}}</text>
				<button @tap="ToMap" type="primary">进入主页</button>
				
				
		</view>
	</uni-popup>
	<!-- <button @tap="ToMap1" type="primary">进入</button> -->
  </view>
</template>

<script>
  export default {
    data() {
      return {
        title: '登录页面',
        showAccountLogin: false, // 是否显示账号登录表单
        account: '', // 账号
        password: '', // 密码
        agreement: false, // 是否同意协议
        canUsePhone: false, // 是否支持手机号授权
        isLandlord: false, // 是否为房东
		msg:"提示信息"
      }
    },
    onLoad() {
	 // 初始化云开发
	  wx.cloud.init({
	    env: 'prod-7g3ji5ui73a4702f', // 替换为你的实际环境ID
	    traceUser: true // 是否记录用户访问
	  })
    },
    methods: {
		ToMap1(){
			uni.redirectTo({
				url:"/pages/marker/addMarker/addMarker"
			})
		},
		openr(){
			this.msg = "成功登录"
			this.$refs.popup.open('center')
		},
		openLoing(){
			wx.login({
				success: (res) => {
					console.log(res.code)
					// 微信登录
					if (res.code) {
					  // 发送code到后端服务器
					uni.request({
						url:"https://api.weixin.qq.com/sns/jscode2session",
						method:'GET',
						data:{
							appid:"wxb987e736434c92bd",
							secret:"c3bec3b7409f9c4f4bdc83f1197515a2",
							js_code:res.code,
							grant_type:"authorization_code"
						},
						success:(res)=> {
							console.log(res)
							wx.setStorageSync('session_key', res.data.session_key);
							wx.setStorageSync('openid', res.data.openid)	
							this.msg = "成功登录"
							this.$refs.popup.open('center')
						},fail(res) {
							console.log(res)
						}
						
					})
					}},
				fail: (res) => {console.log(res)}
			})
		},  
	
	  ToMap(){
		uni.redirectTo({
			url:"/pages/map/map"
		})
	  }
    }
  }
</script>

<style scoped>
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
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx;
    min-height: 100vh;
    background-color: #f7f7f7;
  }
  
  .login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100rpx;
    margin-bottom: 80rpx;
  }
  
  .logo {
    height: 160rpx;
    width: 160rpx;
    border-radius: 24rpx;
  }
  
  .app-name {
    font-size: 40rpx;
    font-weight: bold;
    margin-top: 20rpx;
    color: #333;
  }
  
  .login-form, .wechat-login {
    width: 100%;
    padding: 0 40rpx;
    box-sizing: border-box;
  }
  
  .form-item {
    display: flex;
    align-items: center;
    height: 100rpx;
    background: #ffffff;
    border-radius: 12rpx;
    padding: 0 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  }
  
  .input {
    flex: 1;
    height: 100rpx;
    margin-left: 20rpx;
    font-size: 32rpx;
  }
  
  .placeholder {
    color: #cccccc;
  }
  
  .login-btn {
    background-color: #07C160;
    color: #ffffff;
    font-size: 34rpx;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;
    margin-top: 20rpx;
  }
  
  .wechat-login-btn {
    background-color: #07C160;
    color: #ffffff;
    font-size: 34rpx;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .wechat-login-btn text {
    margin-left: 15rpx;
  }
  
  .login-switch {
    text-align: center;
    font-size: 28rpx;
    color: #07C160;
    margin-top: 40rpx;
    padding: 20rpx;
  }
  
  .agreement {
    position: fixed;
    bottom: 60rpx;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    color: #666;
  }
  
  .agreement-link {
    color: #07C160;
    margin-left: 8rpx;
  }
  
  /* 按钮激活状态 */
  button:active {
    opacity: 0.8;
  }
  
  /* 去除微信小程序按钮的默认样式 */
  button::after {
    border: none;
  }
  
  /* 按钮禁用样式 */
  button[disabled] {
    background-color: #cccccc !important;
    color: #999 !important;
  }
</style>