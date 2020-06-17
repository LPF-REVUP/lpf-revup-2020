<template lang="pug">
  v-card.d-inline-block.mx-auto
    v-container
      v-row(justify="space-between")
        v-col()
          v-img(
            width="100"
            height="100"
            :src="speaker.image.url"
          )
        v-col.text-center.pl-0
          div {{ fullName }}
          div {{ speaker.affiliation }} {{ speaker.title }}
        v-col.text-center.pl-0
          span(
            v-html="speaker.profile"
          )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Speaker } from '~/types'

@Component({})
export default class SpeakerItemComponent extends Vue {
  @Prop({ type: Object, required: true }) readonly speaker!: Speaker

  get fullName() {
    return `${this.speaker.familyNameJp} ${this.speaker.firstNameJp}`
  }
}
</script>
