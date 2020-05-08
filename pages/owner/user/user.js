// pages/owner/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    username: '',
    role: '',
    number: '',
    gender: '',
    area: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const {
      userId
    } = this.data
    if (!userId) {
      let user = options.userId
      wx.request({
        url: `http://localhost:60010/api/v0/user/detail/${user}`,
        method: 'get',
        success: res => {
          const {
            data,
            code
          } = res.data
          if (code == 0) {
            const {
              username,
              userId: user,
              gender,
              area,
              role,
              number
            } = data[0]
            this.setData({
              username,
              userId:user,
              gender,
              area,
              role,
              number
            })
          }
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  exit(){
    const {userId}= this.data
    if(userId){
      wx.request({
        url: 'http://localhost:60010/api/v0/user/exit',
        method:"post",
        complete:res=>{
         wx.showModal({
           content: '退出成功',
           complete:res=>{
             wx.navigateTo({
               url: '/pages/index/index',
               success: () => {
                 app.globalData.userDetail = {
                   shopId: "",
                   userId: "",
                   username: ""
                 }
               }
             })
           }
         })
        }
      })
    }
  },
  onShow: function() {
    
  }
})