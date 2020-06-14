<template lang="pug">
  v-container
    div
      img(
        :alt="speaker.familyNameJp"
        :src="speakerAvatarImageUrl"
      )
      h3 {{ fullName }}
      div {{ speaker.affiliation }} {{ speaker.title }}
      span(
        v-html="speaker.profile"
      )
    div
      | セッション
      ul
        li(
          v-for="session in speaker.sessions"
          :key="session.id"
        )
          | {{ session.title }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Speaker } from '~/types'

@Component({})
export default class SpeakerBoxComponent extends Vue {
  @Prop({ type: Object, required: true }) readonly speaker!: Speaker

  get fullName() {
    return `${this.speaker.familyNameJp} ${this.speaker.firstNameJp}`
  }

  get speakerAvatarImageUrl() {
    // Use Mask Corner Radius to display a speaker profile image as an avatar icon.
    // See microCMS image API
    // https://microcms.io/docs/image-api/introduction
    // https://docs.imgix.com/apis/url/mask/corner-radius
    return `${this.speaker.image.url}?mask=corners&w=50&h=50&corner-radius=50,50,50,50`
  }
}
</script>
