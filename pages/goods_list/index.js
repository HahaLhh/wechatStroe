// pages/goods_list/index.js
import request from "../../request/http.js"
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tabs: [{
				id: 0,
				value: "综合",
				isActive: true
			},
			{
				id: 1,
				value: "销量",
				isActive: false
			},
			{
				id: 2,
				value: "价格",
				isActive: false
			}
		],
		goodsList:[]
	},
	//接口携带参数
	QueryParams: {
		query: "",
		cid: "",
		//页码
		pagenum: 1,
		//总容量
		pagesize: 10
	},
	//总页数
	totalPages: 1,
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//获取页面参数
		this.QueryParams.cid = options.cid||"";
		this.QueryParams.query = options.query||"";
		this.getGoodsListData()
	},
	//页面上滑 滚动条触底
	onReachBottom(){
		//判断是否有下一页 当前页码是否大于总页码
		if(this.QueryParams.pagenum >= this.totalPages){
			//没有下一页数据
			wx.showToast({title:'没有下一页数据'});
		}else{
			//有下一页数据
			this.QueryParams.pagenum++;
			this.getGoodsListData();
		}
	},
	//下拉刷新 
	onPullDownRefresh(){
		//重置数组
		this.setData({
			goodsList:[]
		})
		//重置页码
		this.QueryParams.pagenum = 1;
		//重新发送请求数据
		this.getGoodsListData();
	},
	//获取商品列表数据
	async getGoodsListData() {
		//携带参数进行数据请求
		const res = await request({
			url: "/goods/search",
			data: this.QueryParams
		});
		//获取总条数
		const total = res.data.message.total;
		//计算总页数
		this.totalPages = Math.ceil(total/this.QueryParams.pagesize)
		this.setData({
			//获取新的数据 与之前数据进行拼接
			goodsList: [...this.data.goodsList,...res.data.message.goods]
		})
		//停止下拉刷新页面顶部加载动画
		wx.stopPullDownRefresh();
	},
	//tab栏标题点击事件
	handleTabsItemChang(e) {
		//获取被点击的标题索引
		const {
			index
		} = e.detail
		//修改原数组
		let {
			tabs
		} = this.data
		tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
		//赋值给data
		// console.log(tabs);
		this.setData({
			tabs
		})
	}
})