// pages/addFriDet/addFriDet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    accountInfo:{},
    friendUid:'',
    friendNickName:'',
    selfDesc:'',
    friendName:'',
    friend_head_url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var userInfo = wx.getStorageSync('userInfo')
      var accountInfo = wx.getStorageSync('accountInfo')
      this.setData({
        userInfo:userInfo,
        accountInfo:accountInfo,
        friendUid:options.uid,
        friendNickName:options.nickName,
        selfDesc:accountInfo.nickName,
        friendName:options.nickName,
        friend_head_url:options.head_url
      })

  },

 
  selfDescInput:function(e){
    this.setData({
      selfDesc: e.detail.value
    })
  },
  friendNameInput:function(e){
    this.setData({
      friendName: e.detail.value
    })
  },
  sendReq:function(){
    
      
      this.doSendReq(this.data.selfDesc, this.data.friendName, this.data.accountInfo.uid, this.data.friendUid, this.data.accountInfo.nickName,this.data.friend_head_url,this.data.accountInfo.head_url)
  },
  doSendReq:function(selfDesc,friendName,reqUid,friendUid,reqNickName,friend_url,req_head_url){
      
      var msg = {
        reqDesc:selfDesc,
        reqName: reqNickName,
        reqUid:reqUid,
        resUid:friendUid,
        remarkName:friendName,
        time: new Date().getTime(),
        res_head_url:friend_url,
        req_head_url:req_head_url
      } 
      this.addFriReqDB(msg)
  },
  addFriReqDB:function(msg){
      wx.request({
        url:app.globalData.rootUrl+'addFriendMsg.php', //仅为示例，并非真实的接口地址
        data: {
          fun:'addReq',
          msg: msg
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          var data = res.data
          if(data == 1){
            wx.showToast({
              title: 'sucess',
            })
            wx.navigateBack({

            })
          }else{
            wx.showToast({
              title: 'fail',
            })
          }
        }
      })
  },

  
})