// pages/owner/coupon/coupon.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    shopId: '',
    userId:'',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    const userId = app.globalData.userDetail.userId
    this.setData({
      userId
    })
    wx.request({
      url: `http://localhost:60010/api/v0/card/${userId}`,
      method: 'get',
      success: (res) => {
        if (res.statusCode == 200) {
          const {data} = res.data
          data.forEach(e=>{
            if(new Date()>new Date(e.end)){
              e.end = "已过期"
            }else{
              e.end = '有效期至:'+e.end.slice(5,10)+ ' '+e.end.slice(11,16)
            }
          })
          this.setData({
            array: data
          })
        } else {
          wx.showModal({
            content: '服务繁忙',
            showCancel: false
          })
        }
      }
    })
  },
  getImage(path) {
    return 'http://localhost:60010/' + path.substr(path.lastIndexOf('/') + 1)
  },
  modCoupon(e) {
    const id = e.target.dataset.target
    wx.navigateTo({
      url: `./detail/detail?couponId=${id} `
    })
    this.setData({
      isIndex: -1
    })
  }
})