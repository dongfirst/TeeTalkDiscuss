// pages/alluserinfo/alluserinfo.js
Page({

  data: {
    _openid:"",
    userInfo:[],
    
  },
  onLoad(options) {
    console.log(options)
    //云开发初始化
    wx.cloud.init({
        //把env替换成你自己的云开发环境id
        env: '',
    });
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        const saveopenid = res.result.openid
        this.setData({
          _openid: saveopenid,
      }, () => {
        wx.cloud.database().collection('user')
            .where({ 
              _openid:options.id,
            })
            .get()
            .then(res => {
              this.setData({
                userInfo:res.data[0]
              })
              console.log(this.data.userInfo)
            })
      });
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  
})