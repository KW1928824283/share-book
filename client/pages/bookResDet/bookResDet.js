// pages/bookResDet/bookResDet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lendMsgList:[],
    retMsgList: [],
    reqLendMsgList:[],
    accountInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var retMsgList = wx.getStorageSync("retMsgList") ||[]
    var lendMsgList = wx.getStorageSync("lendMsgList") || [] 
    var reqLendMsgList = wx.getStorageSync("reqLendMsgList") || []
    var accountInfo = wx.getStorageSync("accountInfo")
    this.setData({
      retMsgList: retMsgList,
      accountInfo: accountInfo,
      lendMsgList: lendMsgList,
      reqLendMsgList: reqLendMsgList
    })
    
    var that = this
  
    setInterval(function(){
      that.dolendMsgRes()
      that.doretMsgRes()
      that.doreqMsgRes()
    },5000)
  },

  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      this.onLoad()
      wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  doSetRetMsg:function(data){
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

  },
  doreqMsgRes:function(){

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
  doretMsgRes:function(){
    var that = this
    var uid =  this.data.accountInfo.uid
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
        that.doSetRetMsg(data)
        
        
      }
    })
  },
  dolendMsgRes:function(){
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
  doSetRetData: function (data) {

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
    

  },
  doSetReqLendData:function(data){
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
  doSetLendData: function(data) {
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
      
    },
  onSocketEvent:function(accountInfo){
    
  },

  retRes: function (e) {
    var that = this
    var msg = e.detail.value
    msg.status = "0"
    



    wx.request({
      url: app.globalData.rootUrl + 'lendInfo_book.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'retBookRes',
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
              title: '还书成功',
            })
            var delMsg = {
              resUid: msg.resUid,
              book_isbn: msg.book_isbn
            }
            
            that.deleteInfoMsg("retMsg", delMsg)
          }

        } else {
          wx.showToast({
            title: '借书失败',
          })
        }
      },
      fail: function (res) {

      }
    })
  },
  lendRes: function (e) {
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
              reqUid: msg.reqUid,
              book_isbn: msg.book_isbn
            }
            
            that.deleteInfoMsg("lendMsg", delMsg)
          }

        } else {
          wx.showToast({
            title: '借书失败',
          })
        }
      },
      fail: function (res) {

      }
    })
  },
  deleteInfoMsg: function (delete_type, msg) {

    if (delete_type == "lendMsg") {
      var reqUid = msg.reqUid
      var book_isbn = msg.book_isbn

      var lendMsgList = wx.getStorageSync("lendMsgList")
      for (var i = 0; i < lendMsgList.length; i++) {
        if (lendMsgList[i].reqUid == reqUid && lendMsgList[i].book_isbn == book_isbn) {
          lendMsgList.splice(i, 1)
          wx.setStorageSync("lendMsgList", lendMsgList)
          this.setData({
            lendMsgList: lendMsgList
          })
        }
      }
    } else if (delete_type == "retMsg") {
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
          
         
        }
      }
    } else if (delete_type == "reqlendMsg"){
      var reqUid = msg.reqUid
      var book_isbn = msg.book_isbn
      var reqLendMsgList = wx.getStorageSync("reqLendMsgList") || []
      for (var i = 0; i < reqLendMsgList.length; i++) {
        if (reqLendMsgList[i].reqUid == reqUid && reqLendMsgList[i].book_isbn == book_isbn) {
          reqLendMsgList.splice(i, 1)
          wx.setStorageSync("reqLendMsgList", reqLendMsgList)
          this.setData({
            reqLendMsgList: reqLendMsgList
          })


        }
      }
    }

    var lendMsgList = this.data.lendMsgList
    var retMsgList = this.data.retMsgList
    var reqLendMsgList = this.data.reqLendMsgList

    if(lendMsgList.length == 0 && retMsgList.length == 0){
      wx.navigateBack({
        
      })
    }else{
      this.onLoad()
    }
    
    return


  },
  Ingore: function (e) {

    var reqUid = e.target.id
    var book_isbn = e.target.dataset.book_isbn

    var msg = {
      reqUid: reqUid,
      book_isbn: book_isbn
    }
    this.deleteInfoMsg("lendMsg", msg)


  },
  reqlendRes:function(e){
    var that = this
    var msg = e.detail.value
    msg.status = "lend"


    var reqUid = msg.resUid
    var resUid = msg.reqUid
    msg.reqUid = reqUid
    msg.resUid = resUid
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
              reqUid: msg.resUid,
              book_isbn: msg.book_isbn
            }

            that.deleteInfoMsg("reqlendMsg", delMsg)
          }

        } else {
          wx.showToast({
            title: '借书失败',
          })
        }
      },
      fail: function (res) {

      }
    })
  },
  reqIngore:function(e){
    var reqUid = e.target.id
    var book_isbn = e.target.dataset.book_isbn

    var msg = {
      reqUid: reqUid,
      book_isbn: book_isbn
    }

    this.deleteInfoMsg("reqlendMsg", msg)
  }
})