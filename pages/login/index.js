// pages/login/index.js
Page({
	handleGetUserInfo(e){
		const {userInfo} = e.detail;
		wx.setStorageSync("userinfo", userInfo);
		//返回上个页面
		wx.navigateBack({
			delta:1
		});	
	}
})