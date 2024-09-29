// pages/newcomments/newcomments.js
//加载util.js文件，用来格式化日期
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 初始化数据
    userInfo: null,
    userInfo_tank: false, // 初始状态关闭还是开启取决于你的需求
    avatarUrl: '',
    nickName: '',
    _openid: '',
    postdetail:[],
  },

  onLoad() {
    //云开发初始化
    wx.cloud.init({
        //把env替换成你自己的云开发环境id
        env: '',
    });
    this.globalData = {
 
    }
    /**
     *打开该页面时
     */
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        const saveopenid = res.result.openid
        this.setData({
          _openid: saveopenid,
      }, () => {
          // setData 的回调函数，确保数据更新后才执行
          console.log('Data updated with new _openid:', this.data._openid);

          // 在这里执行你想要在数据更新后运行的函数
           // 尝试从缓存中获取用户信息
          // 获得评论是否更新
            wx.cloud.database().collection('post')
            .where({ 
              _openid:this.data._openid
            })
            .get()
            .then(res => {
              console.log(res)
              this.setData({
                postdetail:res.data.map(item =>{
                  var time = util.formatTime(new Date(item.time))
                  item.time = time
                  var inputtext=item.inputtext.length > 35 ? item.inputtext.substring(0, 35)+' . . .' : item.inputtext
                  item.inputtext=inputtext
                  var nickName=item.nickName.length >4?item.nickName.substring(0,4)+'...':item.nickName
                  item.nickName=nickName
                  return item
                })
              })
            })

          const user = wx.getStorageSync('user');
              
          if (this.data._openid==user._openid) {
              this.setData({
                  userInfo: user,
                  avatarUrl: user.avatarUrl,
                  nickName: user.nickName,
                  _openid: user._openid,
              });
          }
      });
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
    
},
topostdetail(e){
  wx.navigateTo({
    url: '/pages/postdetail/postdetail?id='+e.currentTarget.dataset.id
  })
}
})