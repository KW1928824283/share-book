// pages/addFriend/addFriend.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      searchList:{},
      accuntInfo:{},
      friendList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var accountInfo  =wx.getStorageSync("accountInfo")
      var friendList = wx.getStorageSync("friendList")
      this.setData({
        accountInfo:accountInfo,
        friendList: friendList
      })
  },

 
  uidInput:function(e){
    var searchId = e.detail.value
    if(searchId == ""){
      this.setData({
        searchList: {}
      })
    }else{
      this.doSearchFriReq(searchId)
    }
    
  },
  doSearchFriReq: function (searchId) {
    var that = this
    wx.request({
      url: app.globalData.rootUrl + 'user.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'SearchFriend',
        searchId: searchId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        
        var data = res.data
        var friendList = that.data.friendList
        for(var i = 0;i<data.length;i++){
          if(data[i].uid ==  that.data.accountInfo.uid){
            delete data[i]
            continue
          }
          for (var j = 0; j < friendList.length;j++){
            if(data[i].uid == friendList[j].friend_uid){
              delete data[i]
              break
            }
          }
        }
        that.setData({
          searchList:data
        })
      }
    })
  },
  addSelect:function(e){
    wx.navigateTo({
      url: '../addFriDet/addFriDet?uid=' + e.currentTarget.id + '&nickName=' + e.currentTarget.dataset.nickname + '&head_url=' + e.currentTarget.dataset.head_url
    })
  }
})