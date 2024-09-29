Page({
  data: {
    // 输入框的默认文本
    _openid:'',
    value: '',
    userimg:'',
    dialog:[],
    Authorization:'',
  },
  onLoad() {
    //云开发初始化
    wx.cloud.init({
        //把env替换成你自己的云开发环境id
        env: '',
    });
    var that=this
    // 可以不保存到数据库，把这个删掉，将Authorization改成阿里云自己的模型密钥
    wx.cloud.database().collection('Authorization').where({ _id:'33c5161d66d551cf0942144f52e594f8'}).get({
      success(res){
        console.log(res)
        that.setData({
          Authorization:res.data[0].key
        })
        that.setData({
          actionList:that.data.actionList.slice().reverse()
        })
      }
    })
  },
  // 输入框内容的回调
  onChange(e) {
    const { value, callback } = e.detail;
    this.setData({
      value: e.detail.value
    });
    callback({
      value: value,
      cursor: -1,
    });
  },
  // 发送按钮
  sendinfo(){
    const user = wx.getStorageSync('user')
    this.setData({
      userimg: user.avatarUrl,
      _openid:user._openid
    });
    this.data.dialog.push({
      role: 'user',
      content: this.data.value
    });
    this.setData({
      dialog:this.data.dialog
    });
    wx.showLoading({
      title:'加载中',
      mask:true
    });
    console.log(this.data.dialog)
    var that=this
    // 调用阿里云api
    wx.request({
      url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', // 需要请求的地址
      method: 'POST', // 请求方式
      header: {
        'Content-Type': 'application/json',
        'Authorization': this.data.Authorization, // 替换为你的 API 密钥
      },
      data: {
        model: 'qwen-turbo',
        input: {
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.'
            },
            {
              role: 'user',
              content: that.data.value
            }
          ]
        },
        parameters: {
          result_format: 'message'
        }
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res.data); // 处理响应数据
        that.data.dialog.push({
          role: res.data.output.choices[0].message.role,
          content: res.data.output.choices[0].message.content
        });
        console.log(that.data.dialog)
        that.setData({
          dialog: that.data.dialog,
          value:''
        });
        wx.cloud.database().collection('dialog').add({
          data: {
            // _openid: this.data._openid,
            userimg:that.data.userimg,
            dialog:that.data.dialog,
            time: Date.now()
          }
        })
        .then(res => {
          console.log(res)
        })
        .catch(error => {
          console.log(error)
        })
      },
      fail: function(err) {
        console.error('请求失败:', err); // 处理失败情况
      }
    });
  },
});
