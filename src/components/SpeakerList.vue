<template lang="pug">
  v-container(fluid)
    v-row(dense)
      v-col(
        v-for="s in speakers"
        :key="s.id"
        cols="4"
        md="3"
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
