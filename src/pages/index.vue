<template lang="pug">
  .wrap
    v-container(fluid).pb-0
      v-row.pb-2.main-picture.white--text
        v-layout(justify-center)
          div メイン画像が入ります
      v-row.pa-2.notification
        v-layout(justify-center)
          div 重要なお知らせお知らせがある場合に表示されます
      v-row(no-gutters)
        v-col()
        v-col(
          cols="12"
          md="10"
        )
          //- Index contents start
          //- About
          v-row.section-header(id="about" cols="12")
            div.mb-4()
              div.ml-2.text-h6.text-md-h3.font-weight-black.section-header-text.text-left.font-biryani ABOUT
              div.ml-6.text-subtitle-2.text-md-subtitle-2.section-header-text LFP REV UP 2020 について
          //- Speakers
          v-row.section-header(id="speakers" cols="12")
            div.mb-4
              div.ml-2.text-h6.text-md-h3.font-weight-black.section-header-text.text-left.font-biryani SPEAKERS
              div.ml-6.text-subtitle-2.text-md-subtitle-2.section-header-text 登壇者一覧
              speaker-list(
                :speakers="speakers"
              )
          //- AccessMap
          v-row.section-header(id="accessmap" cols="12")
            div
              div.ml-2.text-h6.text-md-h3.font-weight-black.section-header-text.text-left.font-biryani ACCESS MAP
              div.ml-6.text-subtitle-2.text-md-subtitle-2.section-header-text アクセスマップ
          //- Time table
          v-row.section-header(id="timetable" cols="12")
            v-col(cols="12" lg="8" md="6")
              div.text-h6.text-md-h3.font-weight-black.section-header-text.text-left.font-biryani TIME TABLE
              div.text-subtitle-2.text-md-subtitle-2.section-header-text タイムテーブル
              p.mt-8
                | Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            v-col(cols="12" lg="4" md="6")
              v-img(src="/timetable__map.svg")
            div
              timetable(
                :sessions="sessions"
              )

          //- Sponsors
          v-row.section-header(id="sponsors" cols="12")
            div
              div.ml-2.text-h6.text-md-h3.font-weight-black.section-header-text.text-left.font-biryani SPONSORS
              div.ml-6.text-subtitle-2.text-md-subtitle-2.section-header-text スポンサー
              sponsor-List(
                :sponsors="sponsors"
              )
      //- SHARE
      v-row.share.py-16(cols="12")
        .container.py-8
          span.share-title SHARE!
          v-row.ma-5.justify-center
            //- Facebook
            .mr-8
              a.text-decoration-none(:href="facebookShareUrl" rel="nofollow" target="_blank")
                v-icon(x-large) mdi-facebook
            //- Twitter
            .mr-8
              a.text-decoration-none(:href="twitterShareUrl" rel="nofollow" target="_blank")
                v-icon(x-large) mdi-twitter
            //- Hatena bookmark
            .mr-8
              a.text-decoration-none(:href="hatenaShareUrl" rel="nofollow" target="_blank")
                v-icon(x-large) icon-hatenabookmark
            //- TODO Share Target Picker
            .mr-8
              v-btn.text-decoration-none(
                fab dark depressed
                color="#00c300"
                @click="showShareTargetPicker"
                small
              )
                v-icon(large) icon-line
        //- Index contents end
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
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
import { CMSResponse } from '~/types/microCMS'

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
    const headers = { 'X-API-KEY': process.env.MC_API_KEY }
    const limit = 50
    // Get Speaker contents
    const speakersResponse: AxiosResponse<CMSResponse<
      Array<Speaker>
    >> = await axios.get(
      `${process.env.MC_API_BASE_URL}/speakers/?limit=${limit}`,
      { headers }
    )
    const speakers = speakersResponse.data.contents
    consola.log('Speakers', speakers)
    // Get Session contents
    const sessionsResponse: AxiosResponse<CMSResponse<
      Array<EventSession>
    >> = await axios.get(
      `${process.env.MC_API_BASE_URL}/sessions/?limit=${limit}`,
      { headers }
    )
    const sessions = sessionsResponse.data.contents
    consola.log('Sessions', sessions)
    sessions.forEach(s => {
      s.applicantsMessage = '取得中'
    })
    // Get Sponsor contents
    const sponsorsResponse: AxiosResponse<CMSResponse<
      Array<Sponsor>
    >> = await axios.get(
      `${process.env.MC_API_BASE_URL}/sponsors/?limit=${limit}`,
      { headers }
    )
    const sponsors = await sponsorsResponse.data.contents
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
    // Scroll to page anchor
    const hash = this.$route.hash
    if (hash && hash.match(/^#.+$/)) {
      consola.log('Scroll to page anchor:', hash)
      this.$scrollTo(hash, 300)
    }
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
.section-header
  margin-top: -70px
  padding-top: 80px
  padding-bottom: 10px
.section-header-text
  color #00B900
.section-header-text.font-biryani
  font-family: 'Biryani', sans-serif !important;
.about-list
  border-bottom 1px solid #ccc
#accessmap iframe
  max-width 100%
.share
  position relative
  background-color #F0FBF5
.share-title
  position: absolute;
  color rgba(0,153,73,.1)
  font-size 194px
  font-family 'Biryani', sans-serif !important
  top 60%
  left 50%
  transform translate(-50%, -50%)
.mdi-facebook
  color #3b5998 !important
.mdi-twitter
  color #55ACEE !important
.icon-hatenabookmark
  color #008fde
</style>
