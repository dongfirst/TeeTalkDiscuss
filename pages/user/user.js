/**
 * 作者：Dong
 * v AT2945298895
 */
Page({
  data: {
    // 初始化数据
    userInfo: null,
    userInfo_tank: false, // 初始状态关闭还是开启取决于你的需求
    avatarUrl: '',
    nickName: '',
    _openid: '',
    postdetail:[],
    newcomments:''
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
              _openid:this.data._openid,
              newcomment:'1'
            })
            .get()
            .then(res => {
              console.log(res)
              this.setData({
                newcomments:res.data.length
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

  //退出登录
  tuichu() {
      wx.setStorageSync('user', null)
      this.setData({
          userInfo: null,
      })
  },
  /**
   * 授权获取头像昵称相关
   */


  /**
   * 关闭/打开弹框
   */
  closeTank(e) {
    console.log(e)
    const _openid = this.data._openid; // 假设事件携带了openid
      if (!this.data.userInfo_tank) {
          wx.cloud.database().collection('user')
              .where({ _openid:_openid})
              .get()
              .then(res => {
                  console.log("用户信息====", res);
                  if (res.data.length) {
                      this.setData({
                          userInfo: res.data[0],
                          userInfo_tank: false,
                      })

                      wx.setStorageSync('user', res.data[0]);
                  } else {
                      console.log("还未注册====", res)
                      this.setData({
                          userInfo_tank: true
                      })
                  }
              }).catch(res => {
                  console.log('请添加user表')
              })
      } else {
          this.setData({
              userInfo_tank: false
          })
      }

  },
  /**
   * 获取头像
   */
  onChooseAvatar(e) {
      console.log(e);
      this.setData({
          avatarUrl: e.detail.avatarUrl
      })
  },
  /**
   * 获取用户昵称
   */
  getNickName(e) {
      console.log(e);
      this.setData({
          nickName: e.detail.value
      })
      console.log(this.data.nickName)
  },
  // 获取用户的_openid
  onChooseOpenid(e) {
    console.log(e);
    this.setData({
        _openid: e.detail._openid
    })
},

  /**
   * 提交
   */
  submit(e) {
      if (!this.data.avatarUrl) {
          return wx.showToast({
              title: '请选择头像',
              icon: 'error'
          })
      }
      if (!this.data.nickName) {
          return wx.showToast({
              title: '请输入昵称',
              icon: 'error'
          })
      }
      this.setData({
          userInfo_tank: false
      })
      wx.showLoading({
          title: '正在注册',
          mask: 'true'
      })
      let tempPath = this.data.avatarUrl

      let suffix = /\.[^\.]+$/.exec(tempPath)[0];
      console.log(suffix);

      //上传到云存储
      wx.cloud.uploadFile({
          cloudPath: 'userimg/' + new Date().getTime() + suffix, //在云端的文件名称
          filePath: tempPath, // 临时文件路径
          success: res => {
              console.log('上传成功', res)
              let fileID = res.fileID
              wx.hideLoading()
              wx.cloud.database().collection('user')
                  .add({
                      data: {
                          avatarUrl: fileID,
                          nickName: this.data.nickName,
                          introduction:"这个人很懒，什么也没留下",
                          gender:'男',
                          grade:'大一'
                      }
                  }).then(res => {
                      let user = {
                          _openid : this.data._openid,
                          avatarUrl: fileID,
                          nickName: this.data.nickName
                      }
                      console.log(user)
                      // 注册成功
                      console.log('注册成功')
                      wx.setStorageSync('user', user);
                      console.log('存入缓存的user')
                      console.log(user)
                      const userdata=wx.getStorageSync('user')
                      console.log('从缓存中获取到的user')
                      console.log(userdata)
                      this.setData({
                          userInfo: user,
                      })
                  }).catch(res => {
                      console.log('注册失败', res)
                      wx.showToast({
                          icon: 'error',
                          title: '注册失败',
                      })
                  })

          },
          fail: err => {
              wx.hideLoading()
              console.log('上传失败', res)
              wx.showToast({
                  icon: 'error',
                  title: '上传头像错误',
              })
          }
      })
  },
    // 跳转到关于我们
    toAboutUs() {
      wx.navigateTo({
        url: '/pages/introduce/introduce'
      })
    },
      // 功能未开放
  undefined() {
    wx.showToast({
      title: '作者在疯狂打码中...',
      icon: 'none',
      duration: 1000
    })
  },
  // 联系作者，反馈bug
  talktoauthor(){
    wx.navigateTo({
      url: '/pages/bugback/bugback'
    })
  },
  // 帖子
  selfpost(){
    wx.navigateTo({
      url: '/pages/selfpost/selfpost'
    })
  },
  tosetting(){
    wx.navigateTo({
      url: '/pages/setting/setting'
    })
  },
  tomodifyinfo(){
    wx.navigateTo({
      url: '/pages/modifyinfo/modifyinfo'
    })
  },
  // 评论
  tonewcomments(){
    wx.navigateTo({
      url: '/pages/newcomments/newcomments'
    })
  },
  // 下拉刷新函数
  onPullDownRefresh: function() {
    // 下拉刷新时的逻辑
    this.refreshData();
  },

  refreshData: function() {
   //云开发初始化
   wx.cloud.init({
    //把env替换成你自己的云开发环境id
    env: 'cloudtest-7gtpn9rw2a3aa62f',
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
          _openid:this.data._openid,
          newcomment:'1'
        })
        .get()
        .then(res => {
          console.log(res)
          this.setData({
            newcomments:res.data.length
          })
        })
  });
  },
  fail: err => {
    console.error('[云函数] [login] 调用失败', err)
  }
})


    // 结束下拉刷新动画
    wx.stopPullDownRefresh();
  }
})