// pages/user/index.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userinfo:{},
		collectNums:0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onShow: function (options) {
		//获取用户信息
		const userinfo = wx.getStorageSync("userinfo");
		const collect = wx.getStorageSync("collect");
		this.setData({
			userinfo,collectNums:collect.length
		})
	},

})