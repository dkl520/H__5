<template>
  <div class="drag">
    <div
      v-for="dragItem in dragContent"
      :key="getUniqueKey()"
      :draggable="true"
      @dragstart="handleDragStart($event, dragItem)"
      @dragenter="handleDragEnter($event)"
      @dragover="handleDragOver($event)"
      @dragleave="handleDragLeave($event)"
      @dragend="hanldeDragEnd($event)"
      @drop="hanldeDrop($event, dragItem.id)">

      <div class="drag-item"
        :id="dragItem.id"
        :style="{marginLeft: 20 * (dragItem.depth - 1) + 'px'}">
        {{dragItem.name}}
        <div class="divide-line"></div>
      </div>

      <drag
        v-if="dragItem.children.length > 0"
        :dragContent="dragItem.children"
        @change-data="changeData">
      </drag>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'
import Vue from 'vue'
export default {
  name: 'drag', // 递归组件

  props: ['dragContent'],

  data () {
    return {
      startPointLocation: {
        x: 0,
        y: 0
      },
      movePointLocation: {
        x: 0,
        y: 0
      }
    }
  },

  mounted () {

  },

  methods: {
    getUniqueKey () {
      return new Date().getTime() + Math.random() * 10 + 1
    },

    handleDragStart (e, data) {
      e.stopPropagation()

      let result = JSON.stringify(data)
      e.dataTransfer.setData('text/plain', result)
    },

    handleDragEnter (e) {
      e.stopPropagation()

      this.startPointLocation.x = e.clientX
      this.startPointLocation.y = e.clientY
      $(e.target).find('.divide-line').addClass('brother-item')
    },

    handleDragOver (e) {
      e.stopPropagation()
      e.preventDefault()

      this.movePointLocation.x = e.clientX
      this.movePointLocation.y = e.clientY

      if (Math.abs(this.movePointLocation.x - this.startPointLocation.x) > 50) {
        $(e.target).find('.divide-line').addClass('child-item')
      } else {
        $(e.target).find('.divide-line').removeClass('child-item')
      }
    },

    handleDragLeave (e) {
      e.stopPropagation()

      $(e.target).find('.divide-line').removeClass('brother-item')
    },

    hanldeDragEnd (e) {
      e.stopPropagation()

      $(e.target).find('.divide-line').removeClass('brother-item')
      $(e.target).find('.divide-line').removeClass('child-item')
    },

    changeData (payload) {
      this.$emit('change-data', payload)
    },

    hanldeDrop (e, id) {
      e.stopPropagation()
      let _result = JSON.parse(e.dataTransfer.getData('text/plain'))

      let isChild = false // 是添加到同级，还是子级
      if (Math.abs(this.movePointLocation.x - this.startPointLocation.x) > 50) isChild = true

      this.$emit('change-data', {
        targetId: id,
        originId: _result.id,
        data: _result,
        isChild
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .drag-item {
    border: 1px solid #ccc;
    height: 30px;
    margin-bottom: 10px;
    position: relative;

    .divide-line {
      background-color: #00A4F4;
      bottom: -1px;
      display: none;
      height: 4px;
      position: absolute;
      width: 100%;

      &.brother-item {
        display: block;
      }

      &.child-item {

        &::before {
          background-color: #fff;
          bottom: 0;
          content: '';
          display: block;
          height: 4px;
          left: 40px;
          position: absolute;
          width: 8px;
          z-index: 2;
        }
      }
    }
  }
</style>
