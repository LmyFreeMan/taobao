var app = getApp();
// pages/order/downline.js
Page({
  data:{
    itemData:{},
    userId:0,
    paytype:'weixin',//0线下1微信
    remark:'',
    cartId:0,
    addrId:0,//收货地址//测试--
    btnDisabled:false,
    productData:[],
    address:{},
    total:0,
    vprice:0,
    vid:0,
    addemt:1,
    vou:[]
  },
  onLoad:function(options){
    // wx.switchTab({
    //    url: '../index/index',
    //  })
    console.log("test")
    console.log(options)
    var uid = getApp().globalData.openid;
    this.setData({
      cartId: options.cartId,
      userId: getApp().globalData.openid
    });
    this.loadProductDetail();
  },
  formSubmit:function(e)
  {
    console.log("模板信息")
    console.log(e)
    wx.request({
      url: 'https://456.xinyun1688.com/server_api/GetAccessToken.php',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log("GET")
      console.log(res)
       console.log("奸恶福")
        console.log(res.data.access_token)
        console.log(getApp().globalData.openid)
        console.log(e.detail.formId)
        wx.request({
          url: "https://456.xinyun1688.com/server_api/SendTemplateMessage.php",
          // header: {
          //   //请求头和ajax写法一样
          //   "Content-Type": "application/x-www-form-urlencoded"
          // },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: "POST",
          data: {
            "touser": getApp().globalData.openid,
            "template_id": "-ClisZfSxN7OKdJGBXkIrAQAookCDuqmV7vQhIQvn-4",
            "page": "pages/index/index",
            "form_id": e.detail.formId,
            "access_toke": res.data.access_token,
            "name": e.detail.value.name,
            "num": e.detail.value.num,
            "address": e.detail.value.address,
            "tel": e.detail.value.tel,
            "data": {
              "keyword1": {
                "value": "已完成"
              },
              "keyword2": {
                "value": e.detail.value.name
              },
              "keyword3": {
                "value": e.detail.value.num
              },
              "keyword4": {
                "value": e.detail.value.address
              },
              "keyword5": {
                "value": e.detail.value.tel
              },
             
            },
         
          }
,
          success: function (res) { 
            console.log("template")
     console.log(res)
      } 
    })  
      }
    }) 
  },









  loadProductDetail:function(){
    var that = this;
    wx.request({
      url: app.d.apiUrl + 'Payment/buy_cart',
      method:'post',
      data: {
        cart_id: that.data.cartId,
        uid: getApp().globalData.openid,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        //that.initProductData(res.data);
        var adds = res.data.adds;
        if (adds){
          var addrId = adds.id;
          that.setData({
            address: adds,
            addrId: addrId
          });
        }
        that.setData({
          addemt: res.data.addemt,
          productData:res.data.pro,
          total: res.data.price,
          vprice: res.data.price,
          vou: res.data.vou,
        });
        //endInitData
      },
    });
  },

  remarkInput:function(e){
    this.setData({
      remark: e.detail.value,
    })
  },

 //选择优惠券
  getvou:function(e){
    var vid = e.currentTarget.dataset.id;
    var price = e.currentTarget.dataset.price;
    var zprice = this.data.vprice;
    var cprice = parseFloat(zprice) - parseFloat(price);
    this.setData({
      total: cprice,
      vid: vid
    })
  }, 

//微信支付
  createProductOrderByWX:function(e){
    this.setData({
      paytype: 'weixin',
    });

    this.createProductOrder();
  },

  //线下支付
  createProductOrderByXX:function(e){
    this.setData({
      paytype: 'cash',
    });
    wx.showToast({
      title: "线下支付开通中，敬请期待!",
      duration: 3000
    });
    return false;
    this.createProductOrder();
  },

  //确认订单
  createProductOrder:function(){
    this.setData({
      btnDisabled:false,
    })

    //创建订单
    var that = this;
    console.log(that.data.cartId)
    console.log(that.data.paytype)
    console.log(that.data.addrId)
    console.log(that.data.total)
    console.log(that.data.addrId)
    wx.request({
      url: app.d.apiUrl + 'Payment/payment',
      method:'post',
      data: {
       
        uid: getApp().globalData.openid,
        cart_id: that.data.cartId,
        type:that.data.paytype,
        aid: that.data.addrId,//地址的id
        remark: that.data.remark,//用户备注
        price: that.data.total,//总价
        vid: that.data.vid,//优惠券ID
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("eee")
        console.log(res)
        //--init data        
        var data = res.data;
        console.log("weixin")
        console.log(data.arr)
        console.log(typeof (data.arr))
        if(data.status == 1){
          //创建订单成功
          if(data.arr.pay_type == 'cash'){
              wx.showToast({
                 title:"请自行联系商家进行发货!",
                 duration:3000
              });
              return false;
          }
          if(data.arr.pay_type == 'weixin'){
              wx.showModal({
                title: '订单成功',
                showCancel:false,
                success:function(e)
                {
                   if(e.confirm)
                   {
                     wx.switchTab({
                       url: '../cart/cart',
                     })
                     return false;

                   }
                }
              })
         
          }
        }else{
          wx.showToast({
            title:"下单失败!",
            duration:2500
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },
  
  //调起微信支付
  // wxpay: function(order){
  //     wx.request({
  //       url: app.d.apiUrl + 'Wxpay/wxpay',
  //       data: {
  //         order_id:order.order_id,
  //         order_sn:order.order_sn,
  //         uid:this.data.userId,
  //       },
  //       method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
  //       header: {
  //         'Content-Type':  'application/x-www-form-urlencoded'
  //       }, // 设置请求的 header
  //       success: function(res){
  //         if(res.data.status==1){
  //           var order=res.data.arr;
  //           wx.requestPayment({
  //             timeStamp: order.timeStamp,
  //             nonceStr: order.nonceStr,
  //             package: order.package,
  //             signType: 'MD5',
  //             paySign: order.paySign,
  //             success: function(res){
  //               wx.showToast({
  //                 title:"支付成功!",
  //                 duration:2000,
  //               });
  //               setTimeout(function(){
  //                 wx.navigateTo({
  //                   url: '../user/dingdan?currentTab=1&otype=deliver',
  //                 });
  //               },2500);
  //             },
  //             fail: function(res) {
  //               wx.showToast({
  //                 title:res,
  //                 duration:3000
  //               })
  //             }
  //           })
  //         }else{
  //           wx.showToast({
  //             title: res.data.err,
  //             duration: 2000
  //           });
  //         }
  //       },
  //       fail: function() {
  //         // fail
  //         wx.showToast({
  //           title: '网络异常！err:wxpay',
  //           duration: 2000
  //         });
  //       }
  //     })
  // },


});