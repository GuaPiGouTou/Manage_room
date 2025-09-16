<template>
	<view>
		room
		<editor></editor>
		<!-- 下一步按钮 -->
		<button class="submit-btn" @tap="returnMarker">下一步</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			returnMarker(){
				uni.navigateBack()
			}
		}
	}
</script>

<style>

</style>
