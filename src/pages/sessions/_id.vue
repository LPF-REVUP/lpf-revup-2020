<template lang="pug">
  v-container
    v-card.mx-auto(
      max-width="100%"

    )
      v-card-text.session_header
        div
          //- Title
          h1.mb-2.session_header_text {{ session.title }}
          //- Tag
          v-chip.ma-2(
            label
            text-color="white"
            color="secondary"
            v-for="tag in session.tags"
            :key="tag.id"
          )
            v-icon(left) mdi-tag
            | {{ getDisplayTagName(tag) }}
          div
            span.group.ma-2.session_header_text
              v-icon.mr-1(color="white") mdi-calendar-month
              | {{ getDisplaySessionTimePeriod(session.startsAt, session.endsAt) }}
            span.group.ma-2.session_header_text
              v-icon.mr-1(color="white") mdi-map-marker
              | {{ session.area.name }}
            span.group.ma-2.session_header_text
              v-icon.mr-1(color="white") mdi-account
              | TODO 申込者数
          div.ma-2.mt-4
            v-btn(
              color="primary"
            )
              | このセッションに申し込む
      v-card-text
        span.ma-2(
          v-html="session.description"
        )
      v-card-text
        div.mt-2(
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
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import { createClient } from 'microcms-client/lib/client'
import consola from 'consola'
import { EventSession, Speaker, Tag } from '~/types'
import '@/assets/icomoon/style.css'

@Component({
  components: {
    SpeakerItem: () => import('@/components/SpeakerItem.vue')
  }
})
export default class EventSessionPage extends Vue {
  session!: EventSession

  validate(context: Context) {
    consola.log('validate called!!')
    const { params } = context
    consola.log('Session ID', params.id)
    return params.id
  }

  async asyncData(context: Context) {
    consola.log('asyncData called!!')
    const { params } = context
    consola.log('Session ID', params.id)
    // Create microCMS API Client
    const client = createClient({
      baseUrl: process.env.MC_API_BASE_URL || '',
      contentType: 'application/json; charset=utf-8',
      X_API_KEY: process.env.MC_API_KEY || ''
    })
    // Get Session contents
    const session = await client.getContent<EventSession>({
      path: 'sessions',
      contentId: params.id
    })
    consola.log('Session', session)
    const speakers: Array<Speaker> = session.speakers
    consola.log('Speakers', speakers)
    return {
      session,
      speakers
    }
  }

  mounted() {
    consola.log('mounted called!!')
    let connpassEventId: string = ''
    if (this.session.applicationPage) {
      connpassEventId = this.getConnpassEventId(this.session.applicationPage)
      consola.log('connpassEventId', connpassEventId)
    }
  }

  /**
   * URL からConnpass Eevent ID を抽出する
   */
  getConnpassEventId(urlString: string) {
    const url = new URL(urlString)
    return url.pathname.split('/')[2]
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
