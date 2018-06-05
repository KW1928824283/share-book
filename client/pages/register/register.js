// pages/register/register.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    uid:'',
    password:'',
    nickName :''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
      var that = this
      var userInfo = wx.getStorageSync('userInfo')
      if(typeof (userInfo.avatarUrl) == 'undefined'){
        wx.showModal({
          title: '提示',
          content: '您点击了拒绝授权,将无法正常注册,点击确定重新获取授权。',
          success: function (res) {
            if (res.confirm) {
              that.OpenSetting()
            }
          }
        })
      }else{
        this.setData({
          userInfo: userInfo,
          nickName: userInfo.nickName
        })
      }
  },
  OpenSetting: function () {
    var that = this
    wx.openSetting({
      success: (res) => {

        if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
          wx.getUserInfo({
            success:function(res){

              wx.setStorageSync("userInfo", res.userInfo)
              that.setData({
                userInfo: res.userInfo
              })
            }
          })
        }
       
      }
    })

  },
  
  uidInput:function(e){
    this.setData({
      uid: e.detail.value
    })
   
  },
  passInput:function(e){
    this.setData({
      password: e.detail.value
    })
  },
  nickNameInput:function(e){
    this.setData({
      nickName: e.detail.value
    })
  },
  doRegister:function(){


    var that = this

    if (typeof (this.data.userInfo.avatarUrl) != 'undefined'){
      var head_url = this.data.userInfo.avatarUrl
      this.doReg(head_url)
    }else{
      wx.showModal({
        title: '提示',
        content: '您点击了拒绝授权,将无法正常注册,点击确定重新获取授权。',
        success: function (res) {
          if (res.confirm) {
            that.OpenSetting()
          }
        }
      })
    }
   
    

  },
  doReg:function(head_url){
    wx.request({
      url: app.globalData.rootUrl + 'user.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'Register',
        uid: this.data.uid,
        password: this.data.password,
        nickName: this.data.nickName,
        head_url: head_url
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var data = res.data
        if (data == 1) {
          wx.showToast({
            title: '注册成功',
          })
          wx.navigateBack({

          })
        } else {
          wx.showModal({
            title: '提示',
            content: '注册失败',
          })
        }

      }
    })
  }
})