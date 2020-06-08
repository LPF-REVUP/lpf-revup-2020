<template lang="pug">
  v-layout(
    column
    justify-center
    align-center
  )
    v-flex(
      xs12
      sm8
      md6
    )
      speaker-list(
        :speakers="speakers"
      )

</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { createClient } from 'microcms-client/lib/client'
import consola from 'consola'
import { Speaker } from '~/types'

@Component({
  components: {
    SpeakerList: () => import('@/components/SpeakerList.vue')
  }
})
export default class Index extends Vue {
  speakers = []

  async asyncData() {
    consola.log('asyncData called!!')
    await console.log('MC_API_BASE_URL', process.env.MC_API_BASE_URL)
    await console.log('MC_API_KEY', process.env.MC_API_KEY)
    const client = createClient({
      baseUrl: process.env.MC_API_BASE_URL || '',
      contentType: 'application/json; charset=utf-8',
      X_API_KEY: process.env.MC_API_KEY || ''
    })
    const speakers = await client.getContents<Speaker>({ path: 'speakers' })
    consola.log('Speakers', speakers)
    return {
      speakers
    }
  }
}
</script>

<style lang="stylus">
.bg_red
  background-color #FF0000
</style>
