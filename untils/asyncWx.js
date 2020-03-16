//获取scope值 是否有访问权限
export const getSetting = () => {
    return new Promise((resolve,roject)=>{
        wx.getSetting({
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{
                roject(err)
            },
        });
    })
} 

//获取收货地址
export const chooseAddress = () => {
    return new Promise((resolve,roject)=>{
        wx.chooseAddress({
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{
                roject(err)
            },
        });
    })
} 

//打开授权页面
export const openSetting = () => {
    return new Promise((resolve,roject)=>{
        wx.openSetting({
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{
                roject(err)
            },
        });
    })
} 

export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
      wx.showModal({
        title: '提示',
        content: content,
        success :(res) =>{
          resolve(res);
        },
        fail:(err)=>{
          reject(err);
        }
      })
    })
  }
  
  
  /**
   *  promise 形式  showToast
   * @param {object} param0 参数
   */
  export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
      wx.showToast({
        title: title,
        icon: 'none',
        success :(res) =>{
          resolve(res);
        },
        fail:(err)=>{
          reject(err);
        }
      })
    })
  }
  
  /**
   * promise 形式  login
   */
  export const login=()=>{
    return new Promise((resolve,reject)=>{
      wx.login({
        timeout:10000,
        success: (result) => {
          resolve(result);
        },
        fail: (err) => {
          reject(err);
        }
      });
    })
  }
  
  /**
   * promise 形式的 小程序的微信支付
   * @param {object} pay 支付所必要的参数
   */
  export const requestPayment=(pay)=>{
    return new Promise((resolve,reject)=>{
     wx.requestPayment({
        ...pay,
       success: (result) => {
        resolve(result)
       },
       fail: (err) => {
         reject(err);
       }
     });
       
    })
  }
  
  