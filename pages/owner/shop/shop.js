// pages/owner/shop/shop.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId: '',
    ready: false,
    source: '',
    name: '',
    type: '',
    area: '',
    desc: '',
    image_show: false,
    header_show: true,
    path: '',
    btnContent: "点击创建"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const shopId = app.globalData.userDetail.shopId
    if (shopId) {
      wx.request({
        url: `http://localhost:60010/api/v0/shop/detail/${shopId}`,
        method: "get",
        success: (res) => {
          if (res.statusCode == 200) {
            const {
              name,
              area,
              type,
              desc,
              imgPath
            } = res.data.data[0]
            this.setData({
              name,
              area,
              type,
              desc,
              source: imgPath,
              path: imgPath,
              header_show: true,
              btnContent: "点击修改",
              ready: true,
              shopId
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const shopId = app.globalData.userDetail.shopId
    if (shopId) {
      this.setData({
        ready: true,
        shopId
      })
    }
  },
  create() {
    this.setData({
      header_show: false,
      ready: true,
      area: "点击选择",

    })
  },
  getInput(e) {
    const target = e.target.id
    this.setData({
      [target]: e.detail.value
    })
  },
  getArea() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          area: res.address
        })
      },
    })
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
        },
        fail: res => {
          reject(res)
        }
      })
    })
  },
  async update() {
    const {
      userId
    } = app.globalData.userDetail;
    if (this.data.btnContent == "点击修改") {
      const {
        path,
        source
      } = this.data
      if (path != source) {
        const res = await this._upload()
        this.setData({
          source: res,
          path: res
        })
      }
      let {
        name,
        area,
        type,
        desc,
        shopId
      } = this.data
      const newPath = this.data.path
      wx.request({
        url: `http://localhost:60010/api/v0/shop/${shopId}`,
        method: "put",
        data: {
          name,
          area,
          type,
          desc,
          imgPath: newPath
        },
        success: (res) => {
          if (res.statusCode == 200) {
            this.setData({
              header_show: true,
              image_show: false
            })
          }
        }
      })
    } else {
      let {
        name,
        area,
        type,
        desc,
        path,
      } = this.data
      wx.uploadFile({
        url: 'http://localhost:60010/api/v0/util/upload',
        filePath: this.data.source,
        name: 'file',
        success: (res) => {
          if (res.statusCode == 200) {
            const imgPath = JSON.parse(res.data).data
            this.setData({
              path: imgPath,
              source: imgPath
            })
            wx.request({
              url: 'http://localhost:60010/api/v0/shop/create',
              method: "post",
              data: {
                name,
                area,
                type,
                desc,
                userId,
                path: imgPath
              },
              success: (res) => {
                if (res.statusCode == 200) {
                  const {
                    insertId
                  } = res.data.data
                  this.setData({
                    header_show: true,
                    image_show: false,
                    shopId: insertId,
                    btnContent: "点击修改"
                  })
                  app.globalData.userDetail.shopId = insertId
                }
              },
              fail: (res) => {
                console.log(res)
              }
            })
          }
        }

      })
    }

  },
  uploadimg: function() {
    var that = this;
    wx.chooseImage({ //从本地相册选择图片或使用相机拍照

      count: 1, // 默认9

      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有

      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有

      success: function(res) {

        //console.log(res)
        //前台显示
        that.setData({
          source: res.tempFilePaths[0],
          image_show: true
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      }
    })
  },
  checkValue() {
    let {
      name,
      area,
      type,
      desc,
      source
    } = this.data
    if (!name || !area || !type, !desc ||!source){
      console.log(name,
        area,
        type,
        desc,
        path,
        source)
      wx.showModal({
        content: '请完善所有信息',
      })
    } else {
      this.update()
    }
  }
})