// pages/friendList/friendList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendList:{},
    bookInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var bookInfo = JSON.parse(options.bookInfo)
      var friendList = wx.getStorageSync("friendList")
      this.setData({
        friendList: friendList,
        bookInfo: bookInfo
      })
      this.onSocketEvent()
  },
  friendSelected:function(e){
    var accountInfo = wx.getStorageSync("accountInfo")
    var reqUid = accountInfo.uid
    var reqNickName = accountInfo.nickName
    var resUid = e.currentTarget.id
    var msg = {
      reqUid:reqUid,
      resUid:resUid,
      reqNickName: reqNickName,
      time: new Date().getTime(),
      book_isbn: this.data.bookInfo.book_isbn,
      author: this.data.bookInfo.author,
      title: this.data.bookInfo.title,
      book_cover: this.data.bookInfo.book_cover

    }
    this.lendReq(msg)
    
   
  },

  lendReq:function(msg){
    wx.request({
      url: app.globalData.rootUrl + 'lendBookMsg.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'lendReq',
        msg: msg
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var data = res.data
        if (data == 1) {
          wx.showToast({
            title: 'sucess',
          })
          wx.navigateBack({

          })
        } else {
          wx.showToast({
            title: 'fail',
          })
        }
      }
    })
  },
  
})