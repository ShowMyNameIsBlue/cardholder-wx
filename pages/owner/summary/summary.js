// pages/owner/summary/summary.js

import * as echarts from "../../../comp/ec-canvas/echarts.js"
const app = getApp()

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);
  initData().then(res => {
    return  {
      tooltip: {
        trigger: 'item',
        formatter: '{a} \n{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['vip卡办理人数', '卡券领取人数', '活动参加人数', '服务预约人数']
      },
      series: [
        {
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
          data:res
        }
      ]
    };
  }).then(option=>{
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
    shopId
  } = app.globalData.userDetail
  let vip = 0,
    coupon = 0,
    act = 0,
    order = 0
  return new Promise(resolve => {
    wx.request({
      url: `http://localhost:60010/api/v0/coupon/count/${shopId}`,
      method: 'get',
      success: res => {
        const {
          data,
          code
        } = res.data
        if (code == 0) {
          vip = data.vip;
          coupon = data.coupon
          wx.request({
            url: `http://localhost:60010/api/v0/activity/count/${shopId}`,
            method: 'get',
            success: res => {
              const {
                data,
                code
              } = res.data
              if (code == 0) {
                act = data
              }
              wx.request({
                url: `http://localhost:60010/api/v0/order/${shopId}?type=1`,
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
                    value: vip,
                    name: "vip卡办理人数"
                  }, {
                    value: coupon,
                      name: "卡券领取人数"
                  }, {
                    value: act,
                      name: "活动参加人数"
                  }, {
                    value: order,
                      name: "服务预约人数"
                  }])
                }
              })
            }
          })
        }
      }
    })
  })

}