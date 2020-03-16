// pages/goods_detail/index.js
import request from "../../request/http.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		//页面数据
		goodsDetailList: [],
		//收藏icon是否选中
		isCollect: false,
	},

	//全局商品数据
	goodsObj: [],

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//获取页面参数 
		const {
			goods_id
		} = options;
		//进行页面请求数据
		this.getGoodsDetailData(goods_id)

		//获取缓存中的收藏商品数组
		let collect = wx.getStorageSync("collect") || [];
		//判断商品是否被收藏过了
		let index = collect.findIndex(v => v.goods_id == goods_id);
		
		if (index !== -1) {
			//index!= -1  已经收藏
			this.setData({
				isCollect: true
			})
		}
	},
	onShow: function () {


	},
	//获取数据
	async getGoodsDetailData(goods_id) {
		const res = await request({
			url: "/goods/detail",
			data: {
				goods_id
			}
		})
		//定义全局商品数据
		const goodsDetailList = res.data.message
		this.goodsObj = goodsDetailList;
		this.setData({
			goodsDetailList: {
				goods_name: goodsDetailList.goods_name,
				goods_price: goodsDetailList.goods_price,
				// iphone部分手机 不识别 webp图片格式 
				// 1.webp => 1.jpg  
				goods_introduce: goodsDetailList.goods_introduce.replace(/\.webp/g, '.jpg'),
				pics: goodsDetailList.pics
			}
		})

	},
	//轮播图点击事件 放大预览
	handlePrevewImage(e) {
		//1.构造想要预览的图片数组
		const urls = this.goodsObj.pics.map(v => v.pics_mid)
		//2.接收时间传递的图片url
		const current = e.currentTarget.dataset.url;
		wx.previewImage({
			// 当前显示图片的链接 预览显示的第一张图片
			current,
			//需要预览的图片链接列表
			urls,
		});
	},
	//加入购物车
	handleCartAdd() {
		//    获取缓存中的购物车数据 数组格式
		let cart = wx.getStorageSync("cart") || [];
		//    先判断 当前的商品是否已经存在于购物车
		let index = cart.findIndex(v =>
			//购物车缓存中的goods_id是否已经存在
			v.goods_id === this.goodsObj.goods_id
		)

		if (index === -1) {
			//    不存在于购物车的数组中 直接给购物车数组添加一个购买数量属性 num  重新把购物车数组 填充回缓存中
			this.goodsObj.num = 1;
			// 添加商品选中状态
			this.goodsObj.checked = true;
			cart.push(this.goodsObj)
		} else {
			//    已经存在 修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
			cart[index].num++;
		}

		//将购物车数据重新添加回缓存中 
		wx.setStorageSync("cart", cart);
		//    弹出提示
		wx.showToast({
			title: '加入成功',
			icon: 'success',
			duration: 1500,
			//防止点击多次触发
			mask: true,
		});
	},
	handleActive() {
		let isCollect = false;
		//获取缓存中的收藏商品数组
		let collect = wx.getStorageSync("collect") || [];
		//判断商品是否被收藏过了
		let index = collect.findIndex(v => v.goods_id === this.goodsObj.goods_id);
		if (index !== -1) {
			//index!= -1  已经收藏
			collect.splice(index, 1),
				isCollect = false;
			wx.showToast({
				title: '取消成功',
				icon: 'success',
				mask: true,
			});
		} else {
			isCollect = true;
			collect.push(this.goodsObj);
			wx.showToast({
				title: '收藏成功',
				icon: 'success',
				mask: true,
			});
		}
		//存入缓存
		wx.setStorageSync("collect", collect);
		//修改属性
		this.setData({
			isCollect
		})
	}
})