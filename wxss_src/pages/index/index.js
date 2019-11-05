var app = getApp();

Page({
  data: {
    focus: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    productData: [],
    proCat:[],
    page: 2,
    index: 2,
    brand:[],
    // 滑动
    imgUrl: [],
    kbs:[],
    lastcat:[]
  },
  change:function(e)
  {
    console.log(e)
    this.setData({
      name:e.target.id,
      bindSource:""
    })
  },
  //事件处理函数
  formSubmit: function (e) {
    console.log(e)
    var that = this
    console.log(e);
    wx.request({
      url: 'https://456.xinyun1688.com/server_api/api/Index/find',
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:
        {
          name: e.detail.value.name
        },
      success: function (res) {
       
    wx.navigateTo({
      url: '../product/detail?productId='+res.data,
    })
      }
    })
  },
  scan:function(e)
  {
    var flag = 0;
    var arr = new Array();
    wx.request({
      url: 'https://456.xinyun1688.com/server_api/api/Index/scan',
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
    
      success: function (res) {
        console.log(res.data)
        for(var i=0;i<res.data.length;i++)
        arr.push(res.data[i].id)
        wx.scanCode({
            
          success: function (res) {
         for(var i=0;i<arr.length;i++)
         {
           if(res.result==arr[i])
           {
             flag=1;
           
             console.log("dsa")
           
           }
         }
            if(flag)
            {
              wx.navigateTo({
                url: '../product/detail?productId='+res.result,
              })
            }
            else
            {
              wx.showModal({
                title: '商品不存在',
                showCancel: false
              })
            }
          
          }
        })
      }
    })
    console.log(e)
   
  },
  search:function(e)
  {
    var that=this
    console.log(e)
    wx.request({
      url: 'https://456.xinyun1688.com/server_api/api/Index/search',
      method: 'POST',
      data: {name:e.detail.value},    //d参数为键值对字符串
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success: function (res) {
        {
         
          that.setData({
            bindSource: res.data
          })

        }
      }

    })
  },
//跳转商品列表页   
listdetail:function(e){
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../listdetail/listdetail?title='+e.currentTarget.dataset.title,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
//跳转商品搜索页  
suo:function(e){
    wx.navigateTo({
      url: '../search/search',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

//品牌街跳转商家详情页
jj:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../listdetail/listdetail?brandId='+id,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },


tian: function (e) {
  var id = e.currentTarget.dataset.id;
  wx.navigateTo({
    url: '../works/works',
    success: function (res) {
      // success
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
},
//点击加载更多
getMore:function(e){
  var that = this;
  var page = that.data.page;
  wx.request({
      url: app.d.apiUrl + 'Index/getlist',
      method:'post',
      data: {page:page},
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {  
        console.log(res)
        var prolist = res.data.prolist;
        if(prolist==''){
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        that.setData({
          page: page+1,
          productData:that.data.productData.concat(prolist)
        });
        //endInitData
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
},

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  onLoad: function (options) {
    console.log(app.d.apiUrl + 'Index/index')
    var that = this;
    wx.request({
      url: app.d.apiUrl + 'Index/index',
      method:'post',
      data: {},
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {  
        console.log(res)
        var focus = res.data.focus;
        var procat = res.data.procat;
        var prolist = res.data.prolist;
        var brand = res.data.brand;
        //that.initProductData(data);
        that.setData({
          focus:focus,
          proCat:procat,
          productData:prolist,
          brand: brand
        });
        //endInitData
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  },
  onShareAppMessage: function () {
    return {
      title: '小程序商城',
      path: '/pages/index/index',
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  }



});