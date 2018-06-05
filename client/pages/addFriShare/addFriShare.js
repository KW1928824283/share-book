// pages/addFriShare/addFriShare.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reqdata:{},
    accountInfo:{},
    userInfo:{},
    isself:true,
    hasfriend:false,
    hasingore:false,
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var data = options.data
      var  reqdata = JSON.parse(data)

      var that = this
      this.setData({
        reqdata : reqdata
      })

      app.userInfoReadyCallback = res => {
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          userInfo: res.userInfo,
        })
      }

      var accountInfo = wx.getStorageSync('accountInfo')
      if (typeof (accountInfo.uid) == 'undefined') {

        wx.redirectTo({
          url: '../login/login',
        })

      }else{
        this.setData({
          accountInfo:accountInfo
        })
      }
      if(reqdata.reqUid == accountInfo.uid){
          this.setData({
            isself:true
          })
      }else{
        this.setData({
          isself: false
        })
      }
   
        wx.request({
          url: app.globalData.rootUrl + 'friend.php', //仅为示例，并非真实的接口地址
          data: {
            fun: 'hasFri',
            self:accountInfo.uid,
            friend:reqdata.reqUid
            
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            
            var data = res.data

            if(data){
              that.setData({
               hasfriend: true
              })
            }else{
              that.setData({
               hasfriend: false
              })
              
            }

          }
        })

        wx.request({
          url: app.globalData.rootUrl + 'addFriShare.php', //仅为示例，并非真实的接口地址
          data: {
            fun: 'has',
            reqUid: reqdata.reqUid,
            time: reqdata.time

          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
              var data = res.data
              if(data){
                that.setData({
                  hasingore:false
                })
              }else{
                that.setData({
                  hasingore: true
                })
              }
          }
        })

      
      
  },

 
  addRes:function(e){
    var resUid = this.data.accountInfo.uid
    var res_head_url = this.data.accountInfo.head_url
    var remarkName = this.data.accountInfo.nickName
    var msg = {
      resUid: resUid,
      reqUid: e.detail.value.reqUid,
      resRemark: e.detail.value.resRemark,
      remarkName: remarkName,
      req_head_url: res_head_url,
      res_head_url: e.detail.value.req_head_url
    }
    this.doAddFriRes(msg)
  },
  Ingore: function (e) {
    var that = this
    var reqUid = this.data.reqdata.reqUid
    var time = this.data.reqdata.time
    wx.request({
      url: app.globalData.rootUrl + 'addFriShare.php', //仅为示例，并非真实的接口地址
      data: {
        fun: 'remove',
        reqUid: reqUid,
        time: time

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '已忽略',
        })
        that.setData({
          hasingore:true
        })
      }
    })
  },
  enterMini:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
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
          if (data.msg == "ok") {
            wx.showToast({
              title: '添加成功',
            })
            wx.switchTab({
              url: "/pages/friend/friend",
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
  
})