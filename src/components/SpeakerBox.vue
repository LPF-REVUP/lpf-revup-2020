<template lang="pug">
  v-layout
    v-card.mr-2(
      @click="moveToSpeakerPage()"
    )
      v-img(
        :src="speakerImageUrl"
      )
      v-card-text
        div.pb-4.text-subtitle-2.text-md-h6 {{ speaker.familyNameJp }} {{ speaker.firstNameJp }}
        div.text-body-2.text-md-subtitle-2 {{ speaker.affiliation }} {{ speaker.title }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Speaker } from '~/types'

@Component({})
export default class SpeakerBoxComponent extends Vue {
  @Prop({ type: Object, required: true }) readonly speaker!: Speaker

  get speakerImageUrl() {
    // Use Mask Corner Radius to display a speaker profile image as an avatar icon.
    // See microCMS image API
    // https://microcms.io/docs/image-api/introduction
    // https://docs.imgix.com/apis/url/mask/corner-radius
    return `${this.speaker.image.url}?fit=crop&w=270&h=150`
  }

  moveToSpeakerPage() {
    this.$router.push(`/speakers/${this.speaker.id}/`)
  }
}
</script>
