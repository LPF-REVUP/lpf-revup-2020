<template lang="pug">
  div
    v-container.main-picture.white--text(fluid)
      v-row(justify="center")
        div メイン画像が入ります
    v-container.notification(fluid)
      v-row(justify="center")
        div 重要なお知らせお知らせがある場合に表示されます
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
          :sessions="sessions"
        )
      div
        session-list(
          :sessions="sessions"
        )
      v-flex(
        xs12
        sm8
        md6
      )
        sponsor-List(
          :sponsors="sponsors"
        )
        v-btn.white-text(
          tile dark color="primary"
          @click="showShareTargetPicker"
          v-if="isLiffInitialized"
        ) SHARE
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { createClient } from 'microcms-client/lib/client'
import consola from 'consola'
import HeadMixin from '~/mixins/HeadMixin'
import LiffMixin from '~/mixins/LiffMixin'
import { HeadInfo, Speaker, EventSession, Sponsor } from '~/types'
import { appStateStore } from '~/store'

@Component({
  components: {
    SpeakerList: () => import('@/components/SpeakerList.vue'),
    SessionList: () => import('@/components/SessionList.vue'),
    SponsorList: () => import('@/components/SponsorList.vue')
  }
})
export default class Index extends mixins(HeadMixin, LiffMixin) {
  speakers = []

  public headInfo(): HeadInfo {
    return {}
  }

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

  get isLiffInitialized() {
    consola.log('isLiffInitialized', appStateStore.liffInitialized)
    return appStateStore.liffInitialized
  }

  async mounted() {
    await this.initializeLiff()
    this.showLiffInfo()
    await this.loadLineProfile()
    consola.log('mounted in index.vue', await appStateStore.lineProfile)
  }

  async showShareTargetPicker() {
    consola.log('showShareTargetPicker called')
    if (!appStateStore.lineProfile) {
      consola.log('lineProfile is not found in appStateStore')
      await this.loginWithLiff()
    } else {
      consola.log('User is logged in!!', appStateStore.lineProfile.displayName)
      // TODO show shareTargetPicker
    }
  }
}
</script>

<style lang="stylus">
.main-picture
  background linear-gradient(247.38deg, #C4C4C4 0%, #5F5F5F 100%);
  height 600px
.notification
  background-color #F0F0F0
</style>
