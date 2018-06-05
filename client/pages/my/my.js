// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      accountInfo:{},
      userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var accountInfo = wx.getStorageSync("accountInfo")
    var userInfo = wx.getStorageSync("userInfo")
    this.setData({
      accountInfo: accountInfo,
      userInfo: userInfo
    })
  },

  loginout:function(){
    var userInfo = wx.getStorageSync("userInfo")

    wx.clearStorageSync()
    wx.setStorageSync("userInfo", userInfo)
    wx.redirectTo({
      url: '../login/login',
    })
    
  }
})