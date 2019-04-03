//app.js
import http from './utils/http.js'
import prompt from './utils/prompt.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if(res.code){
        http.post('/userInfo/wxLogin',{code:res.code}).then(res=>{
          let data=res.data;
          if(data.status==='3'){
            prompt.modal('提示','请先绑定账号')
            .then(res=>{
              
            })
            .catch(err=>{
              prompt.toast('异常!code=3')
            })
          }else if(data.status==='0'){
            prompt.toast('成功')
          }else{
            prompt.toast('异常!code=0')
          }
        }).catch(err=>{
          prompt.toast('异常!code=1')
        })

      }else{
        prompt.toast('res.code无法得到')
      }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})