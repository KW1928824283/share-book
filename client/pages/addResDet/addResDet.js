// pages/addResDet/addResDet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addResMsg:[],
    accountInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var addResMsg = wx.getStorageSync("addResMsg")
    var accountInfo = wx.getStorageSync("accountInfo")
    this.setData({
      addResMsg: addResMsg,
      accountInfo: accountInfo
    })
    var that = this
    setInterval(function(){
      that.doAddMsgRes(accountInfo.uid)
    },5000)
    
  },

  doAddMsgRes: function (uid) {
    var that = this
    wx.request({
      url: app.globalData.rootUrl + 'addFriendMsg.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'addMsgRes',
        uid: uid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        var data = res.data


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
        

        that.setData({
          addResMsg: addResMsg
        })

      }
    })


  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      var uid = this.data.accountInfo.uid
      this.doAddMsgRes(uid)
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
  addRes: function (e) {

    var resUid = this.data.accountInfo.uid
    var msg = {
      resUid: resUid,
      reqUid: e.detail.value.reqUid,
      resRemark: e.detail.value.resRemark,
      remarkName: e.detail.value.remarkName,
      req_head_url: e.detail.value.req_head_url,
      res_head_url: e.detail.value.res_head_url
    }
    this.doAddFriRes(msg)
    
  },
  doAddFriRes: function (msg) {
    var that = this
    wx.request({
      url: app.globalData.rootUrl + 'friend.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'addFriRes',
        msg: msg

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var data = res.data

        if (data.status) {
          that.deleteMsg(msg.reqUid)
          if (data.msg == "ok") {
            wx.showToast({
              title: '添加成功',
            })
            
          }
          
          

        } else {
          wx.showToast({
            title: '添加失败',
          })
        }
      }
    })
    


  },
  Ingore: function (e) {
    this.deleteMsg(e.target.id)

  },
  deleteMsg: function (uid) {
    var addResMsg = wx.getStorageSync("addResMsg")
    for (var i = 0; i < addResMsg.length; i++) {
      if (addResMsg[i].reqUid == uid) {
        addResMsg.splice(i, 1)
        wx.setStorageSync("addResMsg", addResMsg)
        if(addResMsg.length ==0){
          wx.navigateBack({
            
          })
        }else{
          this.onLoad()
        }
        
        return
      }
    }
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
    

    this.setData({
      addResMsg: addResMsg
    })
  },
  
  
})