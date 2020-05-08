// pages/customer/shop/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    key: '',
    cancel: false,
    result: []
  },
  
  gotoDetail(e) {
    const {
      target
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `./detail/detail?shopId=${target}`,
    })
    this.setData({
      cancel: false,
      result: []
    })
  },
  back() {
    this.setData({
      cancel: false,
      result: []
    })
  },
  // search() {
  //   const {
  //     key
  //   } = this.data
  //   wx.request({
  //     url: `http://localhost:60010/api/v0/shop/search?key=${key}`,
  //     method: 'get',
  //     success: res => {
  //       const {
  //         data,
  //         code
  //       } = res.data
  //       if (code == 0) {
  //         this.setData({
  //           result: data
  //         })
  //       }
  //     }
  //   })
  // },
  changeStatus() {
    this.setData({
      cancel: true
    })
  },
  getInput(e) {
    const target = e.target.id
    this.setData({
      [target]: e.detail.value
    })
    const key = e.detail.value
    wx.request({
      url: `http://localhost:60010/api/v0/shop/search?key=${key}`,
      method: 'get',
      success: res => {
        const {
          data,
          code
        } = res.data
        if (code == 0) {
          this.setData({
            result: data
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const {array} = this.data
    if (!array.length) {
      wx.request({
        url: `http://localhost:60010/api/v0/shop/list`,
        method: 'get',
        success: res => {
          const {
            data,
            code
          } = res.data
          if (code == 0) {
            this.setData({
              array: data
            })
          }
        }
      })
    }
  }
})