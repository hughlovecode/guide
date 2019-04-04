// pages/user/user.js
import http from './../../utils/http.js';
import prompt from './../../utils/prompt.js'
var that = this;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    collected: 1,
    hidden: true,
    nocancel: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData.user)
    this.setData({
      user: getApp().globalData.user
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList(getApp().globalData.user.guideList)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getList:function(arr){
    console.log(arr)
    let list=[];
    if(arr.length===0){
      prompt.toast('您没有旅程')
    }else{
      arr.forEach(item => {
        http.post('/guide/detail', item).then(res => {
          let data = res.data;
          if (data.status === '0') {
            list.push(data.result.guideDetail)
            if (list.length === arr.length) {
              this.setData({
                guideList: list
              })
              console.log(list)
            }
          } else {
            prompt.toast('出问题了,请稍候再试')
            console.log(res)
          }
        }).catch(err => {
          console.log(err)
          prompt.toast('出问题了,请稍候再试')
        })
      })
    }
  },
  getVisitors: function (e) {
    let data = e.target.dataset.info;
    getApp().globalData.guideDetail=data;
    wx.redirectTo({
      url: '/pages/touristList/touristList',
    })

  },
  getInfo: function (e) {
    let data = e.target.dataset.info;
    this.setData({
      detail:data,
      hidden:false
    })
  },
  cancel: function () {
    this.setData({
      hidden: true
    })
  },
  showTip: function (info) {
    wx.showToast({
      title: info,
      icon: 'none'
    })
  }
})