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
      span SHARE
      v-row.ma-5
        //- Facebook
        span.mr-2
          a(:href="facebookShareUrl" rel="nofollow" target="_blank")
            v-icon(large) mdi-facebook
        //- Twitter
        span.mr-2
          a(:href="twitterShareUrl" rel="nofollow" target="_blank")
            v-icon(large) mdi-twitter
        //- Hatena bookmark
        span.mr-2
          a(:href="hatenaShareUrl" rel="nofollow" target="_blank")
            v-icon(large) icon-hatenabookmark
        //- TODO Share Target Picker
        span.mr-2
          v-icon(large) icon-line
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
import { FlexMessage } from '@line/bot-sdk'
import HeadMixin from '~/mixins/HeadMixin'
import LiffMixin from '~/mixins/LiffMixin'
import ShareMixin from '~/mixins/ShareMixin'
import { HeadInfo, Speaker, EventSession, Sponsor } from '~/types'
import { appStateStore } from '~/store'
import { generateShareMessage } from '~/utils/messages/shareMessage'

@Component({
  components: {
    SpeakerList: () => import('@/components/SpeakerList.vue'),
    SessionList: () => import('@/components/SessionList.vue'),
    SponsorList: () => import('@/components/SponsorList.vue')
  }
})
export default class Index extends mixins(HeadMixin, LiffMixin, ShareMixin) {
  speakers = []

  public headInfo(): HeadInfo {
    return {}
  }

  get url(): string {
    return process.env.BASE_URL || ''
  }

  get shareText(): string {
    return 'LPF REV UP 2020' // TODO 文言を決定し変更する
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

  async showShareTargetPicker() {
    consola.log('showShareTargetPicker called')
    const message =
      '(仮)新しいプラットフォームの登場による人々の生活の劇的な変化、 そしてそれを実現する開発者が活躍できる世界の到来(仮)'
    const shareMessage: FlexMessage = generateShareMessage(message)
    await this.openShareTargetPicker(shareMessage)
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
