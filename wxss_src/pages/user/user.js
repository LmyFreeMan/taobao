// pages/user/user.js
var app = getApp()
Page( {
  data: {
    flag:1,
    userInfo: {},
    orderInfo:{},
    projectSource: 'https://github.com/tekintian/wechat_shop',
    userListInfo: [ {
        icon: '../../images/iconfont-dingdan.png',
        text: '我的订单',
        isunread: true,
        unreadNum: 2
      }, {
        icon: '../../images/iconfont-card.png',
        text: '我的代金券',
        isunread: false,
        unreadNum: 2
      }, {
        icon: '../../images/iconfont-icontuan.png',
        text: '我的拼团',
        isunread: true,
        unreadNum: 1
      }, {
        icon: '../../images/iconfont-shouhuodizhi.png',
        text: '收货地址管理'
      }, {
        icon: '../../images/iconfont-kefu.png',
        text: '联系客服'
      }, {
        icon: '../../images/iconfont-help.png',
        text: '常见问题'
      }],
       loadingText: '加载中...',
       loadingHidden: false,
  },
  onLoad: function () {
      var that = this
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function(userInfo){
        //更新数据
        that.setData({
          userInfo:userInfo,
          loadingHidden: true
        })
      });

      this.loadOrderStatus();
  },
  onShow:function(){
    this.loadOrderStatus();
  },
  loadOrderStatus:function(){
    //获取用户订单数据
    var that = this;
    wx.request({
      url: app.d.apiUrl + 'User/getorder',
      method:'post',
      data: {
        userId:getApp().globalData.openid,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        console.log("dasdasdas")
        console.log(res)
        var status = res.data.status;
        if(status==1){
          var orderInfo = res.data.orderInfo;
          that.setData({
            orderInfo: orderInfo
          });
        }
      },
      error:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  bindgetuserinfo:function(e)
  {
    var that=this
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        console.log(res.userInfo.nickName)
         that.setData({
           flag:0,
           nickName: res.userInfo.nickName,
         avatarUrl: res.userInfo.avatarUrl,
        })
      },
    })
  },
  login:function()
  {
    console.log("login")
    var that=this
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://456.xinyun1688.com/server_api/Openid.php',
            data:{
                code:res.code
            },
            method:'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success:function(res)
            {
              console.log("login")
              console.log(res)
              getApp().globalData.openid=res.data.openid
              wx.navigateTo({
                url: '../code/code',
              })
            }

          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      complete:function(res)//你把这个放到外面 有什么显示不
      {
        console.log("老子就在这里留个心眼")
        console.log(res)
      }
    });

  },
  onShareAppMessage: function () {
    return {
      title: '小程序商城',
      path: '/pages/index/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})