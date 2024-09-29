// pages/tool/tool.js
Page({
  data: {
    _openid:"",
    userInfo:[],
    show: false,
    show2:false,
    cascaderValue: '',
    cascaderValue2: '',
    options :[ {text: '男',value: '32000',},{text: '女',value: '33000',}, ],
    options2 :[ {text: '大一',value: '310000',},{text: '大二',value: '320000',},{text: '大三',value: '330000',},{text: '大四',value: '340000',}, ],
  },
  onLoad() {
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
              _openid:this.data._openid,
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
  showPopup() {
    this.setData({ show: true });
  },
  showPopup2(){
    this.setData({ show2: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onClose2() {
    this.setData({ show2: false });
  },
  onFinish(e) {
    console.log(e.detail)
    wx.cloud.database().collection('user').where({ _openid:this.data._openid}).update({
      data:{
        gender:e.detail.selectedOptions[0].text,
      },
      success(res){
        console.log(res)
        wx.showToast({
          title: '修改成功',
        })
        
      }
    })
    this.refreshData();
    this.setData({ show: false });
    
  },
  onFinish2(e) {
    console.log(e.detail)
    wx.cloud.database().collection('user').where({ _openid:this.data._openid}).update({
      data:{
        grade:e.detail.selectedOptions[0].text,
      },
      success(res){
        console.log(res)
        wx.showToast({
          title: '修改成功',
        })
      }
    })
    this.refreshData();
    this.setData({ show2: false });
    
  },
   // 下拉刷新函数
   onPullDownRefresh: function() {
    // 下拉刷新时的逻辑
    this.refreshData();
  },
  refreshData: function() {
    wx.cloud.database().collection('user')
    .where({ 
      _openid:this.data._openid,
    })
    .get()
    .then(res => {
      this.setData({
        userInfo:res.data[0]
      })
      console.log(this.data.userInfo)
    })   
    // 结束下拉刷新动画
    wx.stopPullDownRefresh();
  },
})