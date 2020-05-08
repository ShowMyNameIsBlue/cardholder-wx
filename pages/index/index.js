//index.js
//获取应用实例

const app = getApp();

Page({
  data: {
    userInfo: {},
    username: "",
    password: "",
    hasUserInfo: false,
    show: false,
    hiddlen: true,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: "../logs/logs",
    });
  },
  siginup() {
    wx.navigateTo({
      url: "./siginup/siginup"
    });

  },
  login(e) {
    const {
      way
    } = e.detail
    const that = this
    wx.request({
      url: 'http://localhost:60010/api/v0/user/sigin',
      method: "post",
      data: {
        username: this.data.username,
        password: this.data.password,
        role: way
      },
      success: function(res) {
        if (res.statusCode == 200 && res.data.code == 0) {
          const user = res.data.data
          wx.request({
            url: `http://localhost:60010/api/v0/user/${user.id}?role=${way}`,
            method: 'get',
            success: rs => {
              const {
                data,
                code
              } = rs.data;
              if (code == 0) {
                if (parseInt(way)) {
                  if(data.length){
                    app.globalData.userDetail = {
                      shopId: data[0].id,
                      userId: data[0].userId,
                      username: data[0].username
                    }
                  }else{
                    app.globalData.userDetail = {
                      shopId: '',
                      userId: user.id,
                      username: user.username
                    }
                  }
                  wx.navigateTo({
                    url: '/pages/owner/owner',
                  })
                } else {
                  app.globalData.userDetail = {
                    shopId: '',
                    userId: data[0].id,
                    username: data[0].username
                  }
                  wx.navigateTo({
                    url: '/pages/customer/customer',
                  })
                }
              }

            },
            complete:()=>{
              console.log(app.globalData.userDetail)
            }
          })

        } else if (res.statusCode == 401) {
          that.changeStatus()
          that.setData({
            show: true
          })
        }
      },
    })
  },
  changeStatus() {
    if (this.data.username && this.data.password) {
      this.setData({
        hiddlen: !this.data.hiddlen,
        show: false
      })
      this.selectComponent('#myprompt').changeShow()
    } else {
      this.setData({
        show: true
      })
    }

  },
  updateData(e) {
    if (e.target.id == "item_un") {
      this.setData({
        username: e.detail.value
      })
    } else if (e.target.id == "item_pw") {
      this.setData({
        password: e.detail.value
      })
    }
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: (res) => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
        },
      });
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },
});