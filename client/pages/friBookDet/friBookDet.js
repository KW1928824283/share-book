// pages/friBookDet/friBookDet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friBookList:[],
    friUid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      friUid:options.friUid
    })
    this.bookList(options.friUid)
  },
  bookList: function (friUid){
    var that = this
    var openid = friUid


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
        that.setData({
          friBookList: res.data
        })


      }
    })

  },
  bookDetail: function (e) {
    var book_isbn = e.currentTarget.id
    var booktype = e.currentTarget.dataset.type

    var status = e.currentTarget.dataset.status
    var friUid = e.currentTarget.dataset.friuid
    var msg = {
      book_isbn: book_isbn,
      status: status,
      friUid:friUid
    }
    
    msg = JSON.stringify(msg)
    wx.navigateTo({
      url: '../bookDetail/bookDetail?booktype=' + booktype + '&msg=' + msg,
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
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
  
  }
})