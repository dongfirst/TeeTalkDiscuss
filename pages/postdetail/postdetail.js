// pages/postdetail/postdetail.js
Page({

  data: {
    _id:'',
    postdetail:'',
    value: '',
    commenttext:'',
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
    wx.cloud.database().collection('post').where({_id:options.id})
    .get({
      success(res){
        // console.log(res.data[0])
        that.setData({
          postdetail:res.data[0]
        })
        console.log(that.data.postdetail)
      }
    })
  },
     // 下拉刷新函数
     onPullDownRefresh: function() {
      // 下拉刷新时的逻辑
      this.refreshData();
    },
  
    refreshData: function() {
      this.setData({
        value:''
      })
      // 模拟数据刷新
       // 获取用户信息
       const user = wx.getStorageSync('user');
       this.setData({
         _id: this.data._id,
         avatarUrl: user.avatarUrl,
         nickName: user.nickName,
         _openid: user._openid,
     });
     // 获取帖子
       var that=this
       wx.cloud.database().collection('post').where({_id:this.data._id})
       .get({
         success(res){
           // console.log(res.data[0])
           that.setData({
             postdetail:res.data[0]
           })
           console.log(that.data.postdetail)
         }
       })
  
      // 结束下拉刷新动画
      wx.stopPullDownRefresh();
    },
  // 获取输入的值
  onChange(event) {
    // event.detail 为当前输入的值
    this.setData({
      commenttext:event.detail
    })
  },
  uploadinfo(){
    this.setData({
      value:''
    })
    var comment={}
    comment._openid=this.data._openid
    comment.avatarUrl=this.data.avatarUrl
    comment.nickName=this.data.nickName
    comment.commenttext=this.data.commenttext
    this.data.postdetail.comments.push(comment)
    console.log(comment)
    console.log(this.data.postdetail.comments)
    console.log(this.data._id)
    this.refreshData();
    wx.cloud.database().collection('post').where({ _id:this.data._id}).update({
      data:{
        comments:this.data.postdetail.comments,
        newcomment:'1'
      },
      success(res){
        console.log(res)
        wx.showToast({
          title: '评论成功',
        })
      }
    })
  },
    // 刷新按钮
    freshtap: function(){
      this.refreshData();
    },
    // 跳转到用户信息
    toalluserinfo(e){
      console.log(e)
        wx.navigateTo({
          url: '/pages/alluserinfo/alluserinfo?id='+e.currentTarget.dataset.id
        })   
  } 
})