// pages/owner/summary/summary.js

import * as echarts from "../../../../comp/ec-canvas/echarts.js"
const app = getApp()

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);
  initData().then(res => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} \n{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['卡券领取数量', '活动参加次数', '服务预约次数']
      },
      series: [{
        name: '访问来源',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '28',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: res
      }]
    };
  }).then(option => {
    chart.setOption(option);
  })
  return chart;


}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  }
})

function initData() {
  const {
    userId
  } = app.globalData.userDetail
  let
    coupon = 0,
    order = 0
  return new Promise(resolve => {
    wx.request({
      url: `http://localhost:60010/api/v0/card/${userId}`,
      method: 'get',
      success: res => {
        const {
          data,
          code
        } = res.data
        if (code == 0) {
          coupon = data.length
          wx.request({
            url: `http://localhost:60010/api/v0/order/${userId}?type=0`,
            method: 'get',
            success: res => {
              const {
                data,
                code
              } = res.data
              if (code == 0) {
                order = data.length
              }
              resolve([{
                value: coupon,
                name: "卡券领取数量"
              }, {
                value: coupon,
                name: "活动参加次数"
              }, {
                value: order,
                name: "服务预约次数"
              }])
            }
          })
        }
      }
    })
  })

}