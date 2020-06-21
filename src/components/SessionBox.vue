<template lang="pug">
  v-card.ma-0.pa-0(
    outlined
  )
    v-card-title
      nuxt-link(:to="getSessionPageLink()")
        h5.session_text {{ session.title }}
    v-card-text
      div
        span.group.mr-2.session_text.caption
          v-icon.mr-1(small) mdi-calendar-month
          | {{ getDisplaySessionTimePeriod(session.startsAt, session.endsAt) }}
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

  getSessionPageLink() {
    return `/sessions/${this.session.id}/`
  }

  getDisplaySessionTimePeriod(startsAt: Date, endsAt: Date) {
    return `${this.$moment(startsAt).format('M月D日 H:mm')} - ${this.$moment(
      endsAt
    ).format('H:mm')}`
  }
}
</script>

<style lang="stylus">
.session_text
  color #666666
</style>
