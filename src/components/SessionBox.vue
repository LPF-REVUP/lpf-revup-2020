<template lang="pug">
  v-card.ma-0.pa-0(
    outlined
  )
    v-card-title
      nuxt-link(:to="sessionPageLink")
        h5.session_text {{ session.title }}
    v-card-text
      div
        span.group.mr-2.session_text.caption
          v-icon.mr-1(small) mdi-calendar-month
          | {{ displaySessionTimePeriod }}
        span.group.mr-2.session_text.caption
          v-icon.mr-1(small) mdi-account
          | 申込者数
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { EventSession } from '~/types'

@Component({})
export default class SpeakerBoxComponent extends Vue {
  @Prop({ type: Object, required: true }) readonly session!: EventSession

  get sessionPageLink() {
    return `/sessions/${this.session.id}/`
  }

  get displaySessionTimePeriod() {
    return `${this.$moment(this.session.startsAt).format(
      'M月D日 H:mm'
    )} - ${this.$moment(this.session.endsAt).format('H:mm')}`
  }
}
</script>

<style lang="stylus">
.session_text
  color #666666
</style>
