<template>
  <div>
    <button type="button" @click="changeComponent('v-a')">Component A</button>
    <button type="button" @click="changeComponent('v-b')">Component B</button>
    <transition name="component-fade" mode="out-in">
      <component v-bind:is="view"></component>
    </transition>
  </div>
</template>
<script>
    export default {
      data() {
        return {
          view: 'v-a'
        }
      },
      components: {
        'v-a': {
          template: '<div>Component A</div>'
        },
        'v-b': {
          template: '<div>Component B</div>'
        }
      },
      methods: {
        changeComponent (component) {
            this.view = component;
        }
      }
    }
</script>
<style>
    .component-fade-enter-active, .component-fade-leave-active {
      transition: opacity .3s ease;
    }
    .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active for below version 2.1.8 */ {
      opacity: 0;
    }
</style>