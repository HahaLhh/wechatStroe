// pages/goods_list/index.js
import request from "../../request/http.js"
Page({
	data: {
		//轮播图数组
		swiperList: [] ,
		//分类导航数组
		navigatorList:[],
		//楼层数据数组
		floorDataList:[]

	},  
	onLoad: function (options) {
		//调用轮播图事件
		this.getSwiperArray()   
		//调用分类导航
		this.getNavigationArray() 
		//调用楼层数据 
		this.getfloorDataArray() 
	},     
	//请求轮播图数据   
	getSwiperArray(){     
		request({  
			url:"/home/swiperdata",
		}).then(res =>{ 
			this.setData({
				swiperList : res.data.message
			})  
		}).catch(rej =>{ 
			console.log(rej)
		})   
	},  
	//请求分类导航数据 
	getNavigationArray(){   
		request({ 
			url:"/home/catitems"
		}).then(res =>{
			this.setData({
				navigatorList:res.data.message
			})
			
		})
	},
	//请求楼层数据 
	getfloorDataArray(){
		request({
			url:"/home/floordata"
		}).then(res =>{
			this.setData({
				floorDataList:res.data.message
			})
			
		})
	}
})   