<template lang="pug">
  v-container
    v-row.mt-5(v-if="platinumSponsors.length")
      div.sponsor-rank-title プラチナスポンサー
    v-row.mt-5(
      v-for="s in platinumSponsors"
      :key="s.id"
      justify="center"
    )
      v-img(
        :src="getSponsorImage(s)"
        :title="s.name"
        max-width="400"
        justify="center"
      )
    v-row.mt-5(v-if="goldSponsors.length")
      div.sponsor-rank-title ゴールドスポンサー
    v-row.mt-5
      v-col(
        v-for="s in goldSponsors"
        :key="s.id"
        cols="6"
      )
        v-img(
          :src="getSponsorImage(s)"
          :title="s.name"
          max-width="300"
        )
    v-row.mt-5(v-if="silverSponsors.length")
      div.sponsor-rank-title シルバースポンサー
    v-row.mt-5
      v-col(
        v-for="s in silverSponsors"
        :key="s.id"
        cols="4"
      )
        v-img(
          :src="getSponsorImage(s)"
          :title="s.name"
          max-width="200"
        )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Sponsor, RankEnum } from '~/types'

@Component({})
export default class SponsorListComponent extends Vue {
  @Prop({ type: Array, required: true }) readonly sponsors!: Array<Sponsor>

  get platinumSponsors() {
    return this.sponsors.filter(s => s.rank === RankEnum.PLATINUM)
  }

  get goldSponsors() {
    return this.sponsors.filter(s => s.rank === RankEnum.GOLD)
  }

  get silverSponsors() {
    return this.sponsors.filter(s => s.rank === RankEnum.SILVER)
  }

  getSponsorImage(s: Sponsor) {
    // Use Mask Corner Radius to display a speaker profile image as an avatar icon.
    // See microCMS image API
    // https://microcms.io/docs/image-api/introduction
    // https://docs.imgix.com/apis/url/mask/corner-radius
    return `${s.image.url}?mask=corners&w=500&h=200&corner-radius=0,0,0,0`
  }
}
</script>

<style lang="stylus">
.sponsor-rank-title
  width: 650px
</style>
