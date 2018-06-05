// pages/addBook/addBook.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {



    num: 0,




    title: "",
    author: "",
    book_cover: "",
    book_isbn: "",
    book_info: "",
    price: "",
    publisher: "",
    pages: "",
    binding: "",
    pubdate: "",
    tags: "",

    istitle: false,
    isauthor: false,
    isprice: false,
    ispublisher: false,
    ispages: false,
    isbinding: false,
    ispubdate: false,
    istags: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isbn = options.isbn
    this.setData({
      book_isbn: isbn,
      book_cover: "../images/BookCover.png"
    })

   
    if (options.bookInfo != "false") {
      var bookInfo = JSON.parse(options.bookInfo)

      var summery = bookInfo.book_info
      if (summery.length >= 98) {
        summery = summery.substring(0, 98) + "..."
      }
      var num = summery.length
      this.setData({
        book_info: summery,
        num: num
      })
      if (bookInfo.title != "") {
        this.setData({
          istitle: true,
          title: bookInfo.title
        })
      }
      if (bookInfo.author != "" && bookInfo.author != null ) {
        this.setData({
          isauthor: true,
          author: bookInfo.author
        })
      }
      if (bookInfo.book_cover != "") {
        this.setData({
          book_cover: bookInfo.book_cover
        })
      }

      if (bookInfo.price != "") {
        this.setData({
          isprice: true,
          price: bookInfo.price
        })
      }
      if (bookInfo.publisher != "") {
        this.setData({
          ispublisher: true,
          publisher: bookInfo.publisher
        })
      }
      if (bookInfo.pages != "") {
        this.setData({
          ispages: true,
          pages: bookInfo.pages
        })
      }
      if (bookInfo.binding != "") {
        this.setData({
          isbinding: true,
          binding: bookInfo.binding
        })
      }
      if (bookInfo.pubdate != "") {
        this.setData({
          ispubdate: true,
          pubdate: bookInfo.pubdate
        })
      }
      if (bookInfo.tags != "") {
        this.setData({
          istags: true,
          tags: bookInfo.tags
        })
      }
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  changeCover: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        that.setData({
          book_cover: res.tempFilePaths[0]
        })
      },
    })
  },
  addBook: function (e) {
    var that = this
    var bookinfo = this.data
    delete bookinfo.istitle
    delete bookinfo.isauthor
    delete bookinfo.isprice
    delete bookinfo.ispublisher
    delete bookinfo.ispages
    delete bookinfo.isbinding
    delete bookinfo.ispubdate
    delete bookinfo.istags
    delete bookinfo.num
    var openid = wx.getStorageSync("openId")
    var coverPath = this.data.book_cover
    var title = this.data.title
    var author = this.data.author

    bookinfo = JSON.stringify(bookinfo)

    if (title.length == 0) {
      wx.showModal({
        title: '无书名',
        content: '请填写书名',
      })
    } else if (author.length == 0) {
      wx.showModal({
        title: '无作者',
        content: '请填写作者',
      })
    } else if (coverPath.indexOf("douban") != -1 && coverPath.indexOf("https://") != -1) {
      that.doAddBookRequest(bookinfo, 1)
    } else if (coverPath.indexOf("../images/BookCover.png") != -1) {
      wx.showModal({
        title: '选择',
        content: '请选择一张图片作为封面',

      })
    } else if (coverPath.indexOf("://tmp") != -1) {
      that.doAddBookRequest(bookinfo, 2)
    } else {
      wx.showModal({
        title: '错误',
        content: '没有图片无法上传',
      })
    }
    



  },
  doAddBookRequest(bookinfo, status) {
    var accountInfo = wx.getStorageSync("accountInfo")
    var openid =  accountInfo.uid
    if (status == 1) {
      wx.request({
        url: app.globalData.rootUrl + 'book.php', //仅为示例，并非真实的接口地址
        data: {
          fun: 'addBookNet',
          bookInfo: bookinfo,
          openid: openid

        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res.data == 1) {
            wx.showToast({
              title: '添加成功',
            })
            wx.navigateBack({

            })
            
          } else if (res.data == "has") {
            wx.showModal({
              title: '提示',
              content: '书房已有此书',
            })

          } else {
            wx.showToast({
              title: '添加失败',
            })
          }

        }
      })
    } else {
      bookinfo = JSON.parse(bookinfo)
      var filePath = bookinfo.book_cover
      bookinfo = JSON.stringify(bookinfo)


      wx.uploadFile({
        url: app.globalData.rootUrl + 'book.php',
        filePath: filePath,
        name: 'photos',
        header: {
          'content-type': 'multipart/form-data'
        }, // 设置请求的 header
        formData: {
          fun: 'addBookMy',
          openid: openid,
          bookInfo: bookinfo,

        }, // HTTP 请求中其他额外的 form data
        success: function (res) {

          if (res.statusCode == 200) {
            
          } else {
            typeof fail == "function" && fail(res);
          }
        },
        fail: function (res) {
          
          typeof fail == "function" && fail(res);
        }
      })
    }
  },
  titleChange: function (e) {

    this.setData({
      title: e.detail.value
    })
  },
  tagsChange: function (e) {

    var tags = [e.detail.value]
    this.setData({
      tags: tags
    })
  },
  authorChange: function (e) {


    this.setData({
      author: e.detail.value
    })
  },
  bindingChange: function (e) {

    this.setData({
      binding: e.detail.value
    })
  },
  infoChange: function (e) {

    var info = e.detail.value
    var num = info.length

    this.setData({
      book_info: info,
      num: num
    })
  },
  priceChange: function (e) {
    this.setData({
      price: e.detail.value
    })
  },
  publisherChange: function (e) {

    this.setData({
      publisher: e.detail.value
    })
  },
  pagesChange: function (e) {

    this.setData({
      pages: e.detail.value
    })
  },
  pubdateChange: function (e) {

    this.setData({
      pubdate: e.detail.value
    })
  },
 
})