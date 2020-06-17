<template lang="pug">
  v-container
    div
      h3
        a(:href="getSessionPageLink()")
          | {{ session.title }}
      div {{ getDisplayDateTime(session.startsAt) }} to {{ getDisplayDateTime(session.endsAt) }}
      span(
        v-html="session.description"
      )
      ul
        li(
          v-for="speaker in session.speakers"
          :key="speaker.id"
        )
          | {{ speaker.familyNameJp }} {{ speaker.firstNameJp }}
      ul
        li(
          v-for="tag in session.tags"
          :key="tag.id"
        )
          | {{ getDisplayTagId(tag) }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { EventSession, Tag } from '~/types'

@Component({})
export default class SpeakerBoxComponent extends Vue {
  @Prop({ type: Object, required: true }) readonly session!: EventSession

  getDisplayTagId(tag: Tag) {
    return `#${tag.id}`
  }

  getSessionPageLink() {
    return `/sessions/${this.session.id}/`
  }

  getDisplayDateTime(dt: Date) {
    return this.$moment(dt).format('YYYY/MM/DD HH:mm')
  }
}
</script>
