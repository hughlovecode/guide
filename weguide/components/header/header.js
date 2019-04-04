// components/header/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    collected: {
      type: String,
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    userName: '',
    userImg: '',
    userId: ''

  },
  created: function () {



  },
  attached: function () {
    this.setData({
      userName: getApp().globalData.user.userName,
      userImg: getApp().globalData.user.userImg,
      userId: getApp().globalData.user.userId
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    test: function () {
      let collected = this.data.collected
      console.log(collected)
    }

  }
})
