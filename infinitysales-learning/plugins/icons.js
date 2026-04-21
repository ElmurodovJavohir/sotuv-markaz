import Vue from 'vue'

// Stub icons component — replace with actual SVG icon set
const Icons = {
  name: 'icons',
  props: { name: String },
  template: `<span class="icon" :class="'icon-' + name"></span>`
}

Vue.component('icons', Icons)
