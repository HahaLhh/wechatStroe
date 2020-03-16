//同时发送异步请求的次数
let ajaxTimes = 0;

function request(params) {
    //记录发送异步请求数据次数
    ajaxTimes++;
    //显示加载中动画
    wx.showLoading({
        title: "加载中",
        mask: true
    });
    //定义公共url
    const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
    return new Promise((resolve, reject) => {
        wx.request({
            // url: options.url,
            // data: options.data || {},
            // method: options.method || 'GET',
            ...params,
            url: baseUrl.concat(params.url),
            success: (result) => {
                resolve(result)
            },
            fail: reject,
            complete: () => {
                ajaxTimes--;
                //当异步请求次数为0时 
                if (ajaxTimes === 0) {
                    //关闭加载中 动画窗口
                    wx.hideLoading();
                }
            }
        });
    })
}
export default request;