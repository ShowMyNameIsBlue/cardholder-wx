// pages/owner/owner.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    alt: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserInfo()
  },
  myinfo() {
    const { userId } = app.globalData.userDetail;
    console.log(userId)
    wx.navigateTo({
      url: `./user/user?userId=${userId}`,
    })
  },
  startWork(e) {
    const id = e.target.id
    const target = id.substr(id.indexOf("-") + 1)
    console.log(`./${target}/${target}`)
    wx.navigateTo({
      url: `./${target}/${target}`,
    })
  },
  getUserInfo: function(e) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    } else {
      wx.getUserInfo({
        success: (res) => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
          });
        },
      });
    }
  },
})