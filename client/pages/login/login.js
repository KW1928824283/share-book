// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    password:'',
  },

 
  uidInput:function(e){
    this.setData({
      uid: e.detail.value
    })
  },
  passwordInput:function(e){
    this.setData({
      password:e.detail.value
    })
  },
  register:function(){
    wx.navigateTo({
      url: '../register/register',
    })
  },
  login:function(){
    var that = this
    wx.request({
      url: app.globalData.rootUrl+'user.php', //仅为示例，并非真实的接口地址
      data: {
        fun:'Login',
        uid: that.data.uid,
        password: that.data.password
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var data = res.data
        if(data == ""){
          wx.showToast({
            title: '登录失败',
          })
         
        }else{
          wx.showToast({
            title: '登录成功',
          })
          wx.setStorageSync('accountInfo', data)
          
          wx.switchTab({
            url: '../index/index',
          })
        }
        
      }
    })
  }
})