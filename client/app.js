
App({
  onLaunch: function () {
    
    var that = this
   
    wx.getUserInfo({
      success:function(res){
        that.globalData.userInfo = res.userInfo


        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback(res)
        }
      },
      fail:function(){
     
      }
    })
    
  },

  globalData: {
    userInfo: null,
    rootUrl:'https://www.XXXX.cn/server/',
    socketopen:false
  }
})