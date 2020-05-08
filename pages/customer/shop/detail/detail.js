// pages/customer/shop/detail/detail.js
const util = require("../../../../utils/util.js")
const app = getApp()
console.log(app.globalData.userDetail)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    shopId: '',
    shopDetail: '',
    coupon: [],
    comment: [],
    order: [],
    words: '',
    userId: '',
    username: '',
    date: '',
    start: '',
    end: '',
    content: '',
    time: util.formatTime(new Date()).split(' ')[0],
    dateTime: util.formatTime(new Date()).split(' ')[1]
  },

  checked(e) {
    const {
      index
    } = e.target.dataset
    const {
      shopId,
      comment,
      coupon
    } = this.data
    switch (index) {
      case "1":
        if (!coupon.length) {
          wx.request({
            url: `http://localhost:60010/api/v0/shop/${shopId}?type=2`,
            method: "get",
            success: res => {
              const {
                data,
                code
              } = res.data
              if (code == 0) {
                this.setData({
                  coupon: data
                })
              }
            }
          })
        }
        break;
      case "2":
        if (!comment.length) {
          wx.request({
            url: `http://localhost:60010/api/v0/comment/${shopId}`,
            method: 'get',
            success: res => {
              const {
                data,
                code
              } = res.data
              if (code == 0) {
                data.map(e => {
                  e.commentInfo = JSON.parse(e.commentInfo)
                  return e
                })
                this.setData({
                  comment: data[0].commentInfo
                })
              }
            }
          })
        }
        break;
    }
    this.setData({
      index
    })
  },
  submitContent(e) {
    const {
      userId,
      shopId,
      start,
      date,
      end,
      content,
      username,
      shopDetail
    } = this.data
    if (!start || !end || !content || !username || !date) {
      wx.showModal({
        content: '请完善所有信息',
        showCancel: false
      })
    } else {
      wx.request({
        url: `http://localhost:60010/api/v0/order/create`,
        method: 'post',
        data: {
          userId,
          shopId,
          start: date + ' ' + start,
          end: date + ' ' + end,
          username,
          content,
          shopname: shopDetail.sname
        },
        success: res => {
          const {
            data,
            code
          } = res.data
          if (code == 0) {
            wx.showModal({
              content: '创建预约成功',
              showCancel: false
            })
          }else{
            wx.showModal({
              content: '该时间段已有预约',
              showCancel: false
            })
          }
        }
      })
    }
  },
  getCard(e) {
    const {
      userId,
      shopId
    } = this.data
    const couponId = e.target.dataset.target
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
            content: '领券成功',
            showCancel: false
          })
        } else {
          wx.showModal({
            content: '已领取成功',
            showCancel: false
          })
        }
      }
    })
  },
  submit(e) {
    const {
      shopId,
      userId,
      username,
      words
    } = this.data
    wx.request({
      url: 'http://localhost:60010/api/v0/comment/create',
      method: "post",
      data: {
        shopId,
        commentInfo: {
          userId,
          username,
          words
        }
      },
      success: res => {
        const {
          data,
          code
        } = res.data
        if (code == 0) {
          wx.showModal({
            content: '评论成功',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                this.setData({
                  index: 2,
                  words: ''
                })
                wx.request({
                  url: `http://localhost:60010/api/v0/comment/${shopId}`,
                  method: 'get',
                  success: res => {
                    const {
                      data,
                      code
                    } = res.data
                    if (code == 0) {
                      data.map(e => {
                        e.commentInfo = JSON.parse(e.commentInfo)
                        return e
                      })
                      this.setData({
                        comment: data[0].commentInfo
                      })
                    }
                  }
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
  onLoad: function(options) {
    this.setData({
      ...options,
      userId: app.globalData.userDetail.userId,
      username: app.globalData.userDetail.username,
    })
  },
  onShow: function() {
    const {
      shopId,
      shopDetail,
      coupon
    } = this.data
    if (!shopDetail) {
      wx.request({
        url: `http://localhost:60010/api/v0/shop/${shopId}?type=0&skip=0&limit=1`,
        method: 'get',
        success: res => {
          const {
            data,
            code,
          } = res.data
          if (code == 0) {
            this.setData({
              shopDetail: data[0]
            })
          }
        }
      })
    }
    if (!coupon.length) {
      wx.request({
        url: `http://localhost:60010/api/v0/shop/${shopId}?type=2`,
        method: "get",
        success: res => {
          const {
            data,
            code
          } = res.data
          if (code == 0) {
            this.setData({
              coupon: data
            })
          }
        }
      })
    }
  }
})