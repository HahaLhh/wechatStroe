// pages/category/index.js 
import request from "../../request/http"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
	data: {
		//左侧菜单数据
		leftMenuList: [],
		//右侧商品数据
		rightContent: [],
		//左侧菜单被选中
		currentIndex: 0,
		//右侧商品列表滚动条距离顶部距离  scroll-top
		scrollTopPrice: 0
	},
	//保存请求返回的数据
	Cates: [],
	onLoad: function (options) {
		// 对数据进行缓存处理 判断是否有本地缓存数据 缓存是否过期

		//对本地缓存判断是否存在
		const Cates = wx.getStorageSync("cates")
		const timestamp = wx.getStorageSync("timestamp")
		if (!Cates) {
			//本地缓存不存在 重新请求数据
			console.log('本地无缓存')
			this.getCates();
		} else {
			//存在本地缓存 判断本地缓存是否过期  过期事件 十秒
			if (Date.parse(new Date()) - timestamp >10000) {
				//缓存过期
				console.log("缓存过期");

				this.getCates();
			} else {
				//使用本地缓存	
				console.log("使用本地缓存");

				this.Cates = Cates
				// 渲染数据
				// 左侧菜单数据
				let leftMenuList = this.Cates.map(v => v.cat_name);
				//右侧商品数据
				let rightContent = this.Cates[0].children;
				this.setData({
					leftMenuList,
					rightContent
				})
			}

		}
	},
	//获取数据 
	// getCates() {
	// 	request({
	// 		url: '/categories'
	// 	}).then(res => {
	// 		this.Cates = res.data.message;
	// 		//将接口返回的数据存储到本地缓存中
	// 		wx.setStorageSync("cates", this.Cates);
	// 		// 存储过期时间
	// 		let timestamp = Date.parse(new Date()) + 10000
	// 		wx.setStorageSync("timestamp", timestamp)


	// 		//左侧菜单数据
	// 		let leftMenuList = this.Cates.map(v => v.cat_name);
	// 		//右侧商品数据
	// 		let rightContent = this.Cates[0].children;
	// 		this.setData({
	// 			leftMenuList,
	// 			rightContent
	// 		})
	// 	})
	// },

	//使用es7 async改写getCates()
	async getCates(){
		//使用await 发送请求
		const res = await request({
			url: "/categories"
		});
		this.Cates = res.data.message;
		// this.Cates = res;
		//将接口返回的数据存储到本地缓存中
		
		wx.setStorageSync("cates", this.Cates);
		// 存储当前时间
		let timestamp = Date.parse(new Date()) 
		wx.setStorageSync("timestamp", timestamp)


		//左侧菜单数据
		let leftMenuList = this.Cates.map(v => v.cat_name);
		//右侧商品数据
		let rightContent = this.Cates[0].children;
		this.setData({
			leftMenuList,
			rightContent
		})
	},
	//左侧菜单选中事件
	handleItemTap(e) {
		//选中中重新加载右侧商品数据
		let goodsIndex = e.currentTarget.dataset.index
		let rightContent = this.Cates[goodsIndex].children;
		this.setData({
			currentIndex: goodsIndex,
			rightContent,
			//设置右侧商品列表  距离顶部值 
			scrollTopPrice: 0
		})
	}
})