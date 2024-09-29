// pages/uploadpost/uploadpost.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'',
    nickName:'',
    inputtext:'',
    fileList: [],
    fileID:'',
    checked: false,
  },

  /**
   * 生命周期函数--监听页面加载,初始化+获取用户信息
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
  // 获取输入的内容
  inputtext(e){
    this.setData({
      inputtext: e.detail.value
  })
  },
  // 选择框
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
  uploadpost() {
    console.log('调用upload函数');
    if (this.data.checked) {
      // 使用箭头函数自动绑定 this 上下文
    wx.cloud.database().collection('post')
    .add({
      data: {
        // _openid: this.data._openid,
        // 要改成自己上传的匿名用户的头像的云存储位置
        avatarUrl: 'cloud://cloudtest-7gtpn9rw2a3aa62f.636c-cloudtest-7gtpn9rw2a3aa62f-1328712247/userimg/1725339291985.jpg',
        nickName: '匿名用户',
        inputtext: this.data.inputtext,
        fileID: this.data.fileID,
        comments:[],
        time: Date.now(),
        newcomment:'0'
      }
    })
    .then(res => {
      // 成功处理逻辑
      console.log(res)
      wx.showModal({
        title: '发布成功',
        content: '返回首页后需要从‘搜索框’位置下拉刷新或点击刷新按钮才可以正常显示哦~',
        showCancel: false, // 如果不需要取消按钮，可以设置为 false
        confirmText: '确认', // 自定义确认按钮的文字
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了确认');
            // 在这里执行跳转操作
            wx.switchTab({
              url: '/pages/index/index'
            });
          }
        }
      });
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
            url: '/pages/index/index'
        });
    }, 1000);
    });
    } else {
      wx.cloud.database().collection('post')
      .add({
        data: {
          // _openid: this.data._openid,
          avatarUrl: this.data.avatarUrl,
          nickName: this.data.nickName,
          inputtext: this.data.inputtext,
          fileID: this.data.fileID,
          comments:[],
          time: Date.now(),
          newcomment:'0'
        }
      })
      .then(res => {
        // 成功处理逻辑
        console.log(res)
        wx.showModal({
          title: '发布成功',
          content: '返回首页后需要从‘搜索框’位置下拉刷新才可以正常显示哦~',
          showCancel: false, // 如果不需要取消按钮，可以设置为 false
          confirmText: '确认', // 自定义确认按钮的文字
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击了确认');
              // 在这里执行跳转操作
              wx.switchTab({
                url: '/pages/index/index'
              });
            }
          }
        });
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
              url: '/pages/index/index'
          });
      }, 1000);
      });
    }
    
  },

  // 获取图片的临时地址并上传至云存储
  afterRead(event) {
    const { file } = event.detail;
    let tempPath = file.url
    let suffix = /\.[^\.]+$/.exec(tempPath)[0];
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.cloud.uploadFile({
      cloudPath: 'postimg/' + new Date().getTime() + suffix, //在云端的文件名称
      filePath: tempPath, // 临时文件路径
      success: res => {
        console.log('上传成功', res)
        this.setData({
          fileID: res.fileID
        })
        // 先获取现在的数组
        let fileList = this.data.fileList;

        // 向 fileList 中添加新的文件 URL
        fileList.push({ url: this.data.fileID, deletable:true });
    
        // 使用 setData 更新视图
        this.setData({
          fileList: fileList
        });
      },
      fail: err => {
        console.error(err)
      }
      // url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
      // filePath: file.url,
      // name: 'file',
      // formData: { user: 'test' },
      // success(res) {
      //   // 上传完成需要更新 fileList
      //   const { fileList = [] } = this.data;
      //   fileList.push({ ...file, url: res.data });
      //   this.setData({ fileList });
      // },
    });
  }
})