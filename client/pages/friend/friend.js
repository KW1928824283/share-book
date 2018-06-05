// pages/friend/friend.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      accountInfo:{},
      friendList:[],
      addResMsg:{},
      resRemark:[],
      logined:true,
      showView:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
      var accountInfo = wx.getStorageSync('accountInfo')
      var addResMsg = wx.getStorageSync("addResMsg")


      if (addResMsg.length != 0) {
        this.setData({
          showView: true
        })
      } else {
        this.setData({
          showView: false
        })
      }

      var accountInfo = wx.getStorageSync('accountInfo')
      if (typeof (accountInfo.uid) == 'undefined') {

        this.setData({
          logined: false
        })

      }



      this.setData({
        accountInfo:accountInfo,
        addResMsg:addResMsg
      })
      var that = this
      setInterval(function(){
        that.doAddMsgRes(accountInfo.uid)
        that.doFriendListReq(accountInfo.uid)
      },5000)
      
      
      
      





  },
  doAddMsgRes:function(uid){
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
        that.doSetData(data)  
       
      }
    })
   
    
  },

  doSetData:function(data){
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
    if (addResMsg.length != 0) {
      this.setData({
        showView: true
      })
    } else {
      this.setData({
        showView: false
      })
    }

    this.setData({
      addResMsg: addResMsg
    })
  },

  

  doFriendListReq:function(uid){
    var that =this
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
  addRes:function(e){
    
    var resUid = this.data.accountInfo.uid 
    var msg = {
      resUid:resUid,
      reqUid: e.detail.value.reqUid,
      resRemark: e.detail.value.resRemark,
      remarkName:e.detail.value.remarkName,
      req_head_url: e.detail.value.req_head_url,
      res_head_url: e.detail.value.res_head_url
    }
    this.doAddFriRes(msg)
    this.deleteMsg(e.detail.value.reqUid)  
  },
  doAddFriRes:function(msg){

    wx.request({
      url: app.globalData.rootUrl+'friend.php', //仅为示例，并非真实的接口地址
      data: {
        fun:'addFriRes',
        msg: msg
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        var data = res.data
        
        if(data.status){
          if(data.msg == "ok"){
            wx.showToast({
              title: '添加成功',
            })
          }
          
        }else{
          wx.showToast({
            title: '添加失败',
          })
        }
      }
    })



  },
  Ingore:function(e){

    this.deleteMsg(e.target.id)
    
  },
  addFriend:function(){
    wx.navigateTo({
      url: '../addFriend/addFriend',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var accountInfo = this.data.accountInfo
    this.doAddMsgRes(accountInfo.uid)
    this.doFriendListReq(accountInfo.uid)
      var addResMsg = wx.getStorageSync("addResMsg")
      if (addResMsg.length != 0) {
        this.setData({
          showView: true
        })
      }else{
        this.setData({
          showView: false
        })
      }
      var that = this
      setTimeout(function(){
        that.onSocketEvent(accountInfo)
      },2000)
      

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      this.onShow()
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
  onShareAppMessage: function (res) {
    var msg = {
      reqUid: this.data.accountInfo.uid,
      reqNickName: this.data.accountInfo.nickName,
      req_head_url: this.data.accountInfo.head_url,
      time: new Date().getTime()
    }
    var data = JSON.stringify(msg)
    var  path = '/pages/addFriShare/addFriShare?data=' + data
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '自定义转发标题',
      path: path,
      success: function (res) {



        if (res.errMsg == "shareAppMessage:ok") {



          wx.request({
            url: app.globalData.rootUrl + 'addFriShare.php', //仅为示例，并非真实的接口地址
            data: {
              fun: 'add',
              reqUid: msg.reqUid,
              time: msg.time

            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
             
            }
          })



        }

      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
        })
      }
    }
  },
  contain:function(array,key,value){
    for(var i = 0;i<array.length;i++){
      if(array[i].key == value ) return i
       
      
    }
    return -1
  },
  deleteMsg:function(uid){
    var addResMsg = wx.getStorageSync("addResMsg")
    for(var i= 0;i<addResMsg.length;i++){
      if(addResMsg[i].reqUid == uid){
        addResMsg.splice(i, 1) 
        wx.setStorageSync("addResMsg", addResMsg)
        this.onLoad()
        return
      }
    } 
  },
  friendSelected:function(e){
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../friBookDet/friBookDet?friUid='+id,
    })
    
  },
  onSocketEvent:function(accountInfo){
   
    this.doAddMsgRes(accountInfo.uid)
    this.doFriendListReq(accountInfo.uid)

   
 
  }
  
})