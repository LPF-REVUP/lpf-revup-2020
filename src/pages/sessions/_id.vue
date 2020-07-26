<template lang="pug">
  v-container.pa-0(fluid)
    v-row.mb-6(
      no-gutters
    )
      v-col.session_header()
      v-col.session_header(
        cols="12"
        md="9"
      )
        v-container(fluid)
          v-row.mr-2.ml-2
            //- Title
            h2.session_header_text {{ session.title }}
          v-row
            //- Tag
            v-chip.ma-2.mt-4(
              label
              text-color="primary"
              color="white"
              v-for="tag in session.tags"
              :key="tag.id"
            )
              v-icon.mr-1(left small) mdi-tag
              | {{ tag.name }}
          v-row.mt-2(dense justify="start" align="center")
            span.mr-4.session_header_text
              v-icon.mr-1(color="white") mdi-calendar-month
              | {{ displaySessionTimePeriod }}
            span.mr-4.session_header_text
              v-icon.mr-1(color="white") mdi-map-marker
              | {{ session.area.name }}
            span.mr-4.session_header_text
              v-icon.mr-1(color="white") mdi-account
              | {{ applicantsMessage }}
          v-row.ma-0.mt-4
            v-btn(
              color="accent"
              link
              :href="session.applicationPage"
              target="_blank"
              @click="gaEvent()"
            )
              | このセッションに申し込む
      v-col.session_header()
    v-row.mb-6(
      no-gutters
    )
      v-col()
      v-col(
        cols="12"
        md="9"
      )
        v-container(fluid)
          v-row
            span.mt-2.mb-4.mr-2.ml-2(
              v-html="session.description"
            )
          //- Show the Session's Movie
          v-row.mt-2.mb-2
            iframe.deck_frame.viewer_size(
              v-if="sessionMovieDisplaysource"
              :src="sessionMovieDisplaysource"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            )
          //- Show the Session's SpeakerDeck slide
          v-row.mt-2.mb-2
            iframe.deck_frame.viewer_size(
              v-if="speakerDeckDisplaySource"
              :src="speakerDeckDisplaySource"
              frameborder="0"
              allowfullscreen="true"
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
            )
          //- Speakers
          v-row.mt-4.mb-4.mr-2.ml-2
            div(
              v-for="s in session.speakers"
                :key="s.id"
            )
              speaker-item(
                :speaker="s"
              )
          //- Share
          v-row.mt-10.mb-10.mr-1.ml-1
            v-layout(justify-end)
              //- div(style="display:flex;")
              //- Share buttons
              div.mt-2(style="margin-left:auto;")
                span.mr-4 SHARE
                //- Facebook
                span.mr-2
                  a.text-decoration-none(:href="facebookShareUrl" rel="nofollow" target="_blank")
                    v-icon(large) mdi-facebook
                //- Twitter
                span.mr-2
                  a.text-decoration-none(:href="twitterShareUrl" rel="nofollow" target="_blank")
                    v-icon(large) mdi-twitter
                //- Hatena bookmark
                span.mr-2
                  a.text-decoration-none(:href="hatenaShareUrl" rel="nofollow" target="_blank")
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
          //- Related Sessions
          v-row(
            v-if="relatedSessions.length > 0"
          )
            v-divider.mt-4.mb-4
            div.mr-2.ml-2
              h3.mb-2 関連セッション
              div
                related-session-list(
                  :sessions="relatedSessions"
                  :key="sessionListComponentKey"
                )
      v-col()
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import { FlexMessage } from '@line/bot-sdk'
import axios, { AxiosResponse } from 'axios'
import consola from 'consola'
import * as lodash from 'lodash'
import HeadMixin from '~/mixins/HeadMixin'
import ShareMixin from '~/mixins/ShareMixin'
import LiffMixin from '~/mixins/LiffMixin'
import ConnpassEventMixin from '~/mixins/ConnpassEventMixin'
import { HeadInfo, EventSession, Tag, SpeakerDeckInfo } from '~/types'
import '@/assets/icomoon/style.css'
import { generateShareMessage } from '~/utils/messages/shareMessage'
import { CMSResponse } from '~/types/microCMS'
const _ = lodash

@Component({
  components: {
    SpeakerItem: () => import('@/components/SpeakerItem.vue'),
    RelatedSessionList: () => import('@/components/RelatedSessionList.vue')
  }
})
export default class EventSessionPage extends mixins(
  HeadMixin,
  ShareMixin,
  LiffMixin,
  ConnpassEventMixin
) {
  session!: EventSession
  relatedSessions!: Array<EventSession>
  connpassEventId!: string
  pageLink!: string
  applicantsMessage = '取得中'
  loaded: boolean = false
  speakerDeckDataId: string | null = null
  randomForSessionListComponentKey: number = 0

  validate(context: Context) {
    consola.log('validate called!!')
    const { params } = context
    consola.log('Session ID', params.id)
    return params.id
  }

  public headInfo(): HeadInfo {
    return {
      title: `${this.session.title} | Session`,
      description: `${this.session.description}`
    }
  }

  get url(): string {
    return this.pageLink
  }

  get shareText(): string {
    return this.session.title
  }

  /**
   * セッション情報更新時にSessionList を再描画するためのキーを取得する
   * 再描画したい場合は `randomForSessionListComponentKey` の値を変更する
   */
  get sessionListComponentKey(): string {
    return `key_${this.randomForSessionListComponentKey}`
  }

  async asyncData(context: Context) {
    consola.log('asyncData called!!')
    const { params } = context
    consola.log('Session ID', params.id)
    const headers = { 'X-API-KEY': process.env.MC_API_KEY }
    // Get Session info
    const sessionResponse: AxiosResponse<EventSession> = await axios.get(
      `${process.env.MC_API_BASE_URL}/sessions/${params.id}`,
      { headers }
    )
    const session: EventSession = sessionResponse.data
    consola.log('Session', session)
    // Get related sessions
    let query = `filters=area[equals]${session.area.id}`
    // Create filter to get related sessions
    session.tags.map((tag: Tag) => {
      const q = `tags[contains]${tag.id}`
      query = `${query}[or]${q}`
      return q
    })
    session.applicantsMessage = '取得中'
    consola.log('Related sessions query', query)
    const relatedSessionsResponse: AxiosResponse<CMSResponse<
      Array<EventSession>
    >> = await axios.get(`${process.env.MC_API_BASE_URL}/sessions?${query}`, {
      headers
    })
    const relatedSessions: Array<EventSession> = relatedSessionsResponse.data.contents.filter(
      (s: EventSession) => {
        s.applicantsMessage = '取得中'
        return s.id !== params.id
      }
    )
    consola.log('Related sessions', relatedSessions)
    // Get connpass event ID
    let connpassEventId: string = ''
    if (session.applicationPage) {
      // URL からConnpass Eevent ID を抽出する
      const url = new URL(session.applicationPage)
      connpassEventId = url.pathname.split('/')[2]
      consola.log('connpassEventId', connpassEventId)
    }
    // Page link
    const pageLink = `${process.env.BASE_URL}/sessions/${session.id}/`
    // Youtube
    let sessionMovieDisplaysource = null
    if (session.movieUrl) {
      try {
        consola.log('building Youtube movie viewer', session.movieUrl)
        const group: RegExpMatchArray | null = session.movieUrl.match(
          /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
        )
        consola.log('Extract youtube url', group)
        if (group) {
          consola.log('Extract youtube video id', group[0], group[7])
          sessionMovieDisplaysource = `https://www.youtube.com/embed/${group[7]}`
        }
      } catch (error) {
        consola.error('Could not get Youtube video id', error)
      }
    }
    // SpeakerDeck
    let speakerDeckDisplaySource = null
    if (session.documentUrl) {
      consola.log('getting Speaker Deck event info', session.documentUrl)
      try {
        const sdResponse: AxiosResponse<SpeakerDeckInfo> = await axios.get(
          process.env.SD_OEMBED_API_PROXY_URL!,
          {
            params: {
              url: session.documentUrl
            }
          }
        )
        const deckInfo: SpeakerDeckInfo = sdResponse.data
        consola.log('Speaker Deck info', deckInfo)
        // Extract deck display source
        const group: RegExpMatchArray | null = deckInfo.html.match(
          /\/\/speakerdeck.com\/player\/([a-zA-Z0-9]{6,})/
        )
        if (group) {
          speakerDeckDisplaySource = group[0]
        }
      } catch (error) {
        consola.error('Could not get SpeakerDeck info', error)
      }
    }
    return {
      session,
      relatedSessions,
      connpassEventId,
      pageLink,
      speakerDeckDisplaySource,
      sessionMovieDisplaysource
    }
  }

  get displaySessionTimePeriod() {
    return `${this.$moment(this.session.startsAt).format(
      'M月D日 H:mm'
    )} - ${this.$moment(this.session.endsAt).format('H:mm')}`
  }

  async mounted() {
    let sessions = _.cloneDeep(this.relatedSessions)
    sessions.push(_.cloneDeep(this.session))
    sessions = await this.getEventApplicantInfo(sessions)
    this.relatedSessions = sessions.filter((s: EventSession) => {
      if (s.id === this.session.id) {
        this.session = s
        this.applicantsMessage = s.applicantsMessage
      }
      return s.id !== this.session.id
    })
    // Change key to ReRender SessionList Component
    this.randomForSessionListComponentKey = new Date().getTime()
  }

  async showShareTargetPicker() {
    consola.log('showShareTargetPicker called')
    // TODO 文言は仮
    const message = this.shareText
    const shareMessage: FlexMessage = generateShareMessage(
      message,
      this.getPermanentLink()
    )
    // ログイン後のリダイレクトURL はLINE ログインチャネルのコールバックURL に登録しておく必要がある
    await this.openShareTargetPicker(shareMessage, this.pageLink)
  }

  gaEvent() {
    const event = {
      eventCategory: 'session',
      eventAction: 'link_to_connpass',
      eventLabel: this.session.title,
      eventValue: 1
    }
    consola.log('gaEvent called!!!', event)
    this.$ga.event(event)
  }
}
</script>

<style lang="stylus">
.session_header
  background-color #00B900
.session_header_text
  color #FFFFFF
.deck_frame
  border: 0px
  background: padding-box rgba(0, 0, 0, 0.1)
  margin: 0px
  padding: 0px
  border-radius: 6px
  box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px
.viewer_size
  width: calc(80px + 66vw)
  height: calc((80px + 66vw) / 1.77777777778)
</style>
