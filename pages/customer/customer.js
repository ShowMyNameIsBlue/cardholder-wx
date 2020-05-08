// pages/customer/customer.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    userId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  goto(e){
    const activityId = e.currentTarget.dataset.target
    wx.navigateTo({
      url: `./act/act?activityId=${activityId}`,
    })
  },
  gotoShop(e) {
    wx.navigateTo({
      url: `./shop/shop`,
    })
  },
  gotoAll(e){
    wx.navigateTo({
      url: `./all/all`,
    })
  },
  onLoad: function(options) {
    this.setData({
      userId: app.globalData.userDetail.userId
    })
  },
  onShow: function() {
    wx.request({
      url: 'http://localhost:60010/api/v0/activity/actImage',
      method: "get",
      success: res => {
        const {
          data,
          code
        } = res.data
        if (code == 0) {
          data.map(e=>{
            e.start = e.start.slice(5, 10) +' '+ e.start.slice(11,16)
            e.end = e.end.slice(5, 10) + ' ' + e.end.slice(11, 16)
            return e
          })
          this.setData({
            array: data
          })
        }
      }
    })
  },

})