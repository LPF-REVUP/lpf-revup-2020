<template lang="pug">
  div
    v-sheet(
      v-if="!session.title"
      :height="height"
    )
    v-card.mb-2(
      v-if="session.title"
      :height="cardHeight"
      dark
      color="#3cb371"
    )
      v-card-text.pa-2
        nuxt-link.session_link(:to="sessionPageLink")
          span.session_text {{ session.title }}
        v-row.ps-5.mt-1
          v-img.mr-2(
            :src="speakerAvatarImageUrl"
            :max-width="avatorSize"
            :max-height="avatorSize"
          )
          span.session_text {{ speakerName }}
          v-spacer
          div
            v-btn(
              v-if="session.movieUrl"
              icon
              small
            )
              v-icon.session_text mdi-arrow-right-drop-circle
            v-btn(
              v-if="session.documentUrl"
              icon
              small
            )
              v-icon.session_text mdi-paperclip
            span.mr-4.session_text
              v-icon.mr-1 mdi-account
              | {{ session.applicantsMessage }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { EventSession } from '~/types'

@Component({})
export default class TimetableCellComponent extends Vue {
  @Prop({ type: Object, required: true }) readonly session!: EventSession
  @Prop({ type: Number, required: true }) readonly height!: number
  avatorSize = 22

  get sessionPageLink() {
    return `/sessions/${this.session.id}/`
  }

  get cardHeight() {
    // for margin is 8px with mb-2, set card height smaller 8px
    return this.height - 8 + 'px'
  }

  get speakerName() {
    const speaker = this.session.speakers[0]
    return speaker.familyNameJp + ' ' + speaker.firstNameJp
  }

  get speakerAvatarImageUrl() {
    // Use Mask Corner Radius to display a speaker profile image as an avatar icon.
    // See microCMS image API
    // https://microcms.io/docs/image-api/introduction
    // https://docs.imgix.com/apis/url/mask/corner-radius
    return `${this.session.speakers[0].image.url}?w=${this.avatorSize}&h=${this.avatorSize}&corner-radius=100,100,100,100`
  }
}
</script>

<style lang="stylus">
.session_link
  text-decoration: none
.session_text
  color white
</style>
