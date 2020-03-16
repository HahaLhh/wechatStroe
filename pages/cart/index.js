import request from "../../request/http.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
import {
	getSetting,
	chooseAddress,
	openSetting,
	showModal,
	showToast,
	login,
	requestPayment
} from "../../untils/asyncWx.js"
// pages/cart/index.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		//购物车数据
		cartGoodsLists: [],
		address: {},
		//全选
		allChecked: false,
		//总价格
		totalPrice: 0,
		//总数量
		totalNum: 0,
	},

	//因为购物车页面总是在不断刷新 使用onShow()
	onShow: function () {
		//获取缓存中的收货地址
		const address = wx.getStorageSync("address");
		const cart = wx.getStorageSync("cart") || [];
		this.setCart(cart)
		this.setData({
			cartGoodsLists: cart,
			address,
		})

	},
	// 购物车渲染 设置购物车状态 计算总数量总价格 工具栏的数据
	setCart(cart) {
		let allChecked = true;
		//every 只有一个值为false 返回false  需要对数组长度进行判断避免空数组返回true
		//  allChecked = cart.length ? cart.every(v => v.checked) : false;
		let totalPrice = 0;
		let totalNum = 0;
		// 计算总数量和总价格
		cart.forEach(v => {
			//判断是否选中
			if (v.checked) {
				totalPrice += v.num * v.goods_price;
				totalNum += v.num
			} else {
				allChecked = false;
			}
		})
		// 判断数组是否为空
		allChecked = cart.length != 0 ? allChecked : false;
		this.setData({
			//更新数据
			cartGoodsLists: cart,
			allChecked,
			totalPrice,
			totalNum,
		})
		wx.setStorageSync("cart", cart);
	},
	// 获取收货地址
	async handleChooseAddress() {
		//使用小程序api 获取用户收货地址
		//需要获取用户获取地址权限状态 scope值 权限询问时同意与否
		try {
			//  获取 权限状态
			const res1 = await getSetting();
			const scopeAddress = res1.authSetting["scope.address"];
			//  判断 权限状态 
			if (scopeAddress === false) {
				//没有权限 打开授权页面
				await openSetting();
			}
			//  有权限后 调用获取收货地址的 api
			let address = await chooseAddress();
			//对获取的收货地址对象进行字符串拼接得出收货地址
			address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;

			//  存入到缓存中
			wx.setStorageSync("address", address);

		} catch (error) {
			console.log(error);
		}
	},
	//商品选择
	checkboxChange(e) {
		// 1 获取被修改的商品的id
		const goods_id = e.currentTarget.dataset.id;
		// 2 获取购物车数组 
		let {
			cartGoodsLists
		} = this.data;
		//  3 找到被修改的商品对象
		let index = cartGoodsLists.findIndex(v => v.goods_id === goods_id);
		// 4 选中状态取反
		cartGoodsLists[index].checked = !cartGoodsLists[index].checked;

		this.setCart(cartGoodsLists);
		//储存到缓存中
		wx.setStorageSync("cart", cartGoodsLists);
	},
	//商品全选功能
	handleItemAllCheck() {
		// 获取购物车数组 
		let {
			cartGoodsLists,
			allChecked
		} = this.data;
		//反选 全选按钮
		allChecked = !allChecked;
		//将购物车数组中商品checked改为全选时的boolean值 实现一致
		cartGoodsLists.forEach(v => v.checked = allChecked);
		//将更改后数据 返回购物车渲染事件进行渲染
		this.setCart(cartGoodsLists);
	},
	//商品数量增减 
	async handleItemNumEdit(e) {
		//获取进行增减的商品id
		const {
			id,
			operation
		} = e.currentTarget.dataset;
		//获取购物车数据
		let {
			cartGoodsLists
		} = this.data;

		//找到需要进行数量更改的商品索引
		const index = cartGoodsLists.findIndex(v => v.goods_id === id)
		//判断数量 是否删除
		if (cartGoodsLists[index].num === 1 && operation === -1) {
			//弹窗询问是否删除
			const res = await showModal({
				content: "是否删除这个商品？"
			});
			if (res.confirm) {
				//点击确定 删除该商品
				cartGoodsLists.splice(index, 1);
				//填充回data
				this.setCart(cartGoodsLists)
			}
		} else {
			//更改数量
			cartGoodsLists[index].num += operation;
			this.setCart(cartGoodsLists)
		}
	},
	//购物车结算
	async handlePay(){
		//获取收货地址和商品数量
		const {address,totalNum} = this.data;
		//判断是否有收货地址
		if(!address.userName){
			await showToast({title:"还没有设置收货地址"});
			return;
		}
		//判断是否有商品数量
		if(totalNum === 0){
			await showToast({title:"还没有选购商品"})
			return;
		}
		//跳转付款页面
		wx.navigateTo({
			url: '/pages/pay/index',
		});
	}
})