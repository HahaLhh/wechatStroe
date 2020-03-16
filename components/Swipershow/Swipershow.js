// components/Swipershow/Swipershow.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		swiperImage: {
			type: Array, //设置类型
			value: [], //默认值
			observer: function (newVal, oldVal) {} //监听变化
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的方法列表
	 */
	methods: {

	},
	onLoad:function(){
		console.log(swiperImage);
		
	}
})