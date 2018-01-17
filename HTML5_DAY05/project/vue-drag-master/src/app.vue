<template>
  <div>
    <Drag :dragContent="dragContent" @change-data="changeData"></Drag>
  </div>
</template>

<script>
import Drag from './drag.vue'
import Vue from 'vue'
export default {
  data () {
    return {
      dragContent: [
        {name: 'a', id: 1, children: [
          {name: 'a.a', id: 7, children: []}
        ]},
        {name: 'b', id: 2, children: []},
        {name: 'c', id: 3, children: []},
        {name: 'd', id: 4, children: []},
        {name: 'e', id: 5, children: []},
        {name: 'f', id: 6, children: []},
      ]
    }
  },

  created () {
    this.setDepth(this.dragContent)
  },

  methods: {
    findCatalogById (collection, targetId, callback) {
      for (let i = 0; i < collection.length; i++) {
        if (collection[i].id === Number(targetId)) {
          callback(collection[i], collection)
          return
        } else if (collection[i].children.length > 0) {
          this.findCatalogById(collection[i].children, targetId, callback)
        } else {

        }
      }
    },

    setDepth (collection, value = 1) {
      collection.forEach(item => {
        Vue.set(item, 'depth', value)
        item.depth = value
        if (item.children.length > 0) this.setDepth(item.children, value + 1)
      })
    },

    changeData (payload) {
      this.findCatalogById(this.dragContent, payload.originId, (targetObj, collection) => {
        // 先删除被拖拽的数据
        let location = _.findIndex(collection, function(chr) {
          return chr.id === targetObj.id
        })
        collection.splice(location, 1)

        let data = payload.data

        this.findCatalogById(this.dragContent, payload.targetId, (targetObj, collection) => {
          // 再将被拖拽的数据放入drop的位置
          if (payload.isChild) {
            targetObj.children.push(data)

            this.setDepth(this.dragContent)
          } else {
            let location = _.findIndex(collection, function(chr) {
              return chr.id === targetObj.id
            })

            collection.splice(location + 1, 0, data)

            this.setDepth(this.dragContent)
          }
        })
      })
    }
  },

  components: {
    Drag
  }
}
</script>

<style lang="scss" scoped>

</style>


