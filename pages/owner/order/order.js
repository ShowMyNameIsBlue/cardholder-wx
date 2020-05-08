// pages/owner/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[1],
    shopId:'',
    isIndex:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  updateStatus(e){
    console.log(e)
    const {target} = e.target.dataset
    let status  = target[1]?1:2
    wx.request({
      url: `http://localhost:60010/api/v0/order/${target[0]}`,
      method:'put',
      data:{
        status
      },
      success:res=>{
        const {data,code} = res.data
        if(code==0){
          wx.showModal({
            content: '操作成功',
            showCancel:false,
            success:res=>{
              if(res.confirm){
                this.onLoad()
              }
            }
          })
        }
      }
    })
  },
  onLoad: function (options) {
    const {shopId} = app.globalData.userDetail
    wx.request({
      url: `http://localhost:60010/api/v0/order/${shopId}?type=1`,
      method:'get',
      success:res=>{
        const {data,code} = res.data
        if(code==0){
          const array  = data.map(e=>{
            e.start = e.start.slice(5, 10) + ' ' + e.start.slice(11, 16)
            e.end = e.end.slice(5, 10) + ' ' + e.end.slice(11, 16)
            return e
          })
          console.log(array)
          this.setData({
            array
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