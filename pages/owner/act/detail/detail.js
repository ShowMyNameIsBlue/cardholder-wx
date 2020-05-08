// pages/owner/act/detail/detail.js
const util = require("../../../../utils/util.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "创建活动",
    name: '',
    start: '',
    end: '',
    desc: "",
    time: util.formatTime(new Date()).split(' ')[0],
    shopId: '',
    couponId: '',
    activityId: '',
    multiArray: [],
    mutilId: []
  },
  submit() {
    const {
      title,
      name,
      start,
      end,
      desc,
      shopId,
      activityId,
      couponId,
      multiArray
    } = this.data
    if (!name || !start || !end || !desc || !couponId) {
      wx.showModal({
        content: '请完善所有信息',
        showCancel: false
      })
    } else if (!multiArray.length) {
      wx.showModal({
        content: '创建活动需要绑定卡券，请先创建会员卡或优惠券',
        showCancel: false
      })
    } else {
      let method, content, url
      if (title == "创建活动") {
        method = "post"
        content = "创建成功"
        url = 'http://localhost:60010/api/v0/activity/create'
      } else {
        method = "put"
        content = "修改成功"
        url = `http://localhost:60010/api/v0/activity/${activityId}`
      }
      wx.request({
        url,
        method,
        data: {
          name,
          start,
          end,
          desc,
          shopId,
          couponId
        },
        success: res => {
          const {
            data,
            code
          } = res.data
          if (code == 0) {
            wx.showModal({
              content,
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
        },
        fail: res => {
          console.log(res)
        }
      })
    }
  },
  getInput(e) {
    const target = e.target.id
    this.setData({
      [target]: e.detail.value
    })
  },
  setCouponId(e) {
    const {
      mutilId,
      multiArray
    } = this.data
    this.setData({
      couponId: mutilId[multiArray.indexOf(e.detail.name)]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const {
      shopId
    } = app.globalData.userDetail
    this.setData({ ...options,
      shopId
    })
    wx.request({
      url: `http://localhost:60010/api/v0/shop/${shopId}?type=2`,
      method: "get",
      success: (res) => {
        const {
          data,
          code
        } = res.data
        if (code == 0) {
          const multiArray = []
          const mutilId = []
          data.forEach(e => {
            multiArray.push(e.cname)
            mutilId.push(e.cid)
          })
          this.setData({
            multiArray,
            mutilId
          })
        }
      }
    })
    if (options.activityId) {
      wx.request({
        url: `http://localhost:60010/api/v0/activity/${options.activityId}?type=0`,
        method: "get",
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
              desc
            } = data[0]
            this.setData({
              name,
              start: start.split('T')[0],
              end: end.split('T')[0],
              desc,
              title: "修改活动"
            })
          }
        },
        fail: res => {
          console.log(res)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


  },
})