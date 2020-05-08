// pages/owner/coupon/detail/detail.js
const util = require("../../../../utils/util.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '创建优惠券',
    source: '',
    image_show: false,
    name: '',
    start: '',
    end: '',
    number: '',
    path: '',
    count: '',
    time: util.formatTime(new Date()).split(' ')[0],
    couponId: '',
    shopId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const {shopId} = app.globalData.userDetail
    this.setData({
      ...options,
      shopId
    })
    if (options.couponId) {
      console.log(options.couponId)
      wx.request({
        url: `http://localhost:60010/api/v0/coupon/${options.couponId}`,
        method: "get",
        success: (res) => {
          if (res.statusCode == 200 && res.data.data.length) {
            const {
              name,
              number,
              start,
              end,
              count,
              imgPath,
            } = res.data.data[0]
            this.setData({
              name,
              number,
              start: start.split('T')[0],
              end: start.split('T')[0],
              count,
              source: imgPath,
              path: imgPath,
              image_show: true,
              title: "修改优惠券",
              ...options,
            })
          }
        }
      })
    } else {
      console.log("没有卡券")
    }
  },
  getInput(e) {
    const target = e.target.id
    this.setData({
      [target]: e.detail.value
    })
  },
  async upload() {
    if (this.data.title == "创建优惠券") {
      const {
        name,
        start,
        end,
        source,
        count
      } = this.data;
      if (!name || !start || !count || !end || !source ) {
        wx.showModal({
          content: '请完善必要信息',
          showCancel: false
        })
      }else{
        const path = await this._upload()
        this.setData({
          path,
          source: path
        })
        this.create()
      }
    } else {
      if (this.data.path != this.data.source) {
        const path = await this._upload()
        this.setData({
          path,
          source: path
        })
      }
      this.update()
    }

  },
  _upload() {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: 'http://localhost:60010/api/v0/util/upload',
        filePath: this.data.source,
        name: 'file',
        success: (res) => {
          if (res.statusCode == 200) {
            const {
              data
            } = JSON.parse(res.data)
            resolve(data)
          }
          console.log("上传成功")
        },
        fail: res => {
          reject(res)
        }
      })
    })
  },
  create() {
    const {
      name,
      start,
      end,
      count,
      path,
      number,
      shopId
    } = this.data;
    wx.request({
      url: 'http://localhost:60010/api/v0/coupon/create',
      method: "post",
      data: {
        name,
        start,
        end,
        number,
        count,
        type: 1,
        path,
        shopId
      },
      success: (res) => {
        if (res.statusCode == 200) {
          wx.showModal({
            content: '创建成功',
            showCancel: false,
            success: (res) => {
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
  update() {
    const {
      name,
      start,
      end,
      count,
      path,
      number,
      couponId,
    } = this.data;
    wx.request({
      url: `http://localhost:60010/api/v0/coupon/${couponId}`,
      method: "put",
      data: {
        name,
        start,
        end,
        number,
        count,
        imgPath: path
      },
      success: (res) => {
        if (res.statusCode == 200) {
          wx.showModal({
            content: '修改成功',
            showCancel: false,
            success: (res) => {
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
  onShow() {
   
  },
  uploadimg: function() {
    var that = this;
    wx.chooseImage({ //从本地相册选择图片或使用相机拍照

      count: 1, // 默认9

      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有

      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有

      success: function(res) {
        //前台显示
        that.setData({
          source: res.tempFilePaths[0],
          image_show: true
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      }
    })
  },
})