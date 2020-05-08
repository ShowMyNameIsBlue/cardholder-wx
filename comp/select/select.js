Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    array: {
      type: Object,
      value: ['1班', '2班', '3班',],
    },
    title:{
      type: String,
      value: 'nihao',
    }
  },
  data: {
    select: false,
    selectName: "--请选择--"
  },
  methods: {
    // 这里是一个自定义方法
    bindShowMsg() {
      this.setData({
        select: !this.data.select
      })
    },
    mySelect(e) {
      var name = e.currentTarget.dataset.name
      this.setData({
        selectName: name,
        select: false
      })
      this.triggerEvent("SelectValue",{name})
    },
  }
})
