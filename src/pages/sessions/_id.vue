<template lang="pug">
  v-container
    v-card.mx-auto(
      max-width="100%"
    )
      v-card-text.session_header
        div
          //- Title
          h2.session_header_text {{ session.title }}
          //- Tag
          v-chip.ma-2.mt-4(
            label
            text-color="white"
            color="secondary"
            v-for="tag in session.tags"
            :key="tag.id"
          )
            v-icon.mr-1(left small) mdi-tag
            | {{ tag.name }}
          v-container.ma-0.pa-0
            v-row(dense justify="start" align="center")
              v-col(cols="8" sm="6" md="2" lg="2")
                span.session_header_text
                  v-icon.mr-1(color="white") mdi-calendar-month
                  | {{ displaySessionTimePeriod }}
              v-col(cols="4" sm="2" md="1" lg="1")
                span.session_header_text
                  v-icon.mr-1(color="white") mdi-map-marker
                  | {{ session.area.name }}
              v-col(cols="6" sm="4"  md="2" lg="1")
                span.session_header_text
                  v-icon.mr-1(color="white") mdi-account
                  | {{ applicantsMessage }}
          div.ma-0.mt-4
            v-btn(
              color="primary"
              link
              :href="session.applicationPage"
              target="_blank"
            )
              | このセッションに申し込む
      v-card-text
        span.mt-2(
          v-html="session.description"
        )
      v-card-text
        //- Show the Session's Movie
        iframe.deck_frame.viewer_size(
          v-if="sessionMovieDisplaysource"
          :src="sessionMovieDisplaysource"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        )
      v-card-text
        //- Show the Session's SpeakerDeck slide
        iframe.deck_frame.viewer_size(
          v-if="speakerDeckDisplaySource"
          :src="speakerDeckDisplaySource"
          frameborder="0"
          allowfullscreen="true"
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
        )
      v-card-text
        div(
          v-for="s in session.speakers"
            :key="s.id"
        )
          speaker-item(
            :speaker="s"
          )
      v-card-text
        div(style="display:flex;")
          //- Share buttons
          div.mt-2(style="margin-left:auto;")
            span.mr-4 SHARE
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
      v-card-text(
        v-if="relatedSessions.length > 0"
      )
        v-divider.mt-4.mb-4
        div
          h3.mb-2 その他のセッション
          div
            related-session-list(
              :sessions="relatedSessions"
            )
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import { FlexMessage } from '@line/bot-sdk'
import axios, { AxiosResponse } from 'axios'
import consola from 'consola'
import HeadMixin from '~/mixins/HeadMixin'
import ShareMixin from '~/mixins/ShareMixin'
import LiffMixin from '~/mixins/LiffMixin'
import {
  HeadInfo,
  EventSession,
  ConnpassResponse,
  Tag,
  SpeakerDeckInfo
} from '~/types'
import '@/assets/icomoon/style.css'
import { generateShareMessage } from '~/utils/messages/shareMessage'

@Component({
  components: {
    SpeakerItem: () => import('@/components/SpeakerItem.vue'),
    RelatedSessionList: () => import('@/components/RelatedSessionList.vue')
  }
})
export default class EventSessionPage extends mixins(
  HeadMixin,
  ShareMixin,
  LiffMixin
) {
  session!: EventSession
  connpassEventId!: string
  pageLink!: string
  applicantsMessage = '取得中'
  loaded: boolean = false
  speakerDeckDataId: string | null = null

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

  async asyncData(context: Context) {
    consola.log('asyncData called!!')
    const { params } = context
    consola.log('Session ID', params.id)
    // Get Session info
    const { data } = await axios.get(
      `${process.env.MC_API_BASE_URL}sessions/${params.id}`,
      {
        headers: { 'X-API-KEY': process.env.MC_API_KEY }
      }
    )
    const session: EventSession = data
    consola.log('Session', session)
    // Get related sessions
    let query = `filters=area[equals]${session.area.id}`
    // Create filter to get related sessions
    session.tags.map((tag: Tag) => {
      const q = `tags[contains]${tag.id}`
      query = `${query}[or]${q}`
      return q
    })
    consola.log('Related sessions query', query)
    const { data: relatedData } = await axios.get(
      `${process.env.MC_API_BASE_URL}sessions?${query}`,
      {
        headers: { 'X-API-KEY': process.env.MC_API_KEY }
      }
    )
    const relatedSessions: Array<EventSession> = relatedData.contents.filter(
      (s: EventSession) => {
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
    await this.getConnpassEventInfo()
  }

  async getConnpassEventInfo() {
    consola.log('getting connpass event info', this.connpassEventId)
    try {
      const connpassResponse: AxiosResponse<ConnpassResponse> = await axios.get(
        '/.netlify/functions/connpass',
        {
          params: {
            event_id: this.connpassEventId
          }
        }
      )
      const connpassEvent = connpassResponse.data.events[0]
      const applicantCount = connpassEvent.accepted + connpassEvent.waiting
      this.applicantsMessage = connpassEvent.limit
        ? applicantCount + '/' + connpassEvent.limit + '人'
        : applicantCount + '人'
    } catch (error) {
      consola.error('Could not get connpass event info', error)
      this.applicantsMessage = '取得できませんでした'
    }
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
}
</script>

<style lang="stylus">
.session_header
  background-color #666666
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
