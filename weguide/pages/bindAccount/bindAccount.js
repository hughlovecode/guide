import http from './../../utils/http.js'
import prompt from './../../utils/prompt.js'
var app = getApp()
var that = this;
var CODE = ''
Page({
  data: {
    userId: '',
    password: ''
  },

  // 获取输入账号 
  userNameInput: function (e) {
    this.setData({
      userId: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录 
  bindAccount: function () {
    var that=this;
    if (this.data.userId.length == 0 || this.data.password.length == 0) {
      prompt.modal('错误','密码或者用户名为空,请补充完整')
    } else {
      wx.login({
        success(result){
          if(result.code){
            let params={
              code:result.code,
              userId: that.data.userId,
              password: that.data.password
            }
            http.post('/userInfo/wxBind',params)
            .then(res=>{
              let data=res.data;
                if(data.status==='0'){
                  //登录成功的操作
                  getApp().globalData.user=data.res;
                  console.log(data)
                  wx.reLaunch({
                      url: '/pages/user/user',
                    })
                }else if(data.status==='1'){
                  prompt.toast('请先注册')
                }else if(data.status==='3'){
                  prompt.toast('密码错误')
                } else {
                  prompt.toast('失败,请稍后尝试')
                  console.log(res)
                }
            })
            .catch(err=>{
              prompt.toast('绑定失败,请稍后尝试')
              console.log(err)
            })

          }else{
            prompt.toast('失败,请稍后再试')
          }
        },
        fail(err){
          prompt.toast('失败,请稍后再试')
        }
      })


      

    }
  },
  //注册
  register: function () {
    wx.navigateTo({
      url: '../register/register'
    })
  }
})