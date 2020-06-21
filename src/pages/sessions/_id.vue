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
            | {{ getDisplayTagName(tag) }}
          v-container.ma-0.pa-0
            v-row(dense justify="start" align="center")
              v-col(cols="8" sm="6" md="2" lg="2")
                span.session_header_text
                  v-icon.mr-1(color="white") mdi-calendar-month
                  | {{ getDisplaySessionTimePeriod(session.startsAt, session.endsAt) }}
              v-col(cols="4" sm="2" md="1" lg="1")
                span.session_header_text
                  v-icon.mr-1(color="white") mdi-map-marker
                  | {{ session.area.name }}
              v-col(cols="6" sm="4"  md="2" lg="1")
                span.session_header_text
                  v-icon.mr-1(color="white") mdi-account
                  | TODO 申込者数
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
              a(:href="getFacebookShareUrl()" rel="nofollow" target="_blank")
                v-icon(large) mdi-facebook
            //- Twitter
            span.mr-2
              a(:href="getTwitterShareUrl()" rel="nofollow" target="_blank")
                v-icon(large) mdi-twitter
            //- Hatena bookmark
            span.mr-2
              a(:href="getHatenaShareUrl()" rel="nofollow" target="_blank")
                v-icon(large) icon-hatenabookmark
            //- TODO Share Target Picker
            span.mr-2
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
import axios from 'axios'
import consola from 'consola'
import HeadMixin from '~/mixins/HeadMixin'
import { HeadInfo, EventSession, Tag } from '~/types'
import '@/assets/icomoon/style.css'

@Component({
  components: {
    SpeakerItem: () => import('@/components/SpeakerItem.vue'),
    RelatedSessionList: () => import('@/components/RelatedSessionList.vue')
  }
})
export default class EventSessionPage extends mixins(HeadMixin) {
  session!: EventSession
  connpassEventId!: string

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
    return {
      session,
      relatedSessions,
      connpassEventId
    }
  }

  getDisplayTagName(tag: Tag) {
    return `#${tag.name}`
  }

  getDisplaySessionTimePeriod(startsAt: Date, endsAt: Date) {
    return `${this.$moment(startsAt).format('M月D日 H:mm')} - ${this.$moment(
      endsAt
    ).format('H:mm')}`
  }

  getPermanentLink() {
    return `${process.env.BASE_URL}/sessions/${this.session.id}/`
  }

  getFacebookShareUrl() {
    return `http://www.facebook.com/share.php?u=${this.getPermanentLink()}`
  }

  getTwitterShareUrl() {
    const shareText = `${this.session.title}`
    return `https://twitter.com/share?url=${this.getPermanentLink()}&via=linedc_jp&related=linedc_jp&hashtags=linedc&text=${shareText}`
  }

  getHatenaShareUrl() {
    const shareText = `${this.session.title}`
    return `http://b.hatena.ne.jp/add?mode=confirm&url=${this.getPermanentLink()}&title=${shareText}`
  }
}
</script>

<style lang="stylus">
.session_header
  background-color #666666
.session_header_text
  color #FFFFFF
</style>
