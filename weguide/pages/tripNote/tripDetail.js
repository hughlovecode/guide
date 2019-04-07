// pages/tripNote/tripDetail.js
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
    this.getDetail()
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
  getDetail:function(){
    let glDetail = getApp().globalData.glDetail;
    let params={
      link:glDetail.link
    }
    http.post('/trip/detail',params).then(res=>{
      if(res.data.status==='0'){
        let detail=res.data.res;
        let imgList=detail.imgList.length>8?detail.imgList.slice(0,8):detail.imgList;
        detail.imgList=imgList;
        detail.time=glDetail.time;
        detail.title=glDetail.title;
        let pList=detail.pList;
        let newPlist=[];
        pList.forEach((item,index)=>{
          let newItem = item.replace(/\r\n/g, "")
          newItem = newItem.replace(/\n/g, "");
          newItem = newItem.replace(/\s/g, "");
          newPlist.push(newItem)
        })
        detail.pList=newPlist;
        console.log(detail)
        this.setData({
          detail:detail
        })
      }else{
        prompt.toast('错误!code=16')
      }
    },err=>{
      prompt.toast('错误!code=14')
    }).catch(err=>{
      prompt.toast('错误!code=15')
    })
    
  }
})