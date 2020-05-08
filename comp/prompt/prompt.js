Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    item1: {
      type: String,
      value: '',
    },
    item2: {
      type: String,
      value: '',
    },
    target:{
      type:String,
      value:'login'
    }
  },
  data: {
    // 这里是一些组件内部数据
    show: false
  },
  methods: {
    // 这里是一个自定义方法
    getTarget(e) {
      const target = e.target.id
      if (target == "item-1") {
        this.triggerEvent(this.data.target,{way:0})
      } else if (target == "item-2") {
        this.triggerEvent(this.data.target,{way:1})
      } else if (target == "body") {
        this.triggerEvent("closePrompt",{})
      }
    },
    changeShow(){
      this.setData({
        show:!this.data.show
      })
    }
  }
})