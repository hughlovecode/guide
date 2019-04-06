// pages/studentsList/studentsList.js
var util = require('../../utils/util.js');
import http from './../../utils/http.js'
import prompt from './../../utils/prompt.js'
Page({

  /**
   * Page initial data
   */
  data: {
    btnState: false,
    hiddenmodalput: true,
    barwidth: 1,
    casArray: ['手动输入', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    reply: false,
    hiddenNotice: true,
    barwidth: 0,
    hiddenTouristInfo: true,
    signCount:0

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.initData()
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  initData:function(){
    let params={
      guideId: getApp().globalData.guideDetail.guideId,
      guideSN: getApp().globalData.guideDetail.guideSN
    }
    http.post('/guide/detail',params).then(res=>{
      let data=res.data;
      if(data.status!=='0'){
        prompt.toast('出问题了啦~~')
      }else{
        getApp().globalData.guideDetail = data.result.guideDetail;
        let btnState = data.result.guideDetail.status==='0'?true:false
        this.setData({
          detail: data.result.guideDetail,
          user:getApp().globalData.user,
          btnState:btnState
        })
        let touristList = data.result.guideDetail.tourists;
        let count = data.result.guideDetail.guideCount
        if (touristList.length===0){
          prompt.toast('您还没有学生哦~')
        }
        touristList.forEach(item=>{
          item.guideState='-1';
          item.signInCount.forEach(item2=>{
            if(item2.tag===count){
              item.touristState=item2.isSign;
              if(item2.isSign==='true'){
                let newSignCount=this.data.signCount+1;
                let barwidth = (newSignCount / touristList.length)*260
                this.setData({
                  signCount:newSignCount,
                  barwidth:barwidth
                })
              }
            }
          })
        })
        console.log(touristList)
        this.setData({
          touristList:touristList
        })
        
      }
    }).catch(err=>{
      prompt.toast('错误!code=5')
    })
  },
  finish: function () {
    var that = this;
    let params = {
      guideId: this.data.detail.guideId,
      guideSN: this.data.detail.guideSN
    }
    let url = '/guide/finishSignIn';
    http.post(url, params).then((res) => {
      if (res.data.status === '0') {
        this.setData({
          btnState:!this.data.btnState
        })
        prompt.toast('已经结束签到')
      }else{
        prompt('失败!code=8')
      }
    }).catch(err=>{
      prompt.toast('失败!code=7')
    })
  },
  /*notice */
  notice: function () {
    this.setData({
      hiddenNotice: false
    })
  },
  /* wifi */
  wifiCancel: function () {
    this.setData({
      hiddenmodalput: true
    })
  },
  wifiConfirm: function () {
    this.setData({
      hiddenmodalput: true
    })
    if (this.data.guideSSID === undefined || this.data.guideSSID === '') {
      prompt.toast('请填写完整')
    } else {
      console.log(this.data.guideSSID)
      this.setSignWeek(this.data.indexValue)
    }
  },
  WifiInput: function (e) {
    this.setData({
      guideSSID: e.detail.value
    })

  },
  /* studentInfo学生信息 */
  getTouristInfo: function (e) {
    this.setData({
      info: e.target.dataset.info,
      hiddenTouristInfo: false
    })
  },
  cancelTouristInfo: function () {
    this.setData({
      hiddenTouristInfo: true
    })
  },
  /* 签到选择 */
  start:function(){},
  setSignWeek: function (indexValue) {
    var that = this;
    let params = {
      guideId: this.data.detail.guideId,
      guideSN: this.data.detail.guideSN,
      guideCount: indexValue,
      guideSSID: this.data.guideSSID
    }
    let url = '/guide/startSignIn';
    http.post(url, params).then((res) => {
      if (res.data.status === '0') {
        this.setData({
          btnState:!this.data.btnState,
          signCount:0
        })
        this.initData()
        prompt.toast('已经开始签到了')
        

      } else {
        prompt.tpast('ajax请求出错')
      }
    }).catch((err) => {
      prompt.toast('出错!code=9')
    })
  },
  bindCasPickerChange: function (e) {
    let index = e.detail.value;
    let indexValue = this.data.casArray[e.detail.value];
    console.log(indexValue);
    if (index === '0') {
      this.setData({
        reply: true
      })
    } else {
      this.setData({
        indexValue: indexValue,
        hiddenmodalput: false
      })
      //this.setSignWeek(indexValue)

    }

  },
  setCountInput: function (e) {
    this.setData({
      newCount: e.detail.value
    })
  },
  confirmSignIn: function () {
    //console.log('click confirmSignIn')
    let newCount = this.data.newCount;
    console.log(newCount)
    if (newCount == '' || newCount == undefined || parseInt(newCount) <= 0 || (newCount.indexOf('.') >= 0) || (isNaN(newCount))) {
      this.toast('请输入数字')
    } else {
      this.setData({
        indexValue: newCount,
        hiddenmodalput: false,
        reply: false
      })
    }
  },
  cancelSignIn: function () {
    this.setData({
      reply: false
    })
  },
  /* 通知 */
  cancelSetNotice: function () {
    this.setData({
      hiddenNotice: true
    })
  },
  HContentInput: function (e) {
    this.setData({
      HContent: e.detail.value
    })
  },
  HTitleInput: function (e) {
    this.setData({
      HTitle: e.detail.value
    })
  },
  confirmSetNotice: function (e) {
    this.setData({
      hiddenNotice: true
    })
    if (this.data.HContent === undefined || this.data.HContent === '' || this.data.HTitle === undefined || this.data.HTitle === '') {
      prompt.toast('请填写完整')
    } else {
      let time = util.formatTime(new Date());
      let params = {
        guideId: this.data.detail.guideId,
        guideSN: this.data.detail.guideSN,
        time: time,
        content: this.data.HContent,
        title: this.data.HTitle
      }
      http.post('/guide/addNotice',params).then(res=>{
        let data=res.data;
        if(data.status!=='0'){
          prompt.toast('错误!code=7')
        }else{
          let guideDetail=getApp().globalData.guideDetail;
          guideDetail.notice=data.res;
          getApp().globalData.guideDetail=guideDetail;
          prompt.toast('添加成功')

        }
      }).catch(err=>{
        prompt.toast('错误!code=6')
      })
    }
  },
  /* 签到与签退 */
  signIn: function (e) {
    if (this.data.detail.status === '0') {
      return this.sign(e)
    } else {
      prompt.toast('请先点击开始签到')
    }

  },
  sign: function (e) {
    let info = e.target.dataset.info
    var that = this;
    let url = '/guide/TSignIn';
    let params = {
      touristId:info.touristId,
      guideId: this.data.detail.guideId,
      guideSN: this.data.detail.guideSN
    }
    console.log(params)
    http.post(url, params).then(res => {
      if(res.data.status==='0'){
        console.log(res)
        prompt.toast('已签')
        this.setData({
          signCount:0
        })
        this.initData()
      }else{
        prompt.toast('错误!')
      }
    }).catch(err=>{
      prompt.toast('错误!code=10')
    })
  },
  signOut: function (e) {
    let info = e.target.dataset.info;
    if (this.data.detail.status === '0') {
      var that = this;
      let url = '/guide/TSignOut';
      let params = {
        touristId: info.touristId,
        guideId: this.data.detail.guideId,
        guideSN: this.data.detail.guideSN
      }
      console.log(params)
      http.post(url, params).then(res => {
        if (res.data.status === '0') {
          prompt.toast('已取消签到')
          this.setData({
            signCount: 0
          })
          this.initData()
        } else {
          prompt.toast('错误!')
        }
      }).catch(err => {
        prompt.toast('错误!code=11')
      })

    } else {
      prompt.toast('请先点击开始签到')
    }
  }
})