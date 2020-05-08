// pages/index/siginup/siginup.js

import {
  routes
} from "../../../config/index.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    username: "",
    password: "",
    pwd: "",
    role: 0,
    status_1: "success",
    status_2: "cancel",
    status_3: "cancel",
    result: null,
    show: false,
    content:"该用户名已注册!"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      username: app.globalData.userInfo.nickName
    })
  },
  bindSubmit(e) {
    if (this.data.status_1 == "success" && this.data.status_2 == "success" && this.data.status_3 == "success") {
      const {
        code
      } = this.data.userInfo
      const that = this
      wx.request({
        url: 'http://localhost:60010/api/v0/user/siginup',
        method: "post",
        data: {
          username: this.data.username,
          password: this.data.password,
          role: this.data.role,
          code
        },
        success: function(res) {
          if (res.statusCode == 200 && res.data.code == 0) {
            that.uploadUserInfo({
              name:that.data.username,
              gender:that.data.userInfo.gender,
              number:"",
              area: that.data.userInfo.country,
              userId: res.data.data.insertId,
            })
            app.globalData.userDetail = {
              shopId: '',
              userId: res.data.data.insertId,
              username: that.data.username
            }
          } else if (res.statusCode == 401) {
            that.setData({
              show: true
            })
          }
        },
        fail: function(res) {
          console.log(res)
        }``
      })
    }
  },
  radioChange(e) {
    console.log(e.detail.value)
    this.setData({
      role: e.detail.value
    })
  },
  uploadUserInfo({
    name,
    gender,
    number,
    area,
    userId,
  }) {
    wx.request({
      url: 'http://localhost:60010/api/v0/customer/create',
      method: "post",
      data: {
        name,
        gender,
        number,
        area,
        userId
      },
      success: (res) => {
        if (res.statusCode == 200 && res.data.code == 0) {
          this.setData({
            show: false,
            result: res.data
          })
          if (this.data.role) {
            wx.navigateTo({
              url: '/pages/owner/owner',
            })
          } else {
            wx.navigateTo({
              url: '/pages/customer/customer',
            })
          }
        }else{
          this.setData({
            show: true,
            content: "服务不可用...!!!"
          })
        }
      }
    })
  },
  updateData(e) {
    const status = e.target.id
    switch (status) {
      case "status_1":
        this.setData({
          username: e.detail.value
        })
        if (e.detail.value) {
          this.setData({
            "status_1": "success"
          })
        } else {
          this.setData({
            "status_1": "cancel"
          })
        }
        break;
      case "status_2":
        this.setData({
          password: e.detail.value
        })
        if (e.detail.value.length >= 6) {
          this.setData({
            "status_2": "success"
          })
        } else {
          this.setData({
            "status_2": "cancel"
          })
        }
        break;
      case "status_3":
        {
          this.setData({
            pwd: e.detail.value
          })
          if (this.data.password && e.detail.value == this.data.password) {
            this.setData({
              "status_3": "success"
            })
          } else {
            this.setData({
              "status_3": "cancel"
            })
          }
        }
    }
  }
})