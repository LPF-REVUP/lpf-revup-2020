<template lang="pug">
  v-container(fluid)
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
        .section-header.py-6(id="about")
          div.mb-4()
            div.ml-2.text-h6.text-md-h3.font-weight-black.section-header-text.text-left.font-biryani ABOUT
            div.ml-2.text-subtitle-2.text-md-subtitle-2.section-header-text LFP REV UP 2020 について
          v-row(cols="12")
            v-col.mx-auto.body-2(cols="12" md="8")
              v-row.py-2.about-list(cols="12")
                v-col.font-weight-bold(cols="12" md="3")
                  | 開催日
                v-col(cols="12" md="9")
                  p
                    | 11月20日(水)-21日(木)
                    br
                    | ・10:00 開場
                    br
                    | ・10:40 セッション開始
                    br
                    | ・12:40-13:40 昼食 *昼食配布は13:30まで
                    br
                    | ・18:50 セッション終了 *DAY-2（21日）は18:00にセッション終了予定
                    br
                    | ・19:00 懇親会 *懇親会はDAY-1（20日）のみ実施します。
              v-row.py-2.about-list(cols="12")
                v-col.font-weight-bold(cols="12" md="3")
                  | 場所
                v-col(cols="12" md="9")
                  | グランドニッコー東京 台場
              v-row.py-2.about-list(cols="12")
                v-col.font-weight-bold(cols="12" md="3")
                  | 参加費
                v-col(cols="12" md="9")
                  | 無料
        //- Speakers
        v-row.section-header(id="speakers" cols="12")
          div.mb-4
            div.ml-2.text-h6.text-md-h3.font-weight-black.section-header-text.text-left.font-biryani SPEAKERS
            div.ml-2.text-subtitle-2.text-md-subtitle-2.section-header-text 登壇者一覧
            speaker-list(
              :speakers="speakers"
            )
        //- AccessMap
        v-row.section-header(id="accessmap" cols="12")
          div
            div.ml-2.text-h6.text-md-h3.font-weight-black.section-header-text.text-left.font-biryani ACCESS MAP
            div.ml-2.text-subtitle-2.text-md-subtitle-2.section-header-text アクセスマップ
        //- Time table
        v-row.section-header(id="timetable" cols="12")
          div
            div.ml-2.text-h6.text-md-h3.font-weight-black.section-header-text.text-left.font-biryani TIME TABLE
            div.ml-2.text-subtitle-2.text-md-subtitle-2.section-header-text タイムテーブル
            timetable(
              :sessions="sessions"
            )
        //- Sponsors
        v-row.section-header(id="sponsors" cols="12")
          div
            div.ml-2.text-h6.text-md-h3.font-weight-black.section-header-text.text-left.font-biryani SPONSORS
            div.ml-2.text-subtitle-2.text-md-subtitle-2.section-header-text スポンサー
            sponsor-List(
              :sponsors="sponsors"
            )
        //- SHARE
        v-row.pt-10.pb-10(cols="12")
          span SHARE
          v-row.ma-5(justify-center)
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
        //- Index contents end
      v-col()
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
    const hash = this.$route.hash
    if (hash && hash.match(/^#.+$/)) {
      consola.log('hash', hash)
      this.$scrollTo(hash, 300)
    }
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
</style>
