<template lang="pug">
  .wrap
    .main-picture
      v-container.py-0
        v-row.py-8.white--text
          v-col.mx-auto.text-center(cols="10" lg="6")
            .main-picture-logo.pb-6.mb-6
              img(src="/main-picture-logo.svg")
            .date
              span.year 2020.
              span.day 8.10
              span.week [MON]
            .place
              | @ TOKYO / OSAKA / FUKUOKA
    v-row.pa-2.notification
      v-container.py-0
        v-layout(justify-center)
          div 重要なお知らせお知らせがある場合に表示されます
    //- Index contents start
    .introduction.font-biryani(id="introduction")
      v-container
        v-row(cols="12")
          v-col.py-15.mb-4(col="12")
            h2.mb-8.text-md-h3.text-sm-h4.introduction-title.font-biryani
              | LPF REV UP 2020
            h3.text-center.color-green
              | (仮)新しいプラットフォームの登場による人々の生活の劇的な変化、
              br
              | そしてそれを実現する開発者が活躍できる世界の到来(仮)
        v-row(cols="12")
          v-col.mx-auto(cols="12" md="6")
            p.body-2
              | (仮)「LINE DEVELOPER DAY」は、LINEが運営する様々なサービスの技術領域でのチャレンジや知見、これまでそして今後の取り組みを紹介する技術カンファレンスです。
            p.body-2
              | 今年の「LINE DEVELOPER DAY 2019」は2日間にわたって開催。1日目は「Engineering」をテーマに技術の深い話を、2日目は「Production」をテーマにWeb開発技術やUI/UX、プロジェクトマネジメントなど、プロダクト開発における実践的な話を幅広くご用意しています。
              br
              | また、今年からは日本や海外で活躍するゲストスピーカーも招待し、インフラやセキュリティなど様々なテーマでお話しいただきます。
    v-container(fluid)
      v-row(no-gutters)
        v-col()
        v-col(
          cols="12"
          md="10"
        )
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
          .section-header(id="accessmap")
            div
              div.ml-2.text-h6.text-md-h3.font-weight-black.section-header-text.text-left.font-biryani ACCESS MAP
              div.ml-2.text-subtitle-2.text-md-subtitle-2.section-header-text アクセスマップ
            v-row(cols="12")
              v-col(cols="12" md="4")
                h3.text-h6.font-weight-bold.mb-3
                  v-icon.ma-2(color="#3cb371") mdi-map-marker
                  | 東京会場
                iframe(src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.7479754683745!2d139.7432442152582!3d35.65858048019946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bbd9009ec09%3A0x481a93f0d2a409dd!2z5p2x5Lqs44K_44Ov44O8!5e0!3m2!1sja!2sjp!4v1595311993824!5m2!1sja!2sjp" width="400" height="250" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0")
                .text-center
                  v-btn(
                    outlined
                    link
                    color="green"
                    href="https://goo.gl/maps/xT9dMXCYDA7frsg5A"
                    target="_blank"
                  )
                    | Google Map
              v-col(cols="12" md="4")
                h3.text-h6.font-weight-bold.mb-3
                  v-icon.ma-2(color="#3cb371") mdi-map-marker
                  | 大阪会場
                iframe(src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.087259007763!2d135.50411711522483!3d34.65249918044693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e76077e042ff%3A0xe5cbcf56def44557!2z6YCa5aSp6Zaj!5e0!3m2!1sja!2sjp!4v1595312128549!5m2!1sja!2sjp" width="400" height="250" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0")
                .text-center
                  v-btn(
                    outlined
                    link
                    color="green"
                    href="https://goo.gl/maps/ZQicym5JJExnJoZ27"
                    target="_blank"
                  )
                    | Google Map
              v-col(cols="12" md="4")
                h3.text-h6.font-weight-bold.mb-3
                  v-icon.ma-2(color="#3cb371") mdi-map-marker
                  | 福岡会場
                iframe(src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.463185999777!2d130.34932131519702!3d33.59328458073337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x354193aa23040001%3A0xf9743b36617a912d!2z56aP5bKh44K_44Ov44O8!5e0!3m2!1sja!2sjp!4v1595312276653!5m2!1sja!2sjp" width="400" height="250" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0")
                .text-center
                  v-btn(
                    outlined
                    link
                    color="green"
                    href="https://goo.gl/maps/Ej7oJN546LncMUiv7"
                    target="_blank"
                  )
                    | Google Map
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
  background linear-gradient(247.38deg, #00B900 0%, #00AEB9 100%)
  font-family 'Biryani', sans-serif !important
  letter-spacing .1em
  .main-picture-logo
    border-bottom 1px solid #fff
  .year
    font-size 36px
  .day
    font-size 64px
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
.font-biryani
  font-family: 'Biryani', sans-serif !important;
.introduction
  font-family: 'Biryani', sans-serif !important;
  background-color: #F0FBF5
.introduction-title
  text-align center
  font-family 'Biryani', sans-serif !important
  color #00B900
.color-green
  color #00B900
.about-list
  border-bottom 1px solid #ccc
#accessmap iframe
  max-width 100%
</style>
