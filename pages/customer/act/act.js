// pages/customer/act/act.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sname: '',
    area: "",
    aname: '',
    start: '',
    end: "",
    content: '',
    activityId: '',
    couponId: '',
    shopId: '',
    userId: ''
  },
  submit() {
    const {
      couponId,
      userId,
      shopId
    } = this.data
    wx.request({
      url: `http://localhost:60010/api/v0/card/${userId}`,
      method: "put",
      data: {
        couponId,
        shopId,
        cardInfo: couponId
      },
      success: res => {
        const {
          data,
          code
        } = res.data
        if (code == 0) {
          wx.showModal({
            content: '领券参加成功',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }else{
          wx.showModal({
            content: '已参加过该活动',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      }
    })
  },
  getInput(e) {
    const target = e.target.id
    this.setData({
      [target]: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ...options,
      userId: app.globalData.userDetail.userId
    })
    wx.request({
      url: `http://localhost:60010/api/v0/activity/actImage?id=${this.data.activityId}`,
      method: 'get',
      success: res => {
        const {
          data,
          code
        } = res.data
        if (code == 0) {
          const {
            name,
            start,
            end,
            desc,
            shopId,
            couponId
          } = data[0]
          this.setData({
            aname: name,
            start: start.slice(5, 10) + ' ' + start.slice(11, 16),
            end: end.slice(5, 10) + ' ' + end.slice(11, 16),
            desc,
            shopId,
            couponId
          })
          wx.request({
            url: `http://localhost:60010/api/v0/shop/detail/${shopId}`,
            method: "get",
            success: res => {
              const {
                data,
                code
              } = res.data
              if (code == 0) {
                this.setData({
                  sname: data[0].name,
                  area: data[0].area
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
})