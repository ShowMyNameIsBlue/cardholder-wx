// pages/owner/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    userId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { userId } = app.globalData.userDetail
    wx.request({
      url: `http://localhost:60010/api/v0/order/${userId}?type=0`,
      method: 'get',
      success: res => {
        const { data, code } = res.data
        if (code == 0) {
          const array = data.map(e => {
            e.start = e.start.slice(5, 10) + ' ' + e.start.slice(11, 16)
            e.end = e.end.slice(5, 10) + ' ' + e.end.slice(11, 16)
            return e
          })
          this.setData({
            array,
            userId
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})