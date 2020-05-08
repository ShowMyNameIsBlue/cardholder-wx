// pages/owner/coupon/coupon.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    isIndex: -1,
    shopId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    const shopId = app.globalData.userDetail.shopId
    wx.request({
      url: `http://localhost:60010/api/v0/shop/${shopId}?type=0`,
      method: 'get',
      success: (res) => {
        if (res.statusCode == 200) {
          this.setData({
            array: res.data.data,
            shopId
          })
          console.log("请求列卡券列表成功")
        } else {
          wx.showModal({
            content: '服务繁忙',
            showCancel: false
          })
        }
      }
    })
  },
  create() {
    wx.navigateTo({
      url: `./detail/detail?shopId=${this.data.shopId}`,
    })
  },
  getImage(path) {
    return 'http://localhost:60010/' + path.substr(path.lastIndexOf('/') + 1)
  },
  changeOption(e) {
    const id = e.target.dataset.id
    if (this.data.isIndex == id) {
      this.setData({
        isIndex: -1
      })
    } else {
      this.setData({
        isIndex: id
      })
    }
  },
  modCoupon(e) {
    const id = e.target.dataset.target
    wx.navigateTo({
      url: `./detail/detail?couponId=${id} `
    })
    this.setData({
      isIndex: -1
    })
  },
  delCoupon(e) {
    const id = e.target.dataset.target
    wx.showModal({
      content: '删除此vip卡',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: `http://localhost:60010/api/v0/coupon/${id}`,
            method: "delete",
            success: res => {
              if (res.statusCode == 200) {
                this.onShow()
              }
            },
            fail: res => {
              Console.log(res)
            }
          })
        }
      }
    })
    this.setData({
      isIndex: -1
    })
  }
})