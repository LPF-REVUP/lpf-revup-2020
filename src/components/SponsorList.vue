<template lang="pug">
  v-container(fluid)
    v-row.mt-5(v-if="goldSponsors.length")
    v-row.mt-5
      v-col.ml-4(
        v-for="s in goldSponsors"
        :key="s.id"
        cols="10"
        md="5"
      )
        v-img(
          :src="getSponsorImageUrl(s)"
          :title="s.name"
          :width="calcSponsorImageWidth(s)"
          max-width="500"
        )
    v-row.mt-5(v-if="silverSponsors.length")
    v-row.mt-5
      v-col.ml-4(
        v-for="s in silverSponsors"
        :key="s.id"
        cols="5"
        md="3"
      )
        v-img(
          :src="getSponsorImageUrl(s)"
          :title="s.name"
          :width="calcSponsorImageWidth(s)"
          max-width="300"
        )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import consola from 'consola'
import { Sponsor, RankEnum } from '~/types'

@Component({})
export default class SponsorListComponent extends Vue {
  @Prop({ type: Array, required: true }) readonly sponsors!: Array<Sponsor>
  windowWidth: number = 0

  mounted() {
    this.windowWidth = window.innerWidth
  }

  get goldSponsors() {
    return this.sponsors.filter(s => s.rank === RankEnum.GOLD)
  }

  get silverSponsors() {
    return this.sponsors.filter(s => s.rank === RankEnum.SILVER)
  }

  getSponsorImageUrl(s: Sponsor) {
    const w = this.calcSponsorImageWidth(s)
    return `${s.image.url}?fit=clip&w=${w}`
  }

  calcSponsorImageWidth(s: Sponsor) {
    let result = 200
    const width = this.windowWidth
    let cols = 2
    if (s.rank === RankEnum.GOLD) {
      if (width < 960) cols = 1
    } else if (s.rank === RankEnum.SILVER) {
      if (width < 960) {
        cols = 2
      } else {
        cols = 3
      }
    }
    result = (width * 0.6) / cols
    consola.log('Sponsor image width', result, s.name)
    return result
  }
}
</script>
