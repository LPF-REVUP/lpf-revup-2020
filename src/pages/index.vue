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
        timetable(
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
          v-btn(
            fab dark depressed
            color="#888888"
            @click="showShareTargetPicker"
            small
          )
            v-icon(large) icon-line
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { createClient } from 'microcms-client/lib/client'
import consola from 'consola'
import axios, { AxiosResponse } from 'axios'
import qs from 'qs'
import { FlexMessage } from '@line/bot-sdk'
import HeadMixin from '~/mixins/HeadMixin'
import LiffMixin from '~/mixins/LiffMixin'
import ShareMixin from '~/mixins/ShareMixin'
import {
  HeadInfo,
  Speaker,
  EventSession,
  ConnpassResponse,
  Sponsor
} from '~/types'
import { appStateStore } from '~/store'
import { generateShareMessage } from '~/utils/messages/shareMessage'

@Component({
  components: {
    SpeakerList: () => import('@/components/SpeakerList.vue'),
    Timetable: () => import('@/components/Timetable.vue'),
    SponsorList: () => import('@/components/SponsorList.vue')
  }
})
export default class Index extends mixins(HeadMixin, LiffMixin, ShareMixin) {
  speakers: Array<Speaker> = []
  sessions: Array<EventSession> = []

  public headInfo(): HeadInfo {
    return {}
  }

  get url(): string {
    return process.env.BASE_URL!
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
    sessions.forEach(s => {
      s.applicantsMessage = '取得中'
    })
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

  async mounted() {
    consola.log('getting connpass event info')
    try {
      const connpassEventIds = this.sessions.map(
        s => new URL(s.applicationPage).pathname.split('/')[2]
      )
      const connpassResponse: AxiosResponse<ConnpassResponse> = await axios.get(
        '/.netlify/functions/connpass',
        {
          params: {
            count: connpassEventIds.length,
            event_id: connpassEventIds
          },
          paramsSerializer: params =>
            qs.stringify(params, { arrayFormat: 'repeat' })
        }
      )
      consola.log('ConnpassResponse', connpassResponse)

      this.sessions.forEach(eventSession => {
        const url = new URL(eventSession.applicationPage)
        const connpasEventId = url.pathname.split('/')[2]
        const connpassEvent = connpassResponse.data.events.find(
          connpassEvent => connpasEventId === connpassEvent.event_id.toString()
        )
        if (connpassEvent) {
          const applicantCount = connpassEvent.accepted + connpassEvent.waiting
          eventSession.applicantsMessage = connpassEvent.limit
            ? applicantCount + '/' + connpassEvent.limit + '人'
            : applicantCount + '人'
        } else {
          eventSession.applicantsMessage = '取得できませんでした'
        }
      })
    } catch (error) {
      consola.error(error)
      this.sessions.forEach(s => {
        s.applicantsMessage = '取得できませんでした'
      })
    }
    consola.log('updated sessions', this.sessions)
  }

  get isLiffInitialized() {
    consola.log('isLiffInitialized', appStateStore.liffInitialized)
    return appStateStore.liffInitialized
  }

  async showShareTargetPicker() {
    consola.log('showShareTargetPicker called')
    // TODO 文言は仮
    const message =
      '(仮)新しいプラットフォームの登場による人々の生活の劇的な変化、 そしてそれを実現する開発者が活躍できる世界の到来(仮)'
    const shareMessage: FlexMessage = generateShareMessage(
      message,
      this.getPermanentLink()
    )
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
