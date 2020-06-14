<template lang="pug">
  v-container
    v-flex(mb-8 xs12)
      div.mt-4(
        v-for="s in speakers"
          :key="s.id"
      )
        speaker-box(
          :speaker="s"
        )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Speaker } from '~/types'

@Component({
  components: {
    SpeakerBox: () => import('@/components/SpeakerBox.vue')
  }
})
export default class SpeakerListComponent extends Vue {
  @Prop({ type: Array, required: true }) readonly speakers!: Array<Speaker>
}
</script>
