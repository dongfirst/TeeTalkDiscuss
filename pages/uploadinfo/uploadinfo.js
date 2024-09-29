// pages/uploadinfo/uploadinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'',
    nickName:'',
    fileList: [],
    titletext:'',
    singlefileID:'',
    fileID:[],
    time:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    //云开发初始化
    wx.cloud.init({
      //把env替换成你自己的云开发环境id
      env: '',
  });
   // 尝试从缓存中获取用户信息
   const user = wx.getStorageSync('user');
    
   if (user) {
       this.setData({
           avatarUrl: user.avatarUrl,
           nickName: user.nickName,
       });
   }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },
  uploadinfo() {
    console.log('调用upload函数');
    
    // 使用箭头函数自动绑定 this 上下文
    wx.cloud.database().collection('file')
      .add({
        data: {
          // _openid: this.data._openid,
          avatarUrl: this.data.avatarUrl,
          nickName: this.data.nickName,
          titletext: this.data.titletext,
          fileList:this.data.fileList,
          fileID: this.data.fileID,
          time: Date.now()
        }
      })
      .then(res => {
        // 成功处理逻辑
        console.log(res)
        wx.showToast({
          title: '成功发布',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          wx.switchTab({
              url: '/pages/info/info'
          });
      }, 1000);
      })
      .catch(error => {
        console.error('上传数据失败:', error);
        // 失败处理逻辑
        wx.showToast({
          title: '发布失败',
          icon: 'cross',
          duration: 1000
        })
        setTimeout(function () {
          wx.switchTab({
              url: '/pages/info/info'
          });
      }, 1000);
      });
  },
  titletext(e){
    this.setData({
      titletext: e.detail.value
  })
  },
  afterRead(e){
    const { file } = e.detail;
    this.data.fileList.push(file);
     // 更新页面数据
     this.setData({
      fileList: this.data.fileList
    });
    console.log(this.data.fileList)
    let tempPath = file.url
    let suffix = /\.[^\.]+$/.exec(tempPath)[0];
    // 上传至云存储
    wx.cloud.uploadFile({
      cloudPath: 'infofile/' + new Date().getTime() + suffix, //在云端的文件名称
      filePath: tempPath, // 临时文件路径
      success: res => {
        console.log('上传成功', res)
        this.setData({
          singlefileID: res.fileID
        })
        this.data.fileID.push(this.data.singlefileID);
        // 更新页面数据
        this.setData({
          fileID: this.data.fileID
        });
      }
    })
  },
})