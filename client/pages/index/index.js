//index.js
//获取应用实例
// app.globalData.socket.emit
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    accountInfo:{},
    hasAccountInfo:false,
    allBookNum:0,
    bookList:[],
    lendMsgList:[],
    retMsgList:[],
    lendOutList:[],
    lendInList:[],
    reqLendMsgList:[],
    title_direction: "../images/down.png",
    lend_title_direction: "../images/right.png",
    borrow_title_direction: "../images/right.png",
    allShowView: true,
    lendShowView: false,
    borrowShowView: false,
    showView:false
  },
  
  onLoad: function () {
 
    var that = this

  
    app.userInfoReadyCallback = res => {
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }

      var accountInfo = wx.getStorageSync('accountInfo')
      if (typeof (accountInfo.uid)  == 'undefined'){
        
        wx.redirectTo({
          url: '../login/login',
        })
        
      }else{
        this.setData({
          accountInfo:accountInfo
        })
        setInterval(function () {
          that.lendBookMsg()
          that.retBookMsg()
          that.lenInMsg()
          that.lendOutMsg()
          that.reqLendMsg()
        }, 5000)
      }
      
      

  },

  onShow:function(){
    var userInfo = wx.getStorageSync('userInfo')
    var accountInfo = wx.getStorageSync('accountInfo')
    
    this.setData({
      userInfo: userInfo,
      accountInfo:accountInfo
    })
    if (typeof (accountInfo.uid) != 'undefined' && accountInfo.uid !='') {

      this.setData({
        hasAccountInfo:true
      })
      var that = this
     
      

      
      
    }
    if (typeof (userInfo.nickName) != 'undefined' && userInfo.nickName != ''){
      this.setData({
        hasUserInfo:true
      })
    }
    





    var that = this
    wx.getNetworkType({
      success: function (res) {

        if (res.networkType != "none") {
          
          that.infoList()
        } else {
          var bookList = wx.getStorageSync("bookList") || []
          var lendMsgList = wx.getStorageSync("lendMsgList") || []
          var retMsgList  = wx.getStorageSync("retMsgLiit") ||[]
          var lendOutList = wx.getStorageSync("lendOutList") ||[]
          var lendInList = wx.getStorageSync("lendInList") || []
          var allBookNum = bookList.length
          

          that.setData({
            bookList: bookList,
            lendMsgList: lendMsgList,
            allBookNum: allBookNum,
            lendOutList: lendOutList,
            lendInList: lendInList,
            retMsgList:retMsgList
            
          })
          wx.showToast({
            title: '无网络',
            icon: 'none'
          })
        }
      },
    })
    
    
  },
  doSetData: function (data) {
    var addResMsg = wx.getStorageSync("addResMsg") || []

    for (var i = 0; i < data.length; i++) {

      for (var j = 0; j < addResMsg.length; j++) {
        if (addResMsg[j].reqUid == data[i].reqUid) {
          addResMsg.splice(j, 1)
          break
        }
      }
      addResMsg.push(data[i])

    }
    wx.setStorageSync("addResMsg", addResMsg)
  },
  onSocketEvent: function (accountInfo) {

    
    this.infoList(accountInfo)
    
    
    
    
    
   
    

  },
  addBook: function () {
    var that = this
    var hasCaned = wx.getStorageSync("hasCaned")
    if(hasCaned == true){
      this.scanCode()
    }else{
        
        wx.showModal({
          title: '扫码',
          content: '请扫描书籍后的条形码识别书籍',
          success: function (res) {
            if (res.confirm) {
              that.scanCode()
            }
          }
        })
    }
  },
  scanCode:function(){
    var that= this
    wx.scanCode({
      success: function (res) {
    
        var code = res.result
        if (code.length == 10 || code.length == 13) {
          wx.setStorageSync("hasCaned", true)
          that.doAddBookRequest(res.result)
        } else {
          wx.showToast({
            title: '非书籍条形码',
          })
        }

      },
      fail: function (res) {

      }
    })
  },

  doAddBookRequest: function (code) {

    wx.request({
      url: app.globalData.rootUrl + 'book.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'getBookInfo',
        code: code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data == "nobooks") var bookInfo = false
        else var bookInfo = JSON.stringify(res.data)

        wx.navigateTo({
          url: '../addBook/addBook?bookInfo=' + bookInfo + '&isbn=' + code,
        })


      }
    })
  },
  doSetLendData:function(data){
    var that = this
    var lendMsgList = wx.getStorageSync("lendMsgList") || []
    var friendList = wx.getStorageSync("friendList") || []
    for (var i = 0; i < data.length; i++) {

      for (var j = 0; j < lendMsgList.length; j++) {
        if (data[i].reqUid == lendMsgList[j].reqUid && data[i].book_isbn == lendMsgList[j].book_isbn) {
          lendMsgList.splice(j, 1)
          break;
        }

      }

      for (var k = 0; k < friendList.length; k++) {
        if (data[i].reqUid == friendList[k].friend_uid) {
          data[i].reqNickName = friendList[k].nickName
          break
        }
      }

      lendMsgList.unshift(data[i])
     

      
    }

    wx.setStorageSync("lendMsgList", lendMsgList)
    that.setData({
      lendMsgList: lendMsgList
    })
    var retMsgList = that.data.retMsgList
    
  },
  doSetReqLendData: function (data) {
    var that = this
    var reqLendMsgList = wx.getStorageSync("reqLendMsgList") || []
      var friendList = wx.getStorageSync("friendList") || [] 
      for (var i = 0; i < data.length; i++) {

        for (var j = 0; j < reqLendMsgList.length; j++) {
          if (data[i].resUid == reqLendMsgList[j].resUid && data[i].book_isbn == reqLendMsgList[j].book_isbn) {
            reqLendMsgList.splice(j, 1)
            break;
          }

        }

        for (var k = 0; k < friendList.length; k++) {
          if (data[i].resUid == friendList[k].friend_uid) {
            data[i].resNickName = friendList[k].nickName
            break
          }
        }

        reqLendMsgList.unshift(data[i])
      }

      wx.setStorageSync("reqLendMsgList", reqLendMsgList)
      that.setData({
        reqLendMsgList: reqLendMsgList
      })
      




  },
  doSetRetData:function(data){
    var that = this
    
    var retMsgList = wx.getStorageSync("retMsgList") || []
    var friendList = wx.getStorageSync("friendList") || []
    for (var i = 0; i < data.length; i++) {

      for (var j = 0; j < retMsgList.length; j++) {
        if (data[i].resUid == retMsgList[j].resUid && data[i].book_isbn == retMsgList[j].book_isbn) {
          retMsgList.splice(j, 1)
          break;
        }

      }

      for (var k = 0; k < friendList.length; k++) {
        if (data[i].resUid == friendList[k].friend_uid) {
          data[i].resNickName = friendList[k].nickName
          break
        }
      }

      retMsgList.unshift(data[i])
    }

    wx.setStorageSync("retMsgList", retMsgList)
    that.setData({
      retMsgList: retMsgList
    })
    var lendMsgList = that.data.lendMsgList
    var reqLendMsgList = that.data.reqLendMsgList
    if (lendMsgList.length == 0 && retMsgList.length == 0 && reqLendMsgList == 0 ) {
      that.setData({
        showView: false
      })
    } else {
      that.setData({
        showView: true
      })
    }

  },
  bookListReq:function(){
    var that = this
    var openid = this.data.accountInfo.uid


    wx.request({
      url: app.globalData.rootUrl + 'book.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'BookList',
        openid: openid

      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        
        wx.setStorageSync("bookList", res.data)
        that.setData({
          bookList: res.data
        })


      }
    })
  },
  lendBookMsg:function(){
    var that = this
    var uid = this.data.accountInfo.uid
    
    wx.request({
      url: app.globalData.rootUrl + 'lendBookMsg.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'lendMsgRes',
        uid: uid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
    
        var data = res.data
        that.doSetLendData(data)

      }
    })

  },
  retBookMsg:function(){
    var that = this
    var uid = this.data.accountInfo.uid
    
    wx.request({
      url: app.globalData.rootUrl + 'retBookMsg.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'retMsgRes',
        uid: uid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var data = res.data
        that.doSetRetData(data)



      }
    })
  },
  reqLendMsg:function(){
    var that = this
    var uid = this.data.accountInfo.uid
    
    wx.request({
      url: app.globalData.rootUrl + 'reqlendBookMsg.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'lendMsgRes',
        uid: uid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
      
        var data = res.data
        that.doSetReqLendData(data)

      }
    })
  },
  
  friendList:function(){
    var that = this
    var uid = this.data.accountInfo.uid
    wx.request({
      url: app.globalData.rootUrl + 'friend.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'friendList',
        uid: uid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var data = res.data
        wx.setStorageSync('friendList', data)
        that.setData({

          friendList: data
        })
      }
    })
  },
  lenInMsg:function(){
    var that = this
    var uid = this.data.accountInfo.uid
    wx.request({
      url: app.globalData.rootUrl + 'lendInfo_book.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'lendInMsg',
        resUid: uid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
      
        var data = res.data
       
        wx.setStorageSync("lendInList", data)
        that.setData({
          lendInList: data
        })


      }
    })
  },
  lendOutMsg:function(){
    var that = this
    var uid = this.data.accountInfo.uid
    wx.request({
      url: app.globalData.rootUrl + 'lendInfo_book.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'lendOutMsg',
        reqUid: uid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
     
        var friendList = wx.getStorageSync("friendList") || []

        var data = res.data
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < friendList.length; j++) {
            if (data[i].resUid == friendList[j].friend_uid) {
              data[i].resNickName = friendList[j].nickName
              break
            }
          }
        }
 
        wx.setStorageSync("lendOutList", data)
        that.setData({
          lendOutList: data
        })


      }
    })
  },
  infoList: function () {
    this.bookListReq()
    this.lendBookMsg()
    this.retBookMsg()
    this.friendList()
    this.lenInMsg()
    this.lendOutMsg()

    

  },
  
  bookDetail:function(e){

    var book_isbn = e.currentTarget.id
    var booktype = e.currentTarget.dataset.type
    
    var status = e.currentTarget.dataset.status
    var msg = {
      book_isbn: book_isbn,
      status: status
    }
    if(booktype == "lendIn"){
      var reqUid = e.currentTarget.dataset.requid
      msg.reqUid = reqUid
    }else if(booktype =="lendOut"){
      var resUid = e.currentTarget.dataset.resuid
      msg.resUid = resUid

    }
    msg = JSON.stringify(msg)
    wx.navigateTo({
      url: '../bookDetail/bookDetail?booktype='+booktype+'&msg='+msg,
    })
  },
  onPullDownRefresh: function () {
    this.onShow()
    wx.stopPullDownRefresh()
  },

  lendRes:function(e){
    var that = this
    var msg = e.detail.value
    msg.status = "lend"
    wx.request({
      url: app.globalData.rootUrl + 'lendInfo_book.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'lendBookRes',
        msg: msg

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        var data = res.data
       
        if (data.status) {
          if (data.msg == "ok") {
            wx.showToast({
              title: '借书成功',
            })
            var delMsg = {
              reqUid:msg.reqUid,
              book_isbn:msg.book_isbn
            }
            that.deleteInfoMsg("lendMsg",delMsg)
          }

        } else {
          wx.showToast({
            title: '借书失败',
          })
        }
      },
      fail:function(res){
      
      }
    })
  },
  deleteInfoMsg: function (delete_type, msg) {

    if (delete_type == "lendMsg"){
        var reqUid = msg.reqUid
        var book_isbn = msg.book_isbn

        var lendMsgList = wx.getStorageSync("lendMsgList")
        for (var i = 0; i < lendMsgList.length; i++) {
          if (lendMsgList[i].reqUid == reqUid && lendMsgList[i].book_isbn == book_isbn) {
              lendMsgList.splice(i, 1)
              wx.setStorageSync("lendMsgList", lendMsgList)
              this.onShow()
              return
            }
        }
    } else if (delete_type == "retMsg"){
      var resUid = msg.resUid
      var book_isbn = msg.book_isbn
      var retMsgList = wx.getStorageSync("retMsgList") || []
      for (var i = 0; i < retMsgList.length; i++) {
        if (retMsgList[i].resUid == resUid && retMsgList[i].book_isbn == book_isbn) {
          retMsgList.splice(i, 1)
          wx.setStorageSync("retMsgList", retMsgList)
          this.setData({
            retMsgList: retMsgList
          })
          this.onShow()
          return
        }
      }
    }
    
  },



  uidInput: function (e) {
    this.setData({
      uid: e.detail.value
    })
  },
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
 
  onChangeShowState: function () {
   
    var that = this;
    var icon = this.data.title_direction
    if (icon == "../images/down.png") {
      icon = "../images/right.png"
    } else {
      icon = "../images/down.png"
    }
    that.setData({
      allShowView: (!that.data.allShowView),
      title_direction: icon
    })

  },
  onChangeShowStateLend: function () {
    var icon = this.data.lend_title_direction
    if (icon == "../images/down.png") {
      icon = "../images/right.png"
    } else {
      icon = "../images/down.png"
    }
    this.setData({
      lendShowView: (!this.data.lendShowView),
      lend_title_direction: icon
    })
  },
  onChangeShowStateBorrow: function () {
    var icon = this.data.borrow_title_direction
    if (icon == "../images/down.png") {
      icon = "../images/right.png"
    } else {
      icon = "../images/down.png"
    }
    this.setData({
      borrowShowView: (!this.data.borrowShowView),
      borrow_title_direction: icon
    })
  },
  onShareAppMessage:function(){
    
  }



})
