// pages/tripNote/tripNote.js
import http from './../../utils/http.js'
import prompt from './../../utils/prompt.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    prompt.modal('请求获取当前位置', '请允许我们访问您的当前位置').then(() => { this.getTripList()},
    ()=>{
      prompt.toast('已取消')
    }
    ).catch(err=>{
      prompt.toast('错误!code=12')
    })
    */
    this.getTripList()

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
  getTripList:function(){
    let params={
      city:'chengdu'
    }
    console.log(params)
    http.post('/trip/',params).then(res=>{
      if(res.data.status==='0'){
        let list=res.data.res;
        let leftList = list.slice(0, Math.floor(list.length / 2));
        let rightList = list.slice(Math.floor(list.length / 2));
        this.setData({
          city:params.city,
          leftList:leftList,
          rightList:rightList
        })
        console.log(res)
      }else{
        prompt.toast('失败!code=13')
      }
    }).catch(err=>{
      prompt.toast('失败!code=11')
    })
  },
  toDetail:function(e){
    let info=e.target.dataset.info;
    getApp().globalData.glDetail=info;
    wx.navigateTo({
      url: '/pages/tripNote/tripDetail',
    })
  }
})