<template lang="pug">
  v-container(fluid)
    v-row.mb-6(
      no-gutters
    )
      v-col()
      v-col(
        cols="12"
        md="8"
      )
        v-container(fluid)
          v-row.mb-6.mt-2.mt-md-10(
            no-gutters
            justify="center" align-content="center"
          )
            v-col.mb-4(cols="12" md="4")
              v-layout(justify-center)
                v-img(:src="speaker.image.url" max-width="128" :alt="speakerFullName")
            v-col(cols="12" md="8")
              div.headline.font-weight-black.text-center.text-md-left {{ speakerFullName }}
              div.text-subtitle-1.text-center.text-md-left {{ speaker.affiliation }} {{ speaker.title }}
              div.text-body-2.mt-2
                span(v-html="speaker.profile")
              div.mt-2
                span.mr-2(v-if="speaker.facebook")
                  a(:href="speakerFacebookUrl" rel="nofollow" target="_blank")
                    v-icon(large) mdi-facebook
                span.mr-2(v-if="speaker.twitter")
                  a(:href="speakerTwitterUrl" rel="nofollow" target="_blank")
                    v-icon(large) mdi-twitter
          v-row.mt-10
            div.text-h6.ml-4 登壇セッション
            session-list(
              :sessions="speaker.sessions"
              :key="sessionListComponentKey"
            )
      v-col()
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import axios, { AxiosResponse } from 'axios'
import consola from 'consola'
import HeadMixin from '~/mixins/HeadMixin'
import ShareMixin from '~/mixins/ShareMixin'
import ConnpassEventMixin from '~/mixins/ConnpassEventMixin'
import { HeadInfo, Speaker } from '~/types'

@Component({
  components: {
    SessionList: () => import('@/components/SessionList.vue')
  }
})
export default class SpeakerPage extends mixins(
  HeadMixin,
  ShareMixin,
  ConnpassEventMixin
) {
  speaker!: Speaker
  randomForSessionListComponentKey: number = 0

  public headInfo(): HeadInfo {
    return {
      title: `${this.speakerFullName} | Session`,
      description: `${this.speaker.profile}`
    }
  }

  get url(): string {
    return ''
  }

  get shareText(): string {
    return this.speakerFullName
  }

  get speakerFullName(): string {
    return `${this.speaker.familyNameJp} ${this.speaker.firstNameJp}`
  }

  get speakerFacebookUrl(): string {
    return `https://www.facebook.com/${this.speaker.facebook}`
  }

  get speakerTwitterUrl(): string {
    return `https://twitter.com/${this.speaker.twitter}`
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
    consola.log('Speaker ID', params.id)
    const mcResponse: AxiosResponse<Speaker> = await axios.get(
      `${process.env.MC_API_BASE_URL}/speakers/${params.id}`,
      {
        headers: { 'X-API-KEY': process.env.MC_API_KEY }
      }
    )
    const speaker: Speaker = mcResponse.data
    consola.log('Speaker', speaker)
    return {
      speaker
    }
  }

  async mounted() {
    this.speaker.sessions = await this.getEventApplicantInfo(
      this.speaker.sessions
    )
    consola.log('Sessions', this.speaker.sessions)
    // Change key to ReRender SessionList Component
    this.randomForSessionListComponentKey = new Date().getTime()
  }
}
</script>

<style lang="stylus">
// Disable v-card border and shadow
// .v-sheet.v-card:not(.v-sheet--outlined)
//   box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px 0px rgba(0, 0, 0, 0);
</style>
