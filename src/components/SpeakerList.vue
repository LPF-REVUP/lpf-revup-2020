<template lang="pug">
  v-container(fluid)
    v-row(dense)
      v-col(
        v-for="s in speakers"
        :key="s.id"
        cols="12"
        md="3"
        sm="6"
      )
        speaker-box.mx-5(
          :speaker="s"
          :sessions="getSessionsBySpeaker(s)"
        )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Speaker, EventSession } from '~/types'

@Component({
  components: {
    SpeakerBox: () => import('@/components/SpeakerBox.vue')
  }
})
export default class SpeakerListComponent extends Vue {
  @Prop({ type: Array, required: true }) readonly speakers!: Array<Speaker>
  @Prop({ type: Array, required: true }) readonly sessions!: Array<EventSession>

  getSessionsBySpeaker(s: Speaker): Array<EventSession> {
    console.log('choge', s.id, this.sessions)
    return this.sessions.filter(session =>
      session.speakers.map(speaker => speaker.id).includes(s.id)
    )
  }
}
</script>
