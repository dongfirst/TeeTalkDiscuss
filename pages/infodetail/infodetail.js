// pages/infodetail/infodetail.js
Page({
  data: {
    _id:'',
    infodetail:'',
    avatarUrl:'',
    nickName:'',
    _openid:'',
  },

  onLoad(options) {
    console.log(options.id)
    //云开发初始化
    wx.cloud.init({
        //把env替换成你自己的云开发环境id
        env: '',
    });
    // 获取用户信息
    const user = wx.getStorageSync('user');
    this.setData({
      _id: options.id,
      avatarUrl: user.avatarUrl,
      nickName: user.nickName,
      _openid: user._openid,
  });
  // 获取帖子
    var that=this
    wx.cloud.database().collection('file').where({_id:options.id})
    .get({
      success(res){
        // console.log(res.data[0])
        that.setData({
          infodetail:res.data[0]
        })
        console.log(that.data.infodetail)
      }
    })
  },
  todocx(e){
    console.log('下载文件')
    // 下载并预览文件
    wx.cloud.downloadFile({
      fileID: e.currentTarget.dataset.id
    }).then(res=>{
      console.log("获取临时链接成功",res.tempFilePath)
      var filePath = res.tempFilePath;
      console.log(filePath);
      wx.openDocument({
          filePath: filePath,
          success: function(res) {
              console.log('打开文档成功')
          },
          fail: function(res) {
              console.log('打开文档失败',res);
          },
          complete: function(res) {
              console.log(res);
          }
      })
    })
  },
  downloadfile(){
  this.data.infodetail.fileID.forEach(fileID => {
    this.downloadFile(fileID);
  })
  },
  downloadFile(e){
    wx.cloud.downloadFile({
      fileID: e
    }).then(res=>{
      console.log("获取临时链接成功",res.tempFilePath)
      var filePath = res.tempFilePath;
      console.log(filePath);  
      wx.showModal({
        title: '下载成功',
        content: filePath+'这个链接是临时下载还是临时储存我也没搞懂',
        showCancel: false, // 如果不需要取消按钮，可以设置为 false
        confirmText: '确认', // 自定义确认按钮的文字
        success: function(res) {
          wx.showToast({
            title: '点击文件可以预览哦~',
            icon: 'none',
            duration: 500
          })
        }
      });
    })
  },

})