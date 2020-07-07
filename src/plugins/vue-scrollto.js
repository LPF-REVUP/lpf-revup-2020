import Vue from 'vue'
import VueScrollTo from 'vue-scrollto'

Vue.use(VueScrollTo, {
  duration: 300,
  easing: 'linear'
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function vueScrollTo({ req }, inject) {
  inject('scrollTo', VueScrollTo.scrollTo)
}
