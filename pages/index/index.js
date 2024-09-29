// index.js
//加载util.js文件，用来格式化日期
const util = require('../../utils/util.js')
Page({
  data: {
    actionList:[],
    value: '',
    show: false,
    num:'选项零',
    actions: [
      {
        name: '发布帖子',
      },
      {
        name: '上传资料',
      },
      {
        name: '取消',
      },
    ],
  },
  onLoad() {
    //云开发初始化
    wx.cloud.init({
        //把env替换成你自己的云开发环境id
        env: '',
    });
    var that=this
    wx.cloud.database().collection('post').get({
      success(res){
        console.log(res)
        that.setData({
          actionList:res.data.map(item =>{
            var time = util.formatTime(new Date(item.time))
            item.time = time
            var inputtext=item.inputtext.length > 35 ? item.inputtext.substring(0, 35)+'...' : item.inputtext
            item.inputtext=inputtext
            var nickName=item.nickName.length >4?item.nickName.substring(0,4)+'...':item.nickName
            item.nickName=nickName
            return item
          })
        })
        that.setData({
          actionList:that.data.actionList.slice().reverse()
        })
      }
    })
// 获取id
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
          });
        }
      });
  },
  // 弹出框按钮
  fabutap(){
    console.log('成功进入弹出框')
    const user = wx.getStorageSync('user');
    console.log(user)
    console.log('成功获取缓存')
    console.log('this'+this.data._openid)
    if (user === null) {
      console.log('user is null, showing login prompt');
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000
      });
    } else if (this.data._openid === user._openid) {
      console.log('openids match, setting show to true');
      this.setData({ show: true });
    } else {
      console.log('openids do not match, showing login prompt');
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000
      });
    }

  },
  // 点击页面其他地方关闭弹框
  onClose() {
    this.setData({ show:false})
  },
  // 根据选项调用不同函数
  onSelect(event) {
    console.log(event.detail);
    const { name } = event.detail;
    // 根据 chooose 调用不同的函数
    if (name === '发布帖子') {
      this.optionSelected(0);
    } else if (name === '上传资料') {
      this.optionSelected(1);
    } else if (name === '取消') {
      this.optionSelected(2);
    } else {
      console.error('未知的选项');
    }
  },

  optionSelected(index) {
    // 在这里可以执行与特定选项相关的操作
    switch (index) {
      case 0:
        // 发布帖子
        wx.navigateTo({
          url: '/pages/uploadpost/uploadpost'
        })
        break;
      case 1:
        // 上传资料
        wx.navigateTo({
          url: '/pages/uploadinfo/uploadinfo'
        })
        break;
      case 2:
        this.setData({ show:false})
        wx.showToast({
          title: '已取消',
          icon: 'none',
          duration: 500
        })
        break;
    }
  },
  // 搜索框更新数据
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  // 搜索数据
  onSearch() {
    console.log(this.data.value)
    wx.cloud.database().collection('post')
      .where(wx.cloud.database().command.or([
        {//内容
            inputtext: wx.cloud.database().RegExp({ //使用正则查询，实现对搜索的模糊查询
            regexp: this.data.value,
            options: 'i', //大小写不区分
          }),
        }
      ])).get()
      .then(res => {
        var that=this
        console.log('查询成功', res.data)
        that.setData({
          actionList:res.data.map(item =>{
            var time = util.formatTime(new Date(item.time))
            item.time = time
            var inputtext=item.inputtext.length > 35 ? item.inputtext.substring(0, 35)+'...' : item.inputtext
            item.inputtext=inputtext
            var nickName=item.nickName.length >4?item.nickName.substring(0,4)+'...':item.nickName
            item.nickName=nickName
            return item
          })
        })
        that.setData({
          actionList:that.data.actionList.slice().reverse()
        })
      })
      .catch(res => {
        console.log('出现了些问题',res)
      })
  },
  // 下拉刷新函数
  onPullDownRefresh: function() {
    // 下拉刷新时的逻辑
    this.refreshData();
  },
  // 刷新按钮
  freshtap: function(){
    this.refreshData();
  },
  refreshData: function() {
    const userdata=wx.getStorageSync('user')
    console.log('首页刷新获取的缓存中的user')
    console.log(userdata)
    // 模拟数据刷新
    var that=this
    wx.cloud.database().collection('post').get({
      success(res){
        console.log(res)
        that.setData({
          actionList:res.data.map(item =>{
            var time = util.formatTime(new Date(item.time))
            item.time = time
            var inputtext=item.inputtext.length > 35 ? item.inputtext.substring(0, 35)+' . . .' : item.inputtext
            item.inputtext=inputtext
            var nickName=item.nickName.length >4?item.nickName.substring(0,4)+'...':item.nickName
            item.nickName=nickName
            return item
          })
        })
        that.setData({
          actionList:that.data.actionList.slice().reverse()
        })
      }
    })

    // 结束下拉刷新动画
    wx.stopPullDownRefresh();
  },
  topostdetail(e){
    const user = wx.getStorageSync('user');
    if (this.data._openid==user._openid) {
      wx.navigateTo({
        url: '/pages/postdetail/postdetail?id='+e.currentTarget.dataset.id
      })
  } else {
    wx.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 1000
    })
  }  
  },
});

