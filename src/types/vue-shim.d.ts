// declare module '*.vue' {
//   import Vue from 'vue'
//   export default Vue
// }

import { Vue } from 'nuxt-property-decorator'

declare module 'vue/types/vue' {
  interface Vue {
    $ga: any
  }
}
