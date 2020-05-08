// pages/owner/act/act.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId:"",
    array:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  create(){
    wx.navigateTo({
      url: `./detail/detail?shopId=${this.data.shopId}`,
    })
  },
  modAct(e){
    const { target } = e.target.dataset
    wx.navigateTo({
      url: `./detail/detail?activityId=${target}`,
    })
  },
  delAct(e){
    const { target } = e.target.dataset 
    wx.showModal({
      content: '删除此活动',
      success:res=>{
        if(res.confirm){
            wx.request({
              url: `http://localhost:60010/api/v0/activity/${target}`,
              method:"delete",
              success:res=>{
                this.onShow()
              }
            })
        }
      }
    })
  },
  onLoad: function (options) {
    const shopId = app.globalData.userDetail.shopId
    this.setData({
      shopId
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.request({
      url: `http://localhost:60010/api/v0/activity/${this.data.shopId}?type=1`,
      method: "get",
      success: res => {
        const { data, code } = res.data
        if (code == 0) {
         const newData = data.map(e=>{
            e.start = e.start.slice(5,10)
            e.end = e.end.slice(5,10)
            return e
          })
          this.setData({
            array: newData
          })
        }
      }
    })
  }
})