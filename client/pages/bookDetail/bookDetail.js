const app = getApp()
// pages/bookDetail/bookDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booktype:'',
    msg:{},
    bookList:{},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
    var booktype = options.booktype 
      
      var msg = options.msg
      msg = JSON.parse(msg)
      this.setData({
        booktype: booktype,
        msg: msg
      })
 
      if(booktype == "self"){
        var book_isbn = msg.book_isbn
        var status = msg.status
        var allBookList = wx.getStorageSync("bookList")
        for (var i = 0; i < allBookList.length;i++){
          if (allBookList[i].book_isbn == book_isbn){
            var bookList = allBookList[i]
            var tag= bookList.tags
            var tags = tag.split(",")
            bookList.tags = tags 
              that.setData({
                bookList:bookList
              })
              break;
          }
        }
      } else if (booktype=="lendOut"){
        var book_isbn = msg.book_isbn
        var resUid = msg.resUid
        var lendOutBookList = wx.getStorageSync("lendOutList")
        for(var i = 0;i<lendOutBookList.length;i++){
          if (lendOutBookList[i].book_isbn == book_isbn && lendOutBookList[i].resUid == resUid){
            var bookList =  lendOutBookList[i]
            var tag = bookList.tags
            var tags = tag.split(",")
            bookList.tags = tags
            this.setData({
              bookList: bookList
            })
            break
          }
        }
      }else if(booktype == "lendIn"){
        var book_isbn = msg.book_isbn
        var reqUid = msg.reqUid
        var lendInList = wx.getStorageSync("lendInList")
        for (var i = 0; i < lendInList.length; i++) {
          if (lendInList[i].book_isbn == book_isbn && lendInList[i].reqUid == reqUid ) {
            var bookList = lendInList[i]
            var tag = bookList.tags
            var tags = tag.split(",")
            bookList.tags = tags
            this.setData({
              bookList: bookList
            })
            break
          }
        }
      } else if (booktype == "other"){
        this.doBookDetailReq(msg)
      } 
  },
  doBookDetailReq:function(msg){
    var that = this
    var openid = msg.friUid
    var isbn = msg.book_isbn
    wx.request({
      url: app.globalData.rootUrl + 'book.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'bookDetail',
        openid:openid,
        isbn:isbn
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {

       
        that.setData({
          bookList:res.data
        })

      }
    })
  },

 
  lendFri:function(){
    var bookInfo = JSON.stringify(this.data.bookList)
    wx.navigateTo({
      url: '../friendList/friendList?bookInfo='+bookInfo,
    })
  },
  retReq:function(msg){
    wx.request({
      url: app.globalData.rootUrl + 'retBookMsg.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'retReq',
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
  retBook:function(e){
     
      var bookList = this.data.bookList
      var reqUid = bookList.reqUid
      var resUid = bookList.resUid
      var reqNickName = bookList.reqNickName
      var book_isbn = bookList.book_isbn
      var author = bookList.author
      var title = bookList.title
      var book_cover = bookList.book_cover

      var msg = {
        reqUid: reqUid,
        resUid: resUid,
        reqNickName: reqNickName,
        time: new Date().getTime(),
        book_isbn: book_isbn,
        author: author,
        title: title,
        book_cover: book_cover

      }
      this.retReq(msg)
  },
  reqLend:function(){
    var msg = this.data.msg
    var accountInfo = wx.getStorageSync("accountInfo")
    var reqUid = accountInfo.uid
    var reqNickName = accountInfo.nickName
    var resUid =  msg.friUid
    var msg = {
      reqUid: reqUid,
      resUid: resUid,
      reqNickName: reqNickName,
      time: new Date().getTime(),
      book_isbn: this.data.bookList.book_isbn,
      author: this.data.bookList.author,
      title: this.data.bookList.title,
      book_cover: this.data.bookList.book_cover

    }
    msg = JSON.stringify(msg)
    this.lendReq(msg)
  },
  lendReq: function (msg) {
    wx.request({
      url: app.globalData.rootUrl + 'reqlendBookMsg.php', //仅为示例，并非真实的接口地址
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

          wx.showModal({
            title: '消息',
            content: '借书消息已发出，等待朋友回复',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  
                })
              } else if (res.cancel) {
                wx.navigateBack({

                })
              }
            }
          })


          
          
        } else {
          wx.showToast({
            title: '借书失败',
          })
        }
      }
    })
  }
  
})