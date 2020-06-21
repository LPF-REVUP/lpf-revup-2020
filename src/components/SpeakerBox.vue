<template lang="pug">
  v-dialog(
    v-model="dialog"
    fullscreen
  )
    template(v-slot:activator="{ on, attrs }")
      v-sheet(
        tile 
        v-on="on"
      )
        v-img(:src="speakerAvatarImageUrl")
        v-row.mt-5(justify="center")
          h3 {{ speaker.familyNameJp }} {{ speaker.firstNameJp }}
        v-row(justify="center")
          div {{ speaker.affiliation }} {{ speaker.title }}
    v-card
      v-toolbar(dark)
        v-btn(icon dark @click="dialog = false")
          v-icon mdi-close
        v-spacer
        v-toolbar-title.justify-center SPEAKER
        v-spacer
      v-container.mt-10
        v-row
          v-col(cols="12" sm="12" md="5")
            v-row(justify="center")
              img(
                :alt="speaker.familyNameJp"
                :src="speakerAvatarImageUrl"
              )
          v-col(cols="12" sm="12" md="7")
            v-row
              h2 {{ speaker.familyNameJp }} {{ speaker.firstNameJp }}
            v-row
              div {{ speaker.affiliation }} {{ speaker.title }}
            v-row.mt-10
              span(v-html="speaker.profile")
            v-row.mt-5
              span.mr-2(v-if="speaker.facebook")
                a(:href="speakerFacebookUrl" rel="nofollow" target="_blank")
                  v-icon(large) mdi-facebook
              span.mr-2(v-if="speaker.twitter")
                a(:href="speakerTwitterUrl" rel="nofollow" target="_blank")
                  v-icon(large) mdi-twitter              
        session-list(
          :sessions="sessions"
        )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Speaker, EventSession } from '~/types'

@Component({
  components: {
    SessionList: () => import('@/components/SessionList.vue')
  }
})
export default class SpeakerBoxComponent extends Vue {
  @Prop({ type: Object, required: true }) readonly speaker!: Speaker
  @Prop({ type: Array, required: true }) readonly sessions!: Array<EventSession>
  dialog = false

  get speakerAvatarImageUrl() {
    // Use Mask Corner Radius to display a speaker profile image as an avatar icon.
    // See microCMS image API
    // https://microcms.io/docs/image-api/introduction
    // https://docs.imgix.com/apis/url/mask/corner-radius
    return `${this.speaker.image.url}?mask=corners&w=200&h=200&corner-radius=50,50,50,50`
  }

  get speakerFacebookUrl() {
    return `https://www.facebook.com/${this.speaker.facebook}`
  }

  get speakerTwitterUrl() {
    return `https://twitter.com/${this.speaker.twitter}`
  }
}
</script>
