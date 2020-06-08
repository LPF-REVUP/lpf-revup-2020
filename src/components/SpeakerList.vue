<template lang="pug">
  v-container
    v-flex(mb-8 xs12)
      div.mt-4(
        v-for="s in speakers"
          :key="s.id"
      )
        v-avatar(
          size="36px"
        )
          img(
            :alt="s.familyNameJp"
            :src="s.imageUrl.url"
          )
        h3 {{ s.familyNameJp }} {{ s.firstNameJp }}
        div {{ s.affiliation }} {{ s.title }}
        div {{ s.profile }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Speaker } from '~/types'

@Component({})
export default class SpeakerListComponent extends Vue {
  @Prop({ type: Array, required: true }) readonly speakers!: Array<Speaker>
}
</script>
