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
    div
      session-list(
        :sessions="sessions"
      )
    div
      h2 Sponsors
      ul
        li(
          v-for="s in sponsors"
          :key="s.id"
        )
          | {{ s.name }} < {{ s.rank }} >
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { createClient } from 'microcms-client/lib/client'
import consola from 'consola'
import { Speaker, EventSession, Sponsor } from '~/types'

@Component({
  components: {
    SpeakerList: () => import('@/components/SpeakerList.vue'),
    SessionList: () => import('@/components/SessionList.vue')
  }
})
export default class Index extends Vue {
  speakers = []

  async asyncData() {
    consola.log('asyncData called!!')
    console.log('MC_API_BASE_URL', process.env.MC_API_BASE_URL)
    console.log('MC_API_KEY', process.env.MC_API_KEY)
    // Create microCMS API Client
    const client = createClient({
      baseUrl: process.env.MC_API_BASE_URL || '',
      contentType: 'application/json; charset=utf-8',
      X_API_KEY: process.env.MC_API_KEY || ''
    })
    // Get Speaker contents
    const speakers = await client.getContents<Speaker>({ path: 'speakers' })
    consola.log('Speakers', speakers)
    // Get Session contents
    const sessions = await client.getContents<EventSession>({
      path: 'sessions'
    })
    consola.log('Sessions', sessions)
    // Get Sponsor contents
    const sponsors = await client.getContents<Sponsor>({
      path: 'sponsors'
    })
    consola.log('Sponsors', sponsors)
    return {
      speakers,
      sessions,
      sponsors
    }
  }
}
</script>

<style lang="stylus">
.bg_red
  background-color #FF0000
</style>
