// pages/code/code.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!getApp().globalData.openid) {
      wx.showModal({
        title: '请先登录',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../user/user',
            })
          }
        }
      })
      return false;
    }
    else
    {
      this.setData({
        id: getApp().globalData.openid
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
download:function()
{


  wx.getImageInfo({
    src: 'https://456.xinyun1688.com/server_api/api/Index/code?id=oAoEi0Q34oS0lzlfPALAJ6NkPYz8',
    success(res) {
     console.log(res)
      wx.saveImageToPhotosAlbum({
        filePath:res.path,
        success:function(e)
        {
          console.log(e)
        }
      })

    }
  })





  // console.log("test");
  // wx.downloadFile({
  //   url: 'https://456.xinyun1688.com/server_api/api/Index/code?id=oAoEi0Q34oS0lzlfPALAJ6NkPYz8', //仅为示例，并非真实的资源
    
  //   success(res) {
  //     // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
  //     console.log(res)
  //     if (res.statusCode === 200) {
       
  //     }
  //   },
  //   fail:function(e)
  //   {
  //         console.log(e)
  //   }
  // })
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