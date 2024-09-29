// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  tocontrol(){
    wx.showToast({
      title: '目前未规划',
      icon: 'none',
      duration: 1000
    })
  }
})