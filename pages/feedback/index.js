// pages/feedback/index.js
import {
	getSetting,
	chooseAddress,
	openSetting,
	showModal,
	showToast,
	requestPayment
} from "../../untils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tabs: [{
				id: 0,
				value: "体验问题",
				isActive: true
			},
			{
				id: 1,
				value: "商品、商家投诉",
				isActive: false
			}
		],
		// 被选中添加的图片路径 数组 
		chooseImgs: [],
		// 文本域的内容
		textVal: "",
		// 外网的图片的路径数组
		UpLoadImgs: [],
	},
	//tab栏点击
	handleTabsItemChange(e) {
		// 1 获取被点击的标题索引
		const {
			index
		} = e.detail;
		// 2 修改源数组
		let {
			tabs
		} = this.data;
		tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
		// 3 赋值到data中
		this.setData({
			tabs
		})
	},
	//文本域触发事件
	handleTextInput(e) {
		this.setData({
			textVal: e.detail.value
		})
	},
	//添加图片 
	handleChooseImg() {
		// 2 调用小程序内置的选择图片api
		wx.chooseImage({
			// 同时选中的图片的数量
			count: 9,
			// 图片的格式  原图  压缩
			sizeType: ['original', 'compressed'],
			// 图片的来源  相册  照相机
			sourceType: ['album', 'camera'],
			success: (result) => {

				this.setData({
					// 图片数组 进行拼接 
					chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
				})
			}
		})
	},
	//删除图片时
	handleRemoveImg(e) {
		//获取index值
		const {
			index
		} = e.currentTarget.dataset
		//获取数组
		let {
			chooseImgs
		} = this.data
		//找出数组中对应的索引值 进行删除
		chooseImgs.splice(index, 1)
		//保存
		this.setData({
			chooseImgs
		})

	},
	//提交
	async handleFormSubmit() {
		//获取文本域文本 和 上传图片数组
		const {
			textVal,
			chooseImgs
		} = this.data;
		//对文本进行合法性的验证 
		if (!textVal.trim()) {
			//不合法
			await showToast({
				title: "输入不合法"
			})
			return
		}
		//通过验证   loding弹窗
		wx.showLoading({
			title: "正在后台上传中",
			mask: true,
		});
		//选中上传的图片到服务器 返回图片外网连接
		//将文本和获得的外网图片链接再次上传服务器 前端模拟
		// 判断有没有需要上传的图片数组
		if (chooseImgs.length != 0) {
			// 	// 上传文件的 api  wx.uploadFile()不支持 多个文件同时上传  遍历数组 挨个上传 
			// 	chooseImgs.forEach((v, i) => {
			// 		wx.uploadFile({
			// 			// 图片要上传到哪里
			// 			// url: 'https://images.ac.cn/Home/Index/UploadAction/',
			// 			url: 'https://images.ac.cn/api/open/imageList/1a1dc5e3eaafb4bbc8a40eccc9e3/HOME ',
			// 			// 被上传的文件的路径
			// 			filePath: v,
			// 			// 上传的文件的名称 后台来获取文件  可自定义
			// 			name: "file",
			// 			// 顺带的文本信息
			// 			formData: {},
			// 			success: (result) => {
			// 				//获得外网图片路径
			// 				console.log(result);
			// 				let url = JSON.parse(result.data).url;
			// 				//添加到外网路径数组
			// 				this.UpLoadImgs.push(url);

			// 				// 所有的图片都上传完毕了才触发  
			// 				if (i === chooseImgs.length - 1) {
			// 					wx.hideLoading();
			// 					console.log("把文本的内容和外网的图片数组 提交到后台中");
			// 					//  提交都成功了
			// 					// 重置页面
			// 					this.setData({
			// 						textVal: "",
			// 						chooseImgs: []
			// 					})
			// 					// 返回上一个页面
			// 					wx.navigateBack({
			// 						delta: 1
			// 					});

			// 				}
			// 			}
			// 		});
			// 	})
			//模拟成功 
			wx.hideLoading();
			await showToast({
				title: "提交成功"
			})
			// 重置页面
			this.setData({
				textVal: "",
				chooseImgs: []
			})
			// 返回上一个页面
			wx.navigateBack({
				delta: 1
			});
		} else {
			wx.hideLoading();

			console.log("只是提交了文本");
			wx.navigateBack({
				delta: 1
			});

		}
	}
})